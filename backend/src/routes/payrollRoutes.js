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

/**
 * @swagger
 * /api/payroll:
 *   get:
 *     summary: Get all payroll records (Admin only)
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *           pattern: "^(0[1-9]|1[0-2])$"
 *         description: Filter by month (01-12)
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filter by year
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *     responses:
 *       200:
 *         description: Payroll records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Payroll'
 *       401:
 *         description: Unauthorized - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Create payroll record (Admin only)
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - month
 *               - year
 *               - basicSalary
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "60d5ecb74b24c1001f8e8b12"
 *               month:
 *                 type: string
 *                 pattern: "^(0[1-9]|1[0-2])$"
 *                 example: "01"
 *               year:
 *                 type: integer
 *                 minimum: 2020
 *                 example: 2024
 *               basicSalary:
 *                 type: number
 *                 minimum: 0
 *                 example: 75000
 *               allowances:
 *                 type: object
 *                 properties:
 *                   houseRent:
 *                     type: number
 *                     default: 0
 *                     example: 15000
 *                   transport:
 *                     type: number
 *                     default: 0
 *                     example: 5000
 *                   medical:
 *                     type: number
 *                     default: 0
 *                     example: 3000
 *                   other:
 *                     type: number
 *                     default: 0
 *                     example: 2000
 *               deductions:
 *                 type: object
 *                 properties:
 *                   tax:
 *                     type: number
 *                     default: 0
 *                     example: 7500
 *                   providentFund:
 *                     type: number
 *                     default: 0
 *                     example: 9000
 *                   insurance:
 *                     type: number
 *                     default: 0
 *                     example: 1500
 *                   other:
 *                     type: number
 *                     default: 0
 *                     example: 500
 *     responses:
 *       201:
 *         description: Payroll record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Payroll'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Payroll record already exists for this month
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', admin, getPayrolls);
router.post('/', admin, createPayroll);

/**
 * @swagger
 * /api/payroll/{id}:
 *   put:
 *     summary: Update payroll record (Admin only)
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payroll record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               basicSalary:
 *                 type: number
 *                 minimum: 0
 *                 example: 80000
 *               allowances:
 *                 type: object
 *                 properties:
 *                   houseRent:
 *                     type: number
 *                     example: 16000
 *                   transport:
 *                     type: number
 *                     example: 5500
 *                   medical:
 *                     type: number
 *                     example: 3500
 *                   other:
 *                     type: number
 *                     example: 2500
 *               deductions:
 *                 type: object
 *                 properties:
 *                   tax:
 *                     type: number
 *                     example: 8000
 *                   providentFund:
 *                     type: number
 *                     example: 9600
 *                   insurance:
 *                     type: number
 *                     example: 1600
 *                   other:
 *                     type: number
 *                     example: 600
 *               status:
 *                 type: string
 *                 enum: [pending, paid, cancelled]
 *                 example: "paid"
 *     responses:
 *       200:
 *         description: Payroll record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Payroll'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Payroll record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete payroll record (Admin only)
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payroll record ID
 *     responses:
 *       200:
 *         description: Payroll record deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         message:
 *                           type: string
 *                           example: "Payroll record deleted successfully"
 *       401:
 *         description: Unauthorized - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Payroll record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', admin, updatePayroll);
router.delete('/:id', admin, deletePayroll);

/**
 * @swagger
 * /api/payroll/user/{userId}:
 *   get:
 *     summary: Get user payroll records
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *           pattern: "^(0[1-9]|1[0-2])$"
 *         description: Filter by month (01-12)
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filter by year
 *     responses:
 *       200:
 *         description: User payroll records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Payroll'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/user/:userId', getUserPayroll);

/**
 * @swagger
 * /api/payroll/slip/{id}:
 *   get:
 *     summary: Get payslip for payroll record
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payroll record ID
 *     responses:
 *       200:
 *         description: Payslip retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         payroll:
 *                           $ref: '#/components/schemas/Payroll'
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *                         payslipUrl:
 *                           type: string
 *                           example: "/payslips/payslip-2024-01-user123.pdf"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Payroll record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/slip/:id', getPaySlip);

export default router;
