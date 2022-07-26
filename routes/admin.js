const express = require('express')
const router = express.Router()
var cookieParser = require('cookie-parser')
const Users = require('../models/user')
const Categories = require('../models/category')
router.use(cookieParser());

const jwt = require('jsonwebtoken');
var secret = 'tiendat'

function checkLogin(req, res, next) {
    try {
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, secret)
        Users.findOne({
            _id: decodeToken
        }).then(data => {
            if (data) {
                req.data = data
                next()
            }
        }).catch(err => {
            console.log(err)
        })
    } catch (error) {
        return res.redirect('/login')
    }
}

function checkAdmin(req, res, next) {
    var role = req.data.roles;
    if (role === "admin") {
        next()
    } else {
        res.redirect('/')
    }
}
router.get('/', checkLogin, checkAdmin, (req, res) => {
    Categories.find().then(data => {
        let category = [];
        for (let i = 0; i < data.length; i++) {
            category.push(data[i].category)
        }
        res.render('admin', { category: category, user: req.data })
    }).catch(err => {
        console.log(err)
        res.render('admin')
    })
})

const bcrypt = require('bcrypt');
const saltRounds = 10;
router.post('/register', checkLogin, checkAdmin, (req, res) => {
    let username = req.body.username;
    let permission = JSON.parse(req.body.permission);
    Users.findOne({ username: username }, (err, user) => {
        if (user) {
            return res.json({ success: false, msg: 'Tài khoản đã tồn tại' })
        } else {
            bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
                let us = new Users({
                    fullname: req.body.fullname,
                    username: req.body.username,
                    password: hash,
                    permission: permission,
                    roles: "manager",
                    avatar: "https://vcdn-sohoa.vnecdn.net/2022/06/21/Elon-Musk-Twitter-5892-1655824638.jpg"
                })
                us.save((error, user) => {
                    if (error) {
                        return res.json({ success: false, msg: error })
                    }
                    return res.json({ success: true, msg: "Tạo tài khoản thành công" })
                });
            });
        }
    })
})

module.exports = router