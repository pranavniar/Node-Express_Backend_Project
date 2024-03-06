const Employee = require('../model/Employee');

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find();
  if(!employees){
    res.status(204).json({"message": `Employees not found`});
  }
  res.json(employees);
};


const createNewEmployee = async (req, res) => {
  if(!req?.body?.firstname || !req?.body?.lastname){
    return res.status(400).json({"message": `First and last names are required`});
  }
  try{
    const result = await Employee.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
    res.status(201).json(result);
  }catch(err){
    console.log(err);
    res.sendStatus(500);
  }
};

const updateEmployee = async (req, res) => {
  if(!req?.body?.id){
    return res.status(400).json({"message": `ID parameter is required`});
  }
  const employee = await Employee.findOne({_id: req.body.id});
  if(!employee){
    res.status(204).json({"message": `No employee matches the ID: ${req.params.id}`});
  }
  if(req.body?.firstname){
    employee.firstname = req.body.firstname;
  }
  if(req.body?.lastname){
    employee.lastname = req.body.lastname;
  }
  const result = await employee.save();
  res.json(result);
};

const deleteEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: `ID parameter is required` });
  }
  const employee = await Employee.findOne({_id: req.body.id});
  if(!employee){
    res
      .status(204)
      .json({ message: `No employee matches the ID: ${req.params.id}` });
  }
  const result = await Employee.deleteOne({_id: req.body.id});
  res.json(result);
};

const getEmployee = async (req, res) => {
  if(!req?.params?.id){
    return res.status(400).json({"message": `ID parameter is required`});
  }
  const employee = await Employee.findOne({_id: req.params.id}).exec();
  if(!employee){
    res.status(400).json({"message": `Employee with id ${req.params.id} not found`});
  }
  res.json(employee);
};

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee,
}