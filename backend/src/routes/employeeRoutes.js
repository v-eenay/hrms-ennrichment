import express from 'express'
import { Employee } from '../models/employeeModel.js'
const router = express.Router()

// Middleware to parse JSON bodies
router.use(express.json())

// Route to save an employee to the database
router.post('/', async (req, res) =>{
  try{
    if(
      !req.body.employeeId ||
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.email ||
      !req.body.department ||
      !req.body.position ||
      !req.body.hireDate ||
      req.body.salary === undefined
    ){
      return res.status(400).send({
        message: 'Send all required fields: employeeId, firstName, lastName, email, department, position, hireDate, salary',
      });
    }
    else{
      const newEmployee = {
        employeeId: req.body.employeeId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        department: req.body.department,
        position: req.body.position,
        hireDate: req.body.hireDate,
        salary: req.body.salary,
        status: req.body.status || 'active',
        manager: req.body.manager || null,
      }
      const employee = await Employee.create(newEmployee);
      return res.status(201).send(employee);
    }
  }
  catch(error){
    console.log(error.message);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).send({
        message: `${field} already exists. Please use a different ${field}.`
      });
    }
    res.status(500).send({message: error.message});
  }
});

// Route to get all employees from the database with optional filtering

router.get('/', async(req, res)=>{
  try{
    // Build filter object based on query parameters
    const filter = {};
    if (req.query.department) filter.department = req.query.department;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.position) filter.position = req.query.position;
    
    const employees = await Employee.find(filter).populate('manager', 'firstName lastName employeeId');
    if(employees.length === 0){
      return res.status(404).send({message: 'No employees found'});
    }
    return res.status(200).json(
      {
        message: 'Employees retrieved successfully',
        count: employees.length,
        employees: employees
      }
    );
  }
  catch(error){
    console.log(error.message);
    res.status(500).send({message: error.message});
  }
});

// Route to get one employee from the database by id

router.get('/:id',async(req,res)=>{
  try{
    const {id} = req.params;
    const employee = await Employee.findById(id).populate('manager', 'firstName lastName employeeId');
    if(!employee){
      return res.status(404).send({message: 'Employee not found'});
    }
    return res.status(200).json({
      message: 'Employee retrieved successfully',
      employee: employee
    });
  }
  catch(error){
    console.log(error.message);
    res.status(500).send({message: error.message});
  }
})

// Route to update an employee by id

router.put(
    '/:id',
    async (req, res)=>{
        try{
            if(
                !req.body.employeeId ||
                !req.body.firstName ||
                !req.body.lastName ||
                !req.body.email ||
                !req.body.department ||
                !req.body.position ||
                !req.body.hireDate ||
                req.body.salary === undefined
            ){
                return res.status(400).send({
                    message: 'Send all required fields: employeeId, firstName, lastName, email, department, position, hireDate, salary',
                });
            }
            else{
                const {id} = req.params;
                const result = await Employee.findByIdAndUpdate(id, req.body, { new: true });
                if(!result){
                    return res.status(404).send({message: 'Employee not found'});
                }
                return res.status(200).send({message: 'Employee updated successfully', employee: result});
            }
        }
        catch(error){
            console.log(error.message);
            if (error.code === 11000) {
                const field = Object.keys(error.keyValue)[0];
                return res.status(400).send({
                    message: `${field} already exists. Please use a different ${field}.`
                });
            }
            res.status(500).send({message: error.message});
        }
    }
);

// Route to delete/deactivate an employee by id
router.delete(
    '/:id',
    async (req, res)=>{
        try{
            const {id} = req.params;
            // Instead of hard delete, we'll set status to inactive
            const result = await Employee.findByIdAndUpdate(
                id, 
                { status: 'inactive' }, 
                { new: true }
            );
            if(!result){
                return res.status(404).send({message: 'Employee not found'});
            }
            return res.status(200).send({
                message: 'Employee deactivated successfully',
                employee: result
            });
        }
        catch(error){
            console.log(error.message);
            res.status(500).send({message: error.message});
        }
    }
);
export default router;
