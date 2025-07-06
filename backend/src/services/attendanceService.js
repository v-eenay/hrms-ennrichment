import { Attendance } from '../models/attendanceModel.js';
import { calculateWorkingHours, getToday } from '../utils/dateUtils.js';

class AttendanceService {
    // Clock in
    async clockIn(userId) {
        const today = getToday();

        // Check if already clocked in today
        const existingAttendance = await Attendance.findOne({
            userId,
            date: today
        });

        if (existingAttendance && existingAttendance.clockIn) {
            throw new Error('Already clocked in today');
        }

        let attendance;
        if (existingAttendance) {
            existingAttendance.clockIn = new Date();
            existingAttendance.status = 'present';
            attendance = await existingAttendance.save();
        } else {
            attendance = await Attendance.create({
                userId,
                date: today,
                clockIn: new Date(),
                status: 'present'
            });
        }

        return await Attendance.findById(attendance._id).populate('userId', 'name email');
    }

    // Clock out
    async clockOut(userId) {
        const today = getToday();

        const attendance = await Attendance.findOne({
            userId,
            date: today
        });

        if (!attendance || !attendance.clockIn) {
            throw new Error('Must clock in first');
        }

        if (attendance.clockOut) {
            throw new Error('Already clocked out today');
        }

        attendance.clockOut = new Date();
        attendance.totalHours = calculateWorkingHours(attendance.clockIn, attendance.clockOut);

        await attendance.save();

        return await Attendance.findById(attendance._id).populate('userId', 'name email');
    }

    // Get user attendance
    async getUserAttendance(userId, startDate, endDate) {
        let query = { userId };
        
        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        return await Attendance.find(query)
            .populate('userId', 'name email')
            .sort({ date: -1 });
    }

    // Get attendance report
    async getAttendanceReport(filters = {}) {
        const { startDate, endDate, department } = filters;

        let matchQuery = {};
        
        if (startDate && endDate) {
            matchQuery.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        let pipeline = [
            { $match: matchQuery },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' }
        ];

        if (department) {
            pipeline.push({
                $match: { 'user.department': department }
            });
        }

        return await Attendance.aggregate(pipeline);
    }

    // Update attendance
    async updateAttendance(id, updateData) {
        const attendance = await Attendance.findById(id);
        if (!attendance) {
            throw new Error('Attendance record not found');
        }

        attendance.status = updateData.status || attendance.status;
        attendance.notes = updateData.notes || attendance.notes;
        attendance.clockIn = updateData.clockIn || attendance.clockIn;
        attendance.clockOut = updateData.clockOut || attendance.clockOut;

        // Recalculate total hours if both times are present
        if (attendance.clockIn && attendance.clockOut) {
            attendance.totalHours = calculateWorkingHours(attendance.clockIn, attendance.clockOut);
        }

        const updatedAttendance = await attendance.save();
        return await Attendance.findById(updatedAttendance._id).populate('userId', 'name email');
    }

    // Get attendance statistics
    async getAttendanceStats(userId, month, year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const attendance = await Attendance.find({
            userId,
            date: { $gte: startDate, $lte: endDate }
        });

        const totalDays = attendance.length;
        const presentDays = attendance.filter(a => a.status === 'present').length;
        const absentDays = attendance.filter(a => a.status === 'absent').length;
        const leaveDays = attendance.filter(a => a.status === 'leave').length;
        const totalHours = attendance.reduce((sum, a) => sum + (a.totalHours || 0), 0);

        return {
            totalDays,
            presentDays,
            absentDays,
            leaveDays,
            totalHours,
            attendancePercentage: totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0
        };
    }
}

export default new AttendanceService();
