/**
 * Cookie configuration utility for JWT authentication
 * Provides secure cookie settings for different environments
 */

/**
 * Get cookie configuration based on environment
 * @param {string} environment - Current environment (development, production, test)
 * @returns {Object} Cookie configuration object
 */
export const getCookieConfig = (environment = process.env.NODE_ENV) => {
    const isProduction = environment === 'production';
    const isDevelopment = environment === 'development';
    
    // Base configuration
    const config = {
        httpOnly: true,              // Prevent XSS attacks
        secure: isProduction,        // HTTPS only in production
        sameSite: isProduction ? 'strict' : 'lax',  // CSRF protection
        maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days in milliseconds
        path: '/',                   // Available for all routes
    };

    // Development-specific settings
    if (isDevelopment) {
        config.secure = false;       // Allow HTTP in development
        config.sameSite = 'lax';     // More permissive for development
    }

    // Production-specific settings
    if (isProduction) {
        config.secure = true;        // Require HTTPS
        config.sameSite = 'strict';  // Strict CSRF protection
        config.domain = process.env.COOKIE_DOMAIN || undefined;  // Set domain if specified
    }

    return config;
};

/**
 * Get cookie configuration for clearing/logout
 * @param {string} environment - Current environment
 * @returns {Object} Cookie configuration for clearing
 */
export const getClearCookieConfig = (environment = process.env.NODE_ENV) => {
    const baseConfig = getCookieConfig(environment);
    
    return {
        ...baseConfig,
        maxAge: 0,                   // Expire immediately
        expires: new Date(0),        // Set expiration to past date
    };
};

/**
 * Cookie names used in the application
 */
export const COOKIE_NAMES = {
    JWT: 'jwt',
    REFRESH_TOKEN: 'refreshToken',  // For future refresh token implementation
};

/**
 * Set JWT cookie in response
 * @param {Object} res - Express response object
 * @param {string} token - JWT token to set
 * @param {string} environment - Current environment
 */
export const setJWTCookie = (res, token, environment = process.env.NODE_ENV) => {
    const cookieConfig = getCookieConfig(environment);
    res.cookie(COOKIE_NAMES.JWT, token, cookieConfig);
};

/**
 * Clear JWT cookie from response
 * @param {Object} res - Express response object
 * @param {string} environment - Current environment
 */
export const clearJWTCookie = (res, environment = process.env.NODE_ENV) => {
    const clearConfig = getClearCookieConfig(environment);
    res.cookie(COOKIE_NAMES.JWT, '', clearConfig);
};

/**
 * Extract JWT token from request (cookies or headers)
 * @param {Object} req - Express request object
 * @returns {string|null} JWT token or null if not found
 */
export const extractJWTToken = (req) => {
    // First check cookies
    if (req.cookies && req.cookies[COOKIE_NAMES.JWT]) {
        return req.cookies[COOKIE_NAMES.JWT];
    }
    
    // Fallback to Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        return req.headers.authorization.split(' ')[1];
    }
    
    return null;
};

/**
 * Validate cookie configuration
 * @param {Object} config - Cookie configuration to validate
 * @returns {boolean} True if configuration is valid
 */
export const validateCookieConfig = (config) => {
    const requiredFields = ['httpOnly', 'secure', 'sameSite', 'maxAge', 'path'];
    
    for (const field of requiredFields) {
        if (!(field in config)) {
            console.warn(`Cookie configuration missing required field: ${field}`);
            return false;
        }
    }
    
    // Validate sameSite values
    const validSameSiteValues = ['strict', 'lax', 'none'];
    if (!validSameSiteValues.includes(config.sameSite)) {
        console.warn(`Invalid sameSite value: ${config.sameSite}`);
        return false;
    }
    
    // Validate maxAge
    if (typeof config.maxAge !== 'number' || config.maxAge < 0) {
        console.warn(`Invalid maxAge value: ${config.maxAge}`);
        return false;
    }
    
    return true;
};

/**
 * Get cookie security info for logging/debugging
 * @param {string} environment - Current environment
 * @returns {Object} Cookie security information
 */
export const getCookieSecurityInfo = (environment = process.env.NODE_ENV) => {
    const config = getCookieConfig(environment);
    
    return {
        environment,
        httpOnly: config.httpOnly,
        secure: config.secure,
        sameSite: config.sameSite,
        maxAge: config.maxAge,
        maxAgeDays: Math.round(config.maxAge / (24 * 60 * 60 * 1000)),
        isProduction: environment === 'production',
        isDevelopment: environment === 'development',
    };
};
