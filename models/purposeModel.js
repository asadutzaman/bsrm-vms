const mongoose = require('mongoose')

const purposeSchema = new mongoose.Schema({
    purposename: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 1 // 1 means active, 0 means inactive
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('purposes', purposeSchema)