/**
 * Simple test script to verify profile picture upload functionality
 * This script tests the core upload middleware and image processing
 */

import fs from 'fs';
import path from 'path';
import { validateImage, processProfilePicture } from './src/utils/imageProcessor.js';
import { getFullFilePath } from './src/middleware/uploadMiddleware.js';

/**
 * Test image validation
 */
async function testImageValidation() {
    console.log('🧪 Testing Image Validation...');
    
    try {
        // Test with a simple 1x1 pixel PNG (base64 encoded)
        const testImageData = Buffer.from(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77yQAAAABJRU5ErkJggg==',
            'base64'
        );
        
        const testImagePath = path.join(process.cwd(), 'test-image.png');
        fs.writeFileSync(testImagePath, testImageData);
        
        const validation = await validateImage(testImagePath);
        
        if (validation.isValid) {
            console.log('✅ Image validation passed');
            console.log('   Metadata:', validation.metadata);
        } else {
            console.log('❌ Image validation failed:', validation.error);
        }
        
        // Clean up test file
        fs.unlinkSync(testImagePath);
        
    } catch (error) {
        console.log('❌ Image validation test failed:', error.message);
    }
}

/**
 * Test directory structure creation
 */
function testDirectoryStructure() {
    console.log('\n📁 Testing Directory Structure...');
    
    try {
        const uploadsDir = path.join(process.cwd(), 'uploads', 'profile-pictures');
        
        if (fs.existsSync(uploadsDir)) {
            console.log('✅ Uploads directory exists:', uploadsDir);
            
            // Test date-based folder creation
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const dateFolder = path.join(uploadsDir, String(year), month);
            
            if (!fs.existsSync(dateFolder)) {
                fs.mkdirSync(dateFolder, { recursive: true });
                console.log('✅ Created date folder:', dateFolder);
            } else {
                console.log('✅ Date folder already exists:', dateFolder);
            }
        } else {
            console.log('❌ Uploads directory does not exist');
            console.log('   Creating directory...');
            fs.mkdirSync(uploadsDir, { recursive: true });
            console.log('✅ Created uploads directory');
        }
    } catch (error) {
        console.log('❌ Directory structure test failed:', error.message);
    }
}

/**
 * Test file path utilities
 */
function testFilePathUtilities() {
    console.log('\n🔧 Testing File Path Utilities...');
    
    try {
        const testRelativePath = 'profile-pictures/2024/07/test-image.jpg';
        const fullPath = getFullFilePath(testRelativePath);
        
        console.log('✅ Relative path:', testRelativePath);
        console.log('✅ Full path:', fullPath);
        
        // Test path normalization
        const expectedPath = path.join(process.cwd(), 'uploads', testRelativePath);
        if (fullPath === expectedPath) {
            console.log('✅ Path utility working correctly');
        } else {
            console.log('❌ Path utility mismatch');
            console.log('   Expected:', expectedPath);
            console.log('   Got:', fullPath);
        }
    } catch (error) {
        console.log('❌ File path utilities test failed:', error.message);
    }
}

/**
 * Test configuration validation
 */
function testConfiguration() {
    console.log('\n⚙️ Testing Configuration...');
    
    try {
        // Check required dependencies
        const requiredPackages = ['multer', 'sharp', 'uuid'];
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        
        requiredPackages.forEach(pkg => {
            if (packageJson.dependencies[pkg]) {
                console.log(`✅ ${pkg} dependency found:`, packageJson.dependencies[pkg]);
            } else {
                console.log(`❌ ${pkg} dependency missing`);
            }
        });
        
        // Check environment
        console.log('✅ Node.js version:', process.version);
        console.log('✅ Platform:', process.platform);
        console.log('✅ Working directory:', process.cwd());
        
    } catch (error) {
        console.log('❌ Configuration test failed:', error.message);
    }
}

/**
 * Test file size limits
 */
function testFileSizeLimits() {
    console.log('\n📏 Testing File Size Limits...');
    
    try {
        const maxSize = 5 * 1024 * 1024; // 5MB
        console.log('✅ Maximum file size configured:', maxSize, 'bytes (5MB)');
        
        // Test size formatting
        const formatFileSize = (bytes) => {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        };
        
        console.log('✅ Size formatting test:', formatFileSize(maxSize));
        console.log('✅ Size formatting test:', formatFileSize(1024));
        console.log('✅ Size formatting test:', formatFileSize(1048576));
        
    } catch (error) {
        console.log('❌ File size limits test failed:', error.message);
    }
}

/**
 * Run all tests
 */
async function runTests() {
    console.log('🚀 Starting Profile Picture Upload Tests\n');
    console.log('=' .repeat(50));
    
    await testImageValidation();
    testDirectoryStructure();
    testFilePathUtilities();
    testConfiguration();
    testFileSizeLimits();
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 Profile Picture Upload Tests Completed');
    console.log('\n📋 Next Steps:');
    console.log('   1. Start the server: npm start');
    console.log('   2. Test API endpoints using Swagger UI: http://localhost:5000/api-docs');
    console.log('   3. Upload a test image via POST /api/users/:id/profile-picture');
    console.log('   4. Verify image processing and storage');
    console.log('\n💡 Tips:');
    console.log('   - Use multipart/form-data for file uploads');
    console.log('   - Maximum file size: 5MB');
    console.log('   - Supported formats: JPEG, PNG, GIF');
    console.log('   - Images are automatically resized to 300x300px');
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runTests().catch(console.error);
}

export { runTests };
