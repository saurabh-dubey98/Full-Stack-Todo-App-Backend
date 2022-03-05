const mongoose = require('mongoose')

const subtaskSchema = mongoose.Schema({
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'task'
    },
    title: {
        type: String,
        required: [true, 'Sub Task title is required']
    },
    subtaskState: {
        type: Boolean,
        required: [true, 'Sub Task state is required']
    }
})

module.exports = mongoose.model('subtask', subtaskSchema)