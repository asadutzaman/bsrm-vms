const mongoose = require('mongoose')

const preScheduleVisitorSchema = new mongoose.Schema({
    fullname: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    from: { type: String, required: false },
    cardno: { type: String, required: false, default: null },
    image: { type: String, required: false, default: null },
    created_by: { type: {}, default: {} },
    purpose: { type: {}, default: {} },
    time_in: { type: Date, default: new Date() },
    time_out: { type: Date, default: new Date() },
    duration: { type: String, default: 0},
    emp_info: { type: {}, default: {} },
    status: { type: String, default: 1 },
    pre_schedule_date: { type: Date, default: new Date() },
    is_pre_schedule: { type: Boolean, default: true },
}, {
    timestamps: true
})

module.exports = mongoose.model('PreScheduleVisitors', preScheduleVisitorSchema)