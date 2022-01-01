const mongoose = require('mongoose')

const User = new mongoose.Schema({
    username: {
        type: String,
    },
    password: {
        type: String
    },
    roles: {
        type: String,
    },
    fullname: {
        type: String,
    },
    avatar: {
        type: String
    },
    falcuty: {
        type: String
    },
    class: {
        type: String
    },
    permission: [{
        type: String
    }]
})

module.exports = mongoose.model('User', User)