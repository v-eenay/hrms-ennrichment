/**
 * Validation utilities for input data validation
 * Contains functions for validating various data types and formats
 */

/**
 * Validate email format using regex
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email format is valid
 */
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate phone number format (10-15 digits)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if phone number format is valid
 */
export const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\d{10,15}$/;
    return phoneRegex.test(phone);
};

/**
 * Validate password strength with multiple criteria
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid flag and message
 */
export const validatePassword = (password) => {
    if (!password || password.length < 6) {
        return { isValid: false, message: 'Password must be at least 6 characters long' };
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
        return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
        return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }

    // Check for at least one number
    if (!/\d/.test(password)) {
        return { isValid: false, message: 'Password must contain at least one number' };
    }

    return { isValid: true, message: 'Password is valid' };
};

/**
 * Validate required fields in an object
 * @param {Object} data - Data object to validate
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} Validation result with isValid flag and missing fields
 */
export const validateRequiredFields = (data, requiredFields) => {
    const missingFields = [];

    requiredFields.forEach(field => {
        if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
            missingFields.push(field);
        }
    });

    return {
        isValid: missingFields.length === 0,
        missingFields
    };
};

/**
 * Validate MongoDB ObjectId format
 * @param {string} id - ID to validate
 * @returns {boolean} True if ID format is valid
 */
export const validateObjectId = (id) => {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    return objectIdRegex.test(id);
};

/**
 * Validate date format (YYYY-MM-DD)
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if date format is valid
 */
export const validateDate = (dateString) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) return false;

    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
};

/**
 * Validate salary amount (positive number)
 * @param {number} salary - Salary amount to validate
 * @returns {Object} Validation result with isValid flag and message
 */
export const validateSalary = (salary) => {
    if (typeof salary !== 'number' || salary < 0) {
        return { isValid: false, message: 'Salary must be a positive number' };
    }

    if (salary > 10000000) { // 10 million limit
        return { isValid: false, message: 'Salary amount seems unrealistic' };
    }

    return { isValid: true, message: 'Salary is valid' };
};

/**
 * Validate user role
 * @param {string} role - User role to validate
 * @returns {boolean} True if role is valid
 */
export const validateUserRole = (role) => {
    const validRoles = ['admin', 'hr', 'manager', 'employee'];
    return validRoles.includes(role);
};

/**
 * Validate leave type
 * @param {string} leaveType - Leave type to validate
 * @returns {boolean} True if leave type is valid
 */
export const validateLeaveType = (leaveType) => {
    const validLeaveTypes = ['sick', 'vacation', 'personal', 'maternity', 'paternity', 'emergency'];
    return validLeaveTypes.includes(leaveType);
};
