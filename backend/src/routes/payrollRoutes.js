import express from 'express';
import {
    getPayrolls,
    getUserPayroll,
    createPayroll,
    updatePayroll,
    getPaySlip,
    deletePayroll
} from '../controllers/payrollController.js';
import { protect, admin, selfOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Admin only routes
router.get('/', admin, getPayrolls);
router.post('/', admin, createPayroll);
router.put('/:id', admin, updatePayroll);
router.delete('/:id', admin, deletePayroll);

// Mixed access routes
router.get('/user/:userId', getUserPayroll);
router.get('/slip/:id', getPaySlip);

export default router;
