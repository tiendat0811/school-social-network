const express = require('express')
const router = express.Router()
const Users = require('../models/user')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

Users.findOne({ username: 'admin' }).then(data => {
    bcrypt.hash('admin', saltRounds, function (err, hash) {
        Users.create({
            username: 'admin',
            password: hash,
            roles: "admin",
            fullname: "Pham Tien Dat"
        })
    });
})


router.get('/', (req, res) => {
    res.render('login')
})

router.post('/', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    console.log('login')
    Users.findOne({ username: username }, (err, user) => {
        if (err) {
            return console.log(err)
        }
        if (!user) {
            return res.redirect('/login')
        }
        bcrypt.compare(password, user.password).then(function (result) {
            if (result) {
                console.log('login success')
                var token = jwt.sign({ _id: user._id }, 'tiendat', { expiresIn: '30m' })
                return res.json({ status: true, token: token })
            }
            console.log('Sai email hoac mat khau')
            return res.redirect('/login')
        });
    })
})
module.exports = router;