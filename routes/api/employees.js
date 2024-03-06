const express = require('express');
const router = express.Router();
const path = require('path');
const employeesController = require('../../controllers/employeesController');
const verifyRoles = require('../../middleware/verifyRoles');
const rolesList = require('../../config/rolesList');

router
  .route("/")
  .get(employeesController.getAllEmployees)
  .post(verifyRoles(rolesList.Admin, rolesList.Editor), employeesController.createNewEmployee)
  .put(verifyRoles(rolesList.Admin, rolesList.Editor),employeesController.updateEmployee)
  .delete(verifyRoles(rolesList.Admin),employeesController.deleteEmployee);

router.route('/:id')
    .get(employeesController.getEmployee);

module.exports = router;