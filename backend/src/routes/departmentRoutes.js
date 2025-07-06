import express from 'express';
import {
    getDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment
} from '../controllers/departmentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// GET routes (accessible to all authenticated users)
router.get('/', getDepartments);
router.get('/:id', getDepartmentById);

// Admin only routes
router.post('/', admin, createDepartment);
router.put('/:id', admin, updateDepartment);
router.delete('/:id', admin, deleteDepartment);

export default router;
