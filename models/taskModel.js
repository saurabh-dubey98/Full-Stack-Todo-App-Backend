const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: [true, 'Task title is required']
    },
    desc: {
        type: String,
    },
    taskState: {
        type: Boolean,
        required: [true, 'Task state is required']
    },
    dueDate: {
        type: Date,
        required: true
    },
    remindBefore: {
        type: String,
        required: [true, 'Reminde before time is required']
    }
})

module.exports = mongoose.model('task', taskSchema)