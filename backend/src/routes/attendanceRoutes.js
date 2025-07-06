import express from 'express';
import {
    clockIn,
    clockOut,
    getUserAttendance,
    getAttendanceReport,
    updateAttendance
} from '../controllers/attendanceController.js';
import { protect, admin, manager } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Employee routes
router.post('/clock-in', clockIn);
router.post('/clock-out', clockOut);

// Manager/Admin routes
router.get('/report', manager, getAttendanceReport);
router.put('/:id', admin, updateAttendance);

// Mixed access routes
router.get('/user/:userId', getUserAttendance);

export default router;
