const mongoose = require('mongoose')

const visitorInfoSchema = new mongoose.Schema({
    fullname: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    from: { type: String, required: true },
    cardno: { type: String, required: false, default: null },
    image: { type: String, required: true },
    created_by: { type: {}, default: {} },
    purpose: { type: {}, default: {} },
    time_in: { type: Date, default: new Date() },
    time_out: { type: Date, default: new Date() },
    duration: { type: String, default: 0},
    emp_info: { type: {}, default: {} },
    status: { type: String, default: 1 }, // CheckedIn
}, {
    timestamps: true
})

module.exports = mongoose.model('VisitorInfo', visitorInfoSchema)