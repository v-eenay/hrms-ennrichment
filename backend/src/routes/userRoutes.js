import express from 'express';
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUsersByDepartment
} from '../controllers/userController.js';
import { protect, admin, selfOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin routes
router.get('/', protect, admin, getUsers);
router.post('/', protect, admin, createUser);
router.put('/:id', protect, admin, updateUser);
router.delete('/:id', protect, admin, deleteUser);

// Mixed access routes
router.get('/department/:departmentId', protect, getUsersByDepartment);
router.get('/:id', protect, selfOrAdmin, getUserById);

export default router;
