import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

/**
 * Image processing utility for profile pictures
 * Handles resizing, optimization, and format conversion
 */

/**
 * Profile picture configuration
 */
const PROFILE_PICTURE_CONFIG = {
    width: 300,
    height: 300,
    quality: 85,
    format: 'jpeg'
};

/**
 * Process uploaded profile picture
 * Resizes, optimizes, and converts to standard format
 * 
 * @param {string} inputPath - Path to the uploaded file
 * @param {string} outputPath - Path where processed file should be saved
 * @returns {Promise<Object>} Processing result with file info
 */
export const processProfilePicture = async (inputPath, outputPath) => {
    try {
        // Ensure output directory exists
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Process the image
        const processedImage = await sharp(inputPath)
            .resize(PROFILE_PICTURE_CONFIG.width, PROFILE_PICTURE_CONFIG.height, {
                fit: 'cover',
                position: 'center'
            })
            .jpeg({
                quality: PROFILE_PICTURE_CONFIG.quality,
                progressive: true
            })
            .toFile(outputPath);

        // Get file stats
        const stats = fs.statSync(outputPath);

        return {
            success: true,
            width: processedImage.width,
            height: processedImage.height,
            size: stats.size,
            format: 'jpeg',
            path: outputPath
        };
    } catch (error) {
        throw new Error(`Image processing failed: ${error.message}`);
    }
};

/**
 * Validate image file before processing
 * Checks if file is a valid image and meets requirements
 * 
 * @param {string} filePath - Path to the file to validate
 * @returns {Promise<Object>} Validation result
 */
export const validateImage = async (filePath) => {
    try {
        const metadata = await sharp(filePath).metadata();
        
        // Check if it's a valid image
        if (!metadata.format) {
            return {
                isValid: false,
                error: 'File is not a valid image'
            };
        }

        // Check supported formats
        const supportedFormats = ['jpeg', 'jpg', 'png', 'gif', 'webp'];
        if (!supportedFormats.includes(metadata.format.toLowerCase())) {
            return {
                isValid: false,
                error: `Unsupported image format: ${metadata.format}`
            };
        }

        // Check dimensions (minimum requirements)
        const minDimension = 50;
        const maxDimension = 5000;
        
        if (metadata.width < minDimension || metadata.height < minDimension) {
            return {
                isValid: false,
                error: `Image too small. Minimum dimensions: ${minDimension}x${minDimension}px`
            };
        }

        if (metadata.width > maxDimension || metadata.height > maxDimension) {
            return {
                isValid: false,
                error: `Image too large. Maximum dimensions: ${maxDimension}x${maxDimension}px`
            };
        }

        return {
            isValid: true,
            metadata: {
                width: metadata.width,
                height: metadata.height,
                format: metadata.format,
                size: metadata.size,
                hasAlpha: metadata.hasAlpha
            }
        };
    } catch (error) {
        return {
            isValid: false,
            error: `Image validation failed: ${error.message}`
        };
    }
};

/**
 * Generate thumbnail from profile picture
 * Creates a smaller version for use in lists or previews
 * 
 * @param {string} inputPath - Path to the source image
 * @param {string} outputPath - Path where thumbnail should be saved
 * @param {number} size - Thumbnail size (default: 100px)
 * @returns {Promise<Object>} Thumbnail generation result
 */
export const generateThumbnail = async (inputPath, outputPath, size = 100) => {
    try {
        const thumbnail = await sharp(inputPath)
            .resize(size, size, {
                fit: 'cover',
                position: 'center'
            })
            .jpeg({
                quality: 80,
                progressive: true
            })
            .toFile(outputPath);

        return {
            success: true,
            width: thumbnail.width,
            height: thumbnail.height,
            path: outputPath
        };
    } catch (error) {
        throw new Error(`Thumbnail generation failed: ${error.message}`);
    }
};

/**
 * Clean up temporary files
 * Removes uploaded files that failed processing
 * 
 * @param {string} filePath - Path to the file to clean up
 */
export const cleanupTempFile = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (error) {
        console.error('Error cleaning up temporary file:', error);
    }
};

/**
 * Get image dimensions without loading the full image
 * Useful for quick metadata checks
 * 
 * @param {string} filePath - Path to the image file
 * @returns {Promise<Object>} Image dimensions and basic info
 */
export const getImageInfo = async (filePath) => {
    try {
        const metadata = await sharp(filePath).metadata();
        return {
            width: metadata.width,
            height: metadata.height,
            format: metadata.format,
            size: metadata.size,
            hasAlpha: metadata.hasAlpha,
            density: metadata.density
        };
    } catch (error) {
        throw new Error(`Failed to get image info: ${error.message}`);
    }
};
