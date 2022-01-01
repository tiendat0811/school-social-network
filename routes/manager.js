const express = require('express')
const router = express.Router()

var cookieParser = require('cookie-parser')
router.use(cookieParser());

const Users = require('../models/user')
const Notifications = require('../models/notification')

var ObjectId = require('mongodb').ObjectId;
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

function checkManager(req, res, next) {
    var role = req.data.roles;
    if (role === "manager" || role === 'admin') {
        next()
    } else {
        res.redirect('/')
    }
}

router.get('/', checkLogin, checkManager, (req, res) => {
    Notifications.find({ user: req.data._id.toString() }).then(data => {
        res.render('manager', { user: req.data, notifications: data })
    })
})


const bcrypt = require('bcrypt');
const saltRounds = 10;
router.put('/changePassword', checkLogin, checkManager, (req, res) => {
    let password = req.body.password;

    bcrypt.hash(password, saltRounds, function (err, hash) {
        Users.updateOne({ _id: req.data._id }, { $set: { password: hash } }, (err, status) => {
            if (err) {
                console.log(err)
                return res.json({ success: false })
            }
            return res.json({ success: true })
        })
    })

})

router.put('/editNotification', checkLogin, checkManager, (req, res) => {
    let title = req.body.title
    let summary = req.body.summary
    let detail = req.body.detail
    Notifications.updateOne({ _id: new ObjectId(req.body.id) }, { $set: { title: title, summary: summary, detail: detail } }, (err, status) => {
        if (err) {
            console.log(err)
            return res.json({ success: false, msg: 'Chỉnh sửa thông báo thất bại' })
        }
        return res.json({ success: true, msg: 'Chỉnh sửa thông báo thành công' })
    })
})

router.delete('/deleteNotification', checkLogin, checkManager, (req, res) => {
    Notifications.deleteOne({ _id: new ObjectId(req.body._id), user: req.data._id.toString() }, function (err, obj) {
        if (err) {
            console.log(err)
            return res.json({ success: false, msg: "Xoá thông báo thất bại" })
        }
        if (obj.deletedCount === 1) {
            return res.json({ success: true })
        } else {
            return res.json({ success: false, msg: "Bạn không có quyền xoá bài viết này" })
        }
    });
})

module.exports = router