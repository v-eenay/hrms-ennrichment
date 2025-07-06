import { Department } from '../models/departmentModel.js';

// @desc    Get all departments
// @route   GET /api/departments
// @access  Private
export const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find({}).populate('head', 'name email');
        res.json({
            count: departments.length,
            departments
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get department by ID
// @route   GET /api/departments/:id
// @access  Private
export const getDepartmentById = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id).populate('head', 'name email');
        if (department) {
            res.json(department);
        } else {
            res.status(404).json({ message: 'Department not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new department
// @route   POST /api/departments
// @access  Private/Admin
export const createDepartment = async (req, res) => {
    try {
        const { name, description, head, budget } = req.body;

        // Check if department exists
        const departmentExists = await Department.findOne({ name });
        if (departmentExists) {
            return res.status(400).json({ message: 'Department already exists' });
        }

        // Create department
        const department = await Department.create({
            name,
            description,
            head,
            budget
        });

        const createdDepartment = await Department.findById(department._id).populate('head', 'name email');
        res.status(201).json(createdDepartment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private/Admin
export const updateDepartment = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);

        if (department) {
            department.name = req.body.name || department.name;
            department.description = req.body.description || department.description;
            department.head = req.body.head || department.head;
            department.budget = req.body.budget || department.budget;
            department.isActive = req.body.isActive !== undefined ? req.body.isActive : department.isActive;

            const updatedDepartment = await department.save();
            const populatedDepartment = await Department.findById(updatedDepartment._id).populate('head', 'name email');
            res.json(populatedDepartment);
        } else {
            res.status(404).json({ message: 'Department not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private/Admin
export const deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);

        if (department) {
            await Department.findByIdAndDelete(req.params.id);
            res.json({ message: 'Department removed' });
        } else {
            res.status(404).json({ message: 'Department not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
