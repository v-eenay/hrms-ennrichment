import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { processProfilePicture, validateImage, generateThumbnail, cleanupTempFile } from '../utils/imageProcessor.js';
import { deleteFile, getFullFilePath, generateFileUrl } from '../middleware/uploadMiddleware.js';

/**
 * FileService class handles all file-related operations
 * Provides methods for uploading, processing, and managing profile pictures
 */
class FileService {
    /**
     * Process and save uploaded profile picture
     * @param {Object} file - Multer file object
     * @param {Object} req - Express request object
     * @returns {Object} Processed file information
     */
    async processProfilePicture(file, req) {
        if (!file) {
            throw new Error('No file provided');
        }

        try {
            // Validate the uploaded image
            const validation = await validateImage(file.path);
            if (!validation.isValid) {
                // Clean up the uploaded file
                cleanupTempFile(file.path);
                throw new Error(validation.error);
            }

            // Generate processed filename
            const processedFilename = `processed_${uuidv4()}.jpg`;
            const processedPath = path.join(path.dirname(file.path), processedFilename);

            // Process the image (resize, optimize, convert to JPEG)
            const processResult = await processProfilePicture(file.path, processedPath);

            // Generate thumbnail
            const thumbnailFilename = `thumb_${uuidv4()}.jpg`;
            const thumbnailPath = path.join(path.dirname(file.path), thumbnailFilename);
            await generateThumbnail(processedPath, thumbnailPath);

            // Clean up the original uploaded file
            cleanupTempFile(file.path);

            // Generate relative paths
            const processedRelativePath = path.relative(
                path.join(process.cwd(), 'uploads'),
                processedPath
            ).replace(/\\/g, '/');

            const thumbnailRelativePath = path.relative(
                path.join(process.cwd(), 'uploads'),
                thumbnailPath
            ).replace(/\\/g, '/');

            // Generate URLs
            const processedUrl = generateFileUrl(req, processedRelativePath);
            const thumbnailUrl = generateFileUrl(req, thumbnailRelativePath);

            return {
                original: {
                    path: processedRelativePath,
                    url: processedUrl,
                    filename: processedFilename,
                    size: processResult.size,
                    width: processResult.width,
                    height: processResult.height
                },
                thumbnail: {
                    path: thumbnailRelativePath,
                    url: thumbnailUrl,
                    filename: thumbnailFilename
                },
                uploadedAt: new Date()
            };
        } catch (error) {
            // Clean up any files that might have been created
            if (file.path) {
                cleanupTempFile(file.path);
            }
            throw error;
        }
    }

    /**
     * Delete profile picture files
     * @param {Object} profilePicture - Profile picture data from user model
     */
    async deleteProfilePicture(profilePicture) {
        if (!profilePicture || !profilePicture.path) {
            return;
        }

        try {
            // Delete main image
            deleteFile(profilePicture.path);

            // Try to delete thumbnail if it exists
            if (profilePicture.thumbnail && profilePicture.thumbnail.path) {
                deleteFile(profilePicture.thumbnail.path);
            }
        } catch (error) {
            console.error('Error deleting profile picture files:', error);
            // Don't throw error as this is cleanup operation
        }
    }

    /**
     * Get profile picture file information
     * @param {string} relativePath - Relative path to the file
     * @param {Object} req - Express request object
     * @returns {Object} File information
     */
    getProfilePictureInfo(relativePath, req) {
        if (!relativePath) {
            return null;
        }

        const fullPath = getFullFilePath(relativePath);
        
        if (!fs.existsSync(fullPath)) {
            return null;
        }

        const stats = fs.statSync(fullPath);
        const url = generateFileUrl(req, relativePath);

        return {
            path: relativePath,
            url: url,
            size: stats.size,
            lastModified: stats.mtime,
            exists: true
        };
    }

    /**
     * Validate file exists and is accessible
     * @param {string} relativePath - Relative path to the file
     * @returns {boolean} True if file exists and is accessible
     */
    validateFileExists(relativePath) {
        if (!relativePath) {
            return false;
        }

        try {
            const fullPath = getFullFilePath(relativePath);
            return fs.existsSync(fullPath);
        } catch (error) {
            return false;
        }
    }

    /**
     * Get file stream for serving files
     * @param {string} relativePath - Relative path to the file
     * @returns {Object} File stream and metadata
     */
    getFileStream(relativePath) {
        if (!relativePath) {
            throw new Error('File path not provided');
        }

        const fullPath = getFullFilePath(relativePath);
        
        if (!fs.existsSync(fullPath)) {
            throw new Error('File not found');
        }

        const stats = fs.statSync(fullPath);
        const stream = fs.createReadStream(fullPath);
        const extension = path.extname(fullPath).toLowerCase();
        
        // Determine content type
        let contentType = 'application/octet-stream';
        switch (extension) {
            case '.jpg':
            case '.jpeg':
                contentType = 'image/jpeg';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.gif':
                contentType = 'image/gif';
                break;
            case '.webp':
                contentType = 'image/webp';
                break;
        }

        return {
            stream,
            contentType,
            size: stats.size,
            lastModified: stats.mtime
        };
    }

    /**
     * Clean up orphaned files (files not referenced in database)
     * This method can be called periodically to clean up unused files
     */
    async cleanupOrphanedFiles() {
        // This would require database access to check which files are still referenced
        // Implementation would depend on specific cleanup requirements
        console.log('Cleanup orphaned files - to be implemented based on requirements');
    }

    /**
     * Get storage statistics
     * @returns {Object} Storage usage information
     */
    getStorageStats() {
        const uploadsDir = path.join(process.cwd(), 'uploads', 'profile-pictures');
        
        if (!fs.existsSync(uploadsDir)) {
            return {
                totalFiles: 0,
                totalSize: 0,
                directories: 0
            };
        }

        let totalFiles = 0;
        let totalSize = 0;
        let directories = 0;

        const calculateStats = (dir) => {
            const items = fs.readdirSync(dir);
            
            items.forEach(item => {
                const itemPath = path.join(dir, item);
                const stats = fs.statSync(itemPath);
                
                if (stats.isDirectory()) {
                    directories++;
                    calculateStats(itemPath);
                } else {
                    totalFiles++;
                    totalSize += stats.size;
                }
            });
        };

        try {
            calculateStats(uploadsDir);
        } catch (error) {
            console.error('Error calculating storage stats:', error);
        }

        return {
            totalFiles,
            totalSize,
            directories,
            totalSizeFormatted: this.formatFileSize(totalSize)
        };
    }

    /**
     * Format file size in human readable format
     * @param {number} bytes - File size in bytes
     * @returns {string} Formatted file size
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

export default new FileService();
