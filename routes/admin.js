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
        res.render('admin', { category: category, user: req.data, title: 'Admin' })
    }).catch(err => {
        console.log(err)
        res.redirect('/')
    })
})

router.get('/manager', checkLogin, checkAdmin, (req, res) => {
    Categories.find().then(data => {
        let category = [];
        for (let i = 0; i < data.length; i++) {
            category.push(data[i].category)
        }
        //find user with roles = admin
        Users.find({
            roles: 'manager'
        }).then(manager => {
            let account = [];
            for (let i = 0; i < manager.length; i++) {
                account.push(manager[i])
            }
            res.render('admin-manager', { account: account, category: category, user: req.data, title: 'Manager', admin: data })
        }
        ).catch(err => {
            console.log(err)
            res.redirect('/')
        })
    }).catch(err => {
        console.log(err)
        res.redirect('/')
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

var ObjectId = require('mongodb').ObjectId;
router.delete('/delete-account', checkLogin, checkAdmin, (req, res) => {
    let accountId = new ObjectId(req.body._id)
    Users.deleteOne({ _id: accountId }, function (err, obj) {
        if (err) {
            console.log(err)
            return res.json({ success: false, msg: "Xoá tài khoản thất bại!" })
        }
        return res.json({ success: true, msg: "Xoá tài khoản thành công!" })
    });
})

router.put('/updateAccount', checkLogin, checkAdmin, (req, res) => {
    const user = {
        fullname: req.body.user.fullname,
        username: req.body.user.username,
        permission: JSON.parse(req.body.user.permission),
    }
    console.log(req.body.user.password)
    bcrypt.hash(req.body.user.password, saltRounds, function (err, hash) {
        user.password = hash;
        Users.updateOne({ _id: new ObjectId(req.body.user._id) }, { $set: user }, (err, obj) => {
            if (err) {
                console.log(err)
                return res.json({ success: false, msg: "Cập nhật thất bại" })
            }
            if (obj.modifiedCount === 1) {
                return res.json({ success: true, msg: "Cập nhật thông tin thành công" })
            } else {
                return res.json({ success: false, msg: "Không có gì cập nhật mới" })
            }
        })
    })
})

module.exports = router