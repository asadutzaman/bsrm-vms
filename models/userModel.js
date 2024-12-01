const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 0 // 0 means superadmin , 1 means admin
    },
    cart: {
        type: Array,
        default: []
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Users', userSchema)