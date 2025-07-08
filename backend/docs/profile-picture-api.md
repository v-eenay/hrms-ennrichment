# Profile Picture Upload API Documentation

## Overview

The HRMS backend now supports comprehensive profile picture upload functionality with automatic image processing, validation, and secure file management. This feature allows users to upload, view, and manage profile pictures with professional image optimization.

## Features

### ✅ **Core Functionality**
- **File Upload**: Secure multipart/form-data file upload with validation
- **Image Processing**: Automatic resizing, optimization, and format standardization
- **Multiple Endpoints**: Upload, retrieve, and delete profile pictures
- **Integration**: Seamless integration with user registration and profile updates
- **Security**: Comprehensive file validation and sanitization

### ✅ **Technical Specifications**
- **Supported Formats**: JPEG, PNG, GIF
- **File Size Limit**: 5MB maximum
- **Image Processing**: Auto-resize to 300x300px, JPEG optimization
- **Storage**: Organized date-based folder structure
- **Validation**: MIME type, file extension, and content validation

## API Endpoints

### 1. Upload Profile Picture
```http
POST /api/users/:id/profile-picture
```

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Body (Form Data):**
```
profilePicture: <image_file>
```

**Response:**
```json
{
  "success": true,
  "message": "Profile picture uploaded successfully",
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "profilePicture": {
      "path": "profile-pictures/2024/07/processed_uuid.jpg",
      "url": "http://localhost:5000/uploads/profile-pictures/2024/07/processed_uuid.jpg",
      "filename": "processed_uuid.jpg",
      "uploadedAt": "2024-07-08T22:30:00.000Z"
    }
  }
}
```

### 2. Get Profile Picture
```http
GET /api/users/:id/profile-picture
```

**Response:**
- **Success**: Returns image file with appropriate headers
- **Headers**: `Content-Type`, `Content-Length`, `Cache-Control`
- **Error**: 404 if profile picture not found

### 3. Delete Profile Picture
```http
DELETE /api/users/:id/profile-picture
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Profile picture removed successfully",
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "profilePicture": {
      "path": null,
      "url": null,
      "filename": null,
      "uploadedAt": null
    }
  }
}
```

### 4. User Registration with Profile Picture
```http
POST /api/users
```

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Body (Form Data):**
```
name: John Doe
email: john@example.com
password: securePassword123
role: employee
profilePicture: <image_file> (optional)
```

## File Structure

### Storage Organization
```
uploads/
└── profile-pictures/
    └── 2024/
        └── 07/
            ├── processed_uuid1.jpg
            ├── thumb_uuid1.jpg
            ├── processed_uuid2.jpg
            └── thumb_uuid2.jpg
```

### Database Schema
```javascript
profilePicture: {
  path: String,        // Relative path to file
  url: String,         // Full URL for access
  filename: String,    // Processed filename
  uploadedAt: Date     // Upload timestamp
}
```

## Security Features

### File Validation
- **MIME Type Check**: Validates `image/jpeg`, `image/png`, `image/gif`
- **Extension Validation**: Checks file extensions match content
- **Size Limits**: 5MB maximum file size
- **Content Validation**: Uses Sharp library for image content verification

### Access Control
- **Authentication**: JWT token required for upload/delete
- **Authorization**: Users can only modify their own profile pictures (or admins)
- **Public Access**: Profile pictures are publicly viewable (GET endpoint)

### File Security
- **Unique Filenames**: UUID-based naming prevents conflicts
- **Path Sanitization**: Prevents directory traversal attacks
- **Organized Storage**: Date-based folder structure for better management

## Error Handling

### Common Error Responses

**File Too Large:**
```json
{
  "success": false,
  "message": "File size too large. Maximum size is 5MB."
}
```

**Invalid File Type:**
```json
{
  "success": false,
  "message": "Invalid file type. Only JPEG, PNG, and GIF images are allowed."
}
```

**User Not Found:**
```json
{
  "success": false,
  "message": "User not found"
}
```

**No File Uploaded:**
```json
{
  "success": false,
  "message": "No file uploaded. Please select a profile picture."
}
```

## Image Processing

### Automatic Optimization
- **Resize**: All images resized to 300x300px
- **Format**: Converted to JPEG for consistency
- **Quality**: 85% JPEG quality for optimal size/quality balance
- **Progressive**: Progressive JPEG encoding for faster loading

### Thumbnail Generation
- **Size**: 100x100px thumbnails created automatically
- **Usage**: For list views and previews
- **Storage**: Stored alongside main images

## Usage Examples

### Frontend Integration (JavaScript)
```javascript
// Upload profile picture
const uploadProfilePicture = async (userId, file) => {
  const formData = new FormData();
  formData.append('profilePicture', file);
  
  const response = await fetch(`/api/users/${userId}/profile-picture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  return response.json();
};

// Get profile picture URL
const getProfilePictureUrl = (userId) => {
  return `/api/users/${userId}/profile-picture`;
};
```

### cURL Examples
```bash
# Upload profile picture
curl -X POST \
  -H "Authorization: Bearer your_jwt_token" \
  -F "profilePicture=@/path/to/image.jpg" \
  http://localhost:5000/api/users/USER_ID/profile-picture

# Get profile picture
curl -X GET \
  http://localhost:5000/api/users/USER_ID/profile-picture \
  --output profile.jpg

# Delete profile picture
curl -X DELETE \
  -H "Authorization: Bearer your_jwt_token" \
  http://localhost:5000/api/users/USER_ID/profile-picture
```

## Performance Considerations

### Optimization Features
- **Image Compression**: Automatic JPEG optimization
- **Caching Headers**: 1-day cache control for profile pictures
- **Efficient Storage**: Date-based organization for better file system performance
- **Stream Processing**: Files served via streams for memory efficiency

### Monitoring
- **Storage Stats**: Built-in storage usage tracking
- **File Cleanup**: Utilities for removing orphaned files
- **Error Logging**: Comprehensive error tracking and logging

## Migration Notes

### Existing Users
- Existing users without profile pictures will have `null` values
- No database migration required - schema is backward compatible
- Old `profileImage` field is replaced with comprehensive `profilePicture` object

### Deployment Considerations
- Ensure `uploads/profile-pictures` directory exists and is writable
- Configure appropriate file system permissions
- Consider cloud storage integration for production environments

## Future Enhancements

### Planned Features
- **Cloud Storage**: AWS S3 integration option
- **Multiple Sizes**: Additional image size variants
- **Image Filters**: Basic image editing capabilities
- **Bulk Operations**: Admin tools for managing multiple profile pictures
- **Analytics**: Upload statistics and usage metrics
