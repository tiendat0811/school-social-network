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

var UserModel = mongoose.model('User', User)
const bcrypt = require('bcrypt');
const saltRounds = 10;
const username = "admin"
const password = "admin"
UserModel.findOne({ username: 'admin' }).then(data => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
        UserModel.create({
            username: username,
            password: hash,
            roles: "admin",
            fullname: "Pham Tien Dat"
        })
    });
})

module.exports = mongoose.model('User', UserModel)