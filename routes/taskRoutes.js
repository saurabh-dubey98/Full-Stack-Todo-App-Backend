const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { getTasks, setTask, updateTask, deleteTask, setSubtask, deleteSubtask, updateTaskStatus, getSubtasks, updateSubtaskStatus } = require('../controllers/taskController')

// for tasks
router.route('/').get(protect, getTasks).post(protect, setTask);
router.route('/:id').put(protect, updateTask).delete(protect, deleteTask);
router.route('/status/:id').put(protect, updateTaskStatus)
// for subtasks
router.route('/:id').post(protect, setSubtask).get(protect, getSubtasks)
router.route('/subtask/:subtaskId').delete(protect, deleteSubtask)
router.route('/subtaskStatus/:subtaskId').put(protect, updateSubtaskStatus)

module.exports = router;