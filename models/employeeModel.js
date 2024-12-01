const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
    emp_id: {
        type: String,
        required: false,
        unique: true
    },
    mobile: {
        type: String,
        required: false,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        default: 'default@gmail.com',
        required: false,
    },
    designation: {
        type: String,
        required: false
    },
    department: {
        type: String,
    },
    company: {
        type: String,
    },
    joining: {
        type: Date,
    },
    status: {
        type: Number,
        default: 1 // 1 means active, 0 means inactive
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Employees', employeeSchema)