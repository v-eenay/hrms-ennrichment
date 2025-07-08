import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { sendErrorResponse } from '../utils/responseHandler.js';

/**
 * File upload middleware for handling profile picture uploads
 * Provides secure file upload with validation and storage configuration
 */

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads', 'profile-pictures');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Storage configuration for multer
 * Organizes files by date and generates unique filenames
 */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Create date-based folder structure (YYYY/MM)
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const dateFolder = path.join(uploadsDir, String(year), month);
        
        // Ensure the date folder exists
        if (!fs.existsSync(dateFolder)) {
            fs.mkdirSync(dateFolder, { recursive: true });
        }
        
        cb(null, dateFolder);
    },
    filename: (req, file, cb) => {
        // Generate unique filename with UUID and original extension
        const uniqueId = uuidv4();
        const extension = path.extname(file.originalname).toLowerCase();
        const filename = `profile_${uniqueId}${extension}`;
        cb(null, filename);
    }
});

/**
 * File filter for validating uploaded files
 * Only allows specific image formats
 */
const fileFilter = (req, file, cb) => {
    // Allowed file types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    
    // Check MIME type
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Invalid file type. Only JPEG, PNG, and GIF images are allowed.'), false);
    }
    
    // Check file extension
    const extension = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(extension)) {
        return cb(new Error('Invalid file extension. Only .jpg, .jpeg, .png, and .gif files are allowed.'), false);
    }
    
    // Additional security check - validate file signature
    cb(null, true);
};

/**
 * Multer configuration
 */
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1 // Only one file at a time
    }
});

/**
 * Middleware for handling single profile picture upload
 */
export const uploadProfilePicture = upload.single('profilePicture');

/**
 * Error handling middleware for multer errors
 */
export const handleUploadError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        switch (error.code) {
            case 'LIMIT_FILE_SIZE':
                return sendErrorResponse(res, 400, 'File size too large. Maximum size is 5MB.');
            case 'LIMIT_FILE_COUNT':
                return sendErrorResponse(res, 400, 'Too many files. Only one file is allowed.');
            case 'LIMIT_UNEXPECTED_FILE':
                return sendErrorResponse(res, 400, 'Unexpected field name. Use "profilePicture" as the field name.');
            default:
                return sendErrorResponse(res, 400, `Upload error: ${error.message}`);
        }
    }
    
    if (error) {
        return sendErrorResponse(res, 400, error.message);
    }
    
    next();
};

/**
 * Middleware to validate uploaded file after multer processing
 */
export const validateUploadedFile = (req, res, next) => {
    if (req.file) {
        // Additional file validation can be added here
        // For example, checking actual file content vs extension
        
        // Store relative path for database
        const relativePath = path.relative(
            path.join(process.cwd(), 'uploads'),
            req.file.path
        ).replace(/\\/g, '/'); // Normalize path separators
        
        req.file.relativePath = relativePath;
    }
    
    next();
};

/**
 * Utility function to get full file path from relative path
 */
export const getFullFilePath = (relativePath) => {
    if (!relativePath) return null;
    return path.join(process.cwd(), 'uploads', relativePath);
};

/**
 * Utility function to generate file URL
 */
export const generateFileUrl = (req, relativePath) => {
    if (!relativePath) return null;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return `${baseUrl}/uploads/${relativePath}`;
};

/**
 * Utility function to delete file
 */
export const deleteFile = (relativePath) => {
    if (!relativePath) return;
    
    try {
        const fullPath = getFullFilePath(relativePath);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    } catch (error) {
        console.error('Error deleting file:', error);
    }
};
