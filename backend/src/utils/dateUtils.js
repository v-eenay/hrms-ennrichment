/**
 * Date utility functions for HRMS application
 * Contains functions for date calculations, formatting, and validation
 */

/**
 * Calculate total working hours between clock in and clock out times
 * @param {Date} clockIn - Clock in time
 * @param {Date} clockOut - Clock out time
 * @returns {number} Total working hours (rounded to 2 decimal places)
 */
export const calculateWorkingHours = (clockIn, clockOut) => {
    if (!clockIn || !clockOut) return 0;

    const timeDiff = clockOut.getTime() - clockIn.getTime();
    return Math.round((timeDiff / (1000 * 60 * 60)) * 100) / 100;
};

/**
 * Calculate total days between two dates (inclusive)
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {number} Total number of days including start and end dates
 */
export const calculateTotalDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
};

/**
 * Format date to YYYY-MM-DD string
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0];
};

/**
 * Get current date with time set to 00:00:00
 * @returns {Date} Today's date at midnight
 */
export const getToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};

/**
 * Check if a given date falls on a weekend (Saturday or Sunday)
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is weekend
 */
export const isWeekend = (date) => {
    const day = new Date(date).getDay();
    return day === 0 || day === 6; // Sunday or Saturday
};

/**
 * Get the start and end of a given month
 * @param {number} year - Year
 * @param {number} month - Month (1-12)
 * @returns {Object} Object with startDate and endDate
 */
export const getMonthRange = (year, month) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    return { startDate, endDate };
};

/**
 * Calculate business days between two dates (excluding weekends)
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {number} Number of business days
 */
export const calculateBusinessDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let businessDays = 0;

    const currentDate = new Date(start);
    while (currentDate <= end) {
        if (!isWeekend(currentDate)) {
            businessDays++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return businessDays;
};

/**
 * Format time to HH:MM format
 * @param {Date} date - Date object to format
 * @returns {string} Time in HH:MM format
 */
export const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Check if a date is in the past
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is in the past
 */
export const isPastDate = (date) => {
    const inputDate = new Date(date);
    const today = getToday();
    return inputDate < today;
};

/**
 * Check if a date is in the future
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is in the future
 */
export const isFutureDate = (date) => {
    const inputDate = new Date(date);
    const today = getToday();
    return inputDate > today;
};

/**
 * Get age from birth date
 * @param {Date|string} birthDate - Birth date
 * @returns {number} Age in years
 */
export const calculateAge = (birthDate) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
};
