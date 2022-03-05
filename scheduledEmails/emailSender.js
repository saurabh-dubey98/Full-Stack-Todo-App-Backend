const nodemailer = require('nodemailer')
const schedule = require('node-schedule')

// Email transport configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODE_SCHEDULER_EMAIL,
        pass: process.env.NODE_SCHEDULER_PASS
    }
})

const emailSender = async ({ title, email, dueDate, remindBefore }) => {
    const date = new Date(dueDate)
    date.setHours(date.getHours() - parseInt(remindBefore))
    schedule.scheduleJob(date, () => {
        const emailOptions = {
            from: process.env.NODE_SCHEDULER_EMAIL,
            to: email,
            subject: 'Reminder from TodoReminder app',
            text: `Task: ${title} Due Date: ${dueDate}`
        }
        transporter.sendMail(emailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email reminder successfully send' + info.response);
            }
        })
    })
}

module.exports = emailSender