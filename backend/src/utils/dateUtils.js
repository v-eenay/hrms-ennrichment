// Calculate total working hours between two dates
export const calculateWorkingHours = (clockIn, clockOut) => {
    if (!clockIn || !clockOut) return 0;
    
    const timeDiff = clockOut.getTime() - clockIn.getTime();
    return Math.round((timeDiff / (1000 * 60 * 60)) * 100) / 100;
};

// Calculate total days between two dates
export const calculateTotalDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
};

// Format date to YYYY-MM-DD
export const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0];
};

// Get current date with time set to 00:00:00
export const getToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};

// Check if date is a weekend
export const isWeekend = (date) => {
    const day = new Date(date).getDay();
    return day === 0 || day === 6; // Sunday or Saturday
};
