import express from 'express';
import {
    applyLeave,
    getLeaves,
    getUserLeaves,
    getLeaveById,
    approveLeave,
    rejectLeave,
    cancelLeave
} from '../controllers/leaveController.js';
import { protect, admin, manager } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Employee routes
router.post('/', applyLeave);

// Manager/Admin routes
router.get('/', manager, getLeaves);
router.put('/:id/approve', manager, approveLeave);
router.put('/:id/reject', manager, rejectLeave);

// Mixed access routes
router.get('/user/:userId', getUserLeaves);
router.get('/:id', getLeaveById);
router.delete('/:id', cancelLeave);

export default router;
