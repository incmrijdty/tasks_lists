const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/TasksManager');


router.get('/', tasksController.getTasksView);
router.post("/add", tasksController.createNewTask);
//router.get("/:id", tasksController.getTaskView);
router.delete("/:id", tasksController.deleteTask);

module.exports = router;
