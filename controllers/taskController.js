const asyncHandler = require('express-async-handler')
const Task = require('../models/taskModel');
const SubTask = require('../models/subtaskModel');
const User = require('../models/userModel');
const emailSender = require('../scheduledEmails/emailSender')

const getTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find({
        user: req.user.id
    });
    res.status(200).json(tasks)
})

// Get sub tasks 
const getSubtasks = asyncHandler(async (req, res) => {
    const tasks = await SubTask.find({
        taskId: req.params.id
    });
    res.status(200).json(tasks)
})

const setTask = asyncHandler(async (req, res) => {
    if (!req.body.title) {
        res.status(400)
        throw new Error('Please add title of the task')
    }
    const task = await Task.create({
        user: req.user.id,
        title: req.body.title,
        desc: req.body.desc,
        dueDate: req.body.dueDate,
        taskState: req.body.taskState,
        remindBefore: req.body.remindBefore

    })
    const user = await User.findById(req.user.id)
    if (task) {
        emailSender({
            title: task.title,
            email: user.email,
            dueDate: task.dueDate,
            remindBefore: task.remindBefore
        })
        res.status(200).json(task)
    } else {
        res.status(400)
        throw new Error("Some error occured")
    }

})

const updateTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id)

    if (!task) {
        res.status(400)
        throw new Error('Task not found.')
    }

    const user = await User.findById(req.user.id);

    // Check for user
    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Make sure the logged in user matches the goal user
    if (task.user.toString() !== user.id) {
        res.status(401)
        throw new Error("User not authorized")
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
    emailSender({
        title: updatedTask.title,
        email: user.email,
        dueDate: updatedTask.dueDate,
        remindBefore: updatedTask.remindBefore
    })
    res.status(200).json(updatedTask)
})

const updateTaskStatus = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id)
    const subtask = await SubTask.find({ taskId: task._id })
    if (!task) {
        res.status(400)
        throw new Error('Task not found.')
    }

    const user = await User.findById(req.user.id);

    // Check for user
    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Make sure the logged in user matches the goal user
    if (task.user.toString() !== user.id) {
        res.status(401)
        throw new Error("User not authorized")
    }

    if (subtask) {
        await SubTask.updateMany({ taskId: task._id }, { subtaskState: true })
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, { taskState: req.body.taskState }, { new: true })
    res.status(200).json(updatedTask)
})

const deleteTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id)
    if (!task) {
        res.status(400)
        throw new Error('Task not found.')
    }

    const user = await User.findById(req.user.id);

    // Check for user
    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Make sure the logged in user matches the goal user
    if (task.user.toString() !== user.id) {
        res.status(401)
        throw new Error("User not authorized")
    }
    await task.remove()
    await SubTask.deleteMany({ taskId: req.params.id })
    res.status(200).json({ id: req.params.id })
})

const setSubtask = asyncHandler(async (req, res) => {
    if (!req.body.title) {
        res.status(400)
        throw new Error('Please add title of the subtask')
    }
    const subtask = await SubTask.create({
        taskId: req.params.id,
        title: req.body.title,
        subtaskState: req.body.subtaskState,
    })
    res.status(200).json(subtask)
})

const deleteSubtask = asyncHandler(async (req, res) => {
    const subtask = await SubTask.findById(req.params.subtaskId)
    if (!subtask) {
        res.status(400)
        throw new Error('Sub Task not found.')
    }

    const user = await User.findById(req.user.id);

    // Check for user
    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    await subtask.remove()
    res.status(200).json({ id: req.params.id })
})

const updateSubtaskStatus = asyncHandler(async (req, res) => {
    const subtask = await SubTask.findById(req.params.subtaskId)
    const user = await User.findById(req.user.id);
    // Check for user
    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    if (subtask) {
        await SubTask.findByIdAndUpdate(req.params.subtaskId, { subtaskState: req.body.subtaskState })
    }
    res.status(200)
})

module.exports = {
    getTasks,
    setTask,
    updateTask,
    deleteTask,
    setSubtask,
    deleteSubtask,
    updateTaskStatus,
    getSubtasks,
    updateSubtaskStatus
}