# HTTP-Only Cookie-Based Authentication

## Overview

The HRMS backend now supports secure HTTP-only cookie-based authentication alongside the existing Bearer token authentication. This implementation provides enhanced security and improved developer experience by automatically managing JWT tokens through secure cookies.

## Features

### ✅ **Core Functionality**
- **HTTP-Only Cookies**: JWT tokens stored in secure, HTTP-only cookies
- **Backward Compatibility**: Supports both cookie and Bearer token authentication
- **Automatic Cookie Management**: Login/register automatically sets cookies
- **Secure Configuration**: Environment-specific security settings
- **CSRF Protection**: SameSite cookie attributes for security

### ✅ **Security Features**
- **XSS Protection**: HTTP-only cookies prevent JavaScript access
- **CSRF Protection**: SameSite attributes prevent cross-site attacks
- **Environment-Aware**: Different security settings for dev/production
- **Secure Transport**: HTTPS-only cookies in production
- **Automatic Expiration**: 7-day cookie lifetime with proper cleanup

## API Endpoints

### Enhanced Authentication Endpoints

#### 1. Login (Enhanced)
```http
POST /api/auth/login
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "employee",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "cookieSet": true,
    "cookieInfo": {
      "environment": "development",
      "httpOnly": true,
      "secure": false,
      "sameSite": "lax",
      "maxAgeDays": 7
    }
  }
}
```

**Cookie Set:**
```
Set-Cookie: jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800
```

#### 2. Register (Enhanced)
```http
POST /api/auth/register
```

**Request:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Similar to login with automatic cookie setting

#### 3. Logout (New)
```http
POST /api/auth/logout
```

**Headers:**
```
Authorization: Bearer <token>  // Optional - can use cookie
Cookie: jwt=<token>           // Automatic
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful",
  "data": {
    "message": "Authentication cookie cleared",
    "cookieCleared": true
  }
}
```

#### 4. Authentication Status (New)
```http
GET /api/auth/status
```

**Response:**
```json
{
  "success": true,
  "message": "Authentication status retrieved",
  "data": {
    "authenticated": true,
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "user@example.com"
    },
    "cookieInfo": {
      "environment": "development",
      "httpOnly": true,
      "secure": false,
      "sameSite": "lax",
      "maxAgeDays": 7
    }
  }
}
```

## Cookie Configuration

### Development Environment
```javascript
{
  httpOnly: true,      // Prevent XSS
  secure: false,       // Allow HTTP
  sameSite: 'lax',     // Permissive for development
  maxAge: 604800000,   // 7 days
  path: '/'            // Available for all routes
}
```

### Production Environment
```javascript
{
  httpOnly: true,      // Prevent XSS
  secure: true,        // Require HTTPS
  sameSite: 'strict',  // Strict CSRF protection
  maxAge: 604800000,   // 7 days
  path: '/',           // Available for all routes
  domain: process.env.COOKIE_DOMAIN  // Optional domain setting
}
```

## Authentication Flow

### 1. Traditional Bearer Token (Still Supported)
```javascript
// Frontend request
fetch('/api/users', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  }
});
```

### 2. Cookie-Based Authentication (New)
```javascript
// Frontend request - no manual headers needed
fetch('/api/users', {
  credentials: 'include'  // Include cookies automatically
});
```

### 3. Hybrid Support
The middleware checks for tokens in this order:
1. **HTTP-only cookie** (`req.cookies.jwt`)
2. **Authorization header** (`Bearer <token>`)

## Frontend Integration

### JavaScript/Fetch API
```javascript
// Login and automatically receive cookie
const login = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',  // Important: include cookies
    body: JSON.stringify({ email, password })
  });
  
  return response.json();
};

// Make authenticated requests
const getProfile = async () => {
  const response = await fetch('/api/auth/me', {
    credentials: 'include'  // Automatically sends cookie
  });
  
  return response.json();
};

// Logout and clear cookie
const logout = async () => {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include'
  });
  
  return response.json();
};
```

### Axios Configuration
```javascript
// Configure axios to always include cookies
axios.defaults.withCredentials = true;

// Or per request
const response = await axios.get('/api/auth/me', {
  withCredentials: true
});
```

### React Example
```javascript
// Login component
const handleLogin = async (email, password) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Cookie is automatically set
      // No need to manually store token
      setUser(data.data);
      navigate('/dashboard');
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

## CORS Configuration

### Server Configuration
```javascript
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true  // Essential for cookie support
}));
```

### Frontend Requirements
- Must set `credentials: 'include'` in fetch requests
- Must set `withCredentials: true` in axios requests
- CORS origin must match exactly (no wildcards with credentials)

## Security Considerations

### Protection Against Common Attacks

#### XSS (Cross-Site Scripting)
- **HTTP-Only Cookies**: Tokens cannot be accessed via JavaScript
- **Secure Storage**: No localStorage/sessionStorage vulnerabilities

#### CSRF (Cross-Site Request Forgery)
- **SameSite Attributes**: Prevent cross-site cookie sending
- **Origin Validation**: CORS configuration validates request origins

#### Man-in-the-Middle
- **HTTPS Only**: Production cookies require secure transport
- **Secure Flag**: Prevents transmission over HTTP in production

### Best Practices Implemented
1. **Environment-Specific Settings**: Different security levels for dev/prod
2. **Automatic Expiration**: 7-day token lifetime
3. **Proper Cleanup**: Logout clears cookies completely
4. **Fallback Support**: Bearer tokens still work for API clients

## Migration Guide

### For Existing Applications
1. **No Breaking Changes**: Existing Bearer token auth still works
2. **Gradual Migration**: Can switch endpoints one by one
3. **Frontend Updates**: Add `credentials: 'include'` to requests
4. **Remove Manual Token Management**: No need to store/manage tokens

### For New Applications
1. **Use Cookie Auth**: Simpler and more secure
2. **Set Credentials**: Always include credentials in requests
3. **Handle Logout**: Use the logout endpoint to clear cookies
4. **Check Status**: Use `/api/auth/status` to verify authentication

## Testing

### Manual Testing with cURL
```bash
# Login and save cookies
curl -c cookies.txt -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  http://localhost:5000/api/auth/login

# Use cookies for authenticated request
curl -b cookies.txt \
  http://localhost:5000/api/auth/me

# Logout and clear cookies
curl -b cookies.txt -c cookies.txt -X POST \
  http://localhost:5000/api/auth/logout
```

### Browser DevTools
1. **Application Tab**: View cookies in browser storage
2. **Network Tab**: See `Set-Cookie` headers in responses
3. **Console**: Test with `document.cookie` (should not show JWT)

## Troubleshooting

### Common Issues

#### Cookies Not Being Set
- Check CORS `credentials: true` setting
- Verify frontend includes `credentials: 'include'`
- Ensure domain/origin matches exactly

#### Authentication Failing
- Check cookie expiration
- Verify cookie path and domain settings
- Test with both cookie and Bearer token methods

#### CORS Errors
- Confirm origin matches server CORS configuration
- Ensure credentials are enabled on both client and server
- Check for wildcard origins (not allowed with credentials)

The cookie-based authentication system provides a more secure and user-friendly authentication experience while maintaining full backward compatibility with existing Bearer token implementations.
