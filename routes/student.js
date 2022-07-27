const express = require('express')
const router = express.Router()
const Users = require('../models/user')
const Posts = require('../models/post')
var cookieParser = require('cookie-parser')
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

function checkStudent(req, res, next) {
    var role = req.data.roles;
    if (role === "student" || role === "admin") {
        next()
    } else {
        res.redirect('/')
    }
}

router.get('/', checkLogin, checkStudent, (req, res) => {
    Posts.find({ user: req.data._id.toString() }).then(data => {
        res.render('student', { title: req.data.fullname, user: req.data, findUser: { id: null }, posts: data })
    })
})

router.get('/:id?', checkLogin, (req, res) => {
    let findUser = (req.params.id === req.data._id.toString())
    Posts.find({ user: req.params.id }).then(data => {
        res.render('student', { title: req.data.fullname, user: req.data, findUser: findUser, posts: data })
    })
})

//update image
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)
// Delete the old file

router.post('/updateAvatar', checkLogin, function (req, res) {
    Users.updateOne({ _id: req.data._id }, { $set: { avatar: req.body.avatar } }, (err, status) => {
        if (err) {
            console.log(err)
            return res.json({ user: req.data, success: false, msg: 'Cập nhật ảnh dại diện thất bại' })
        }
        console.log("Change avatar success");
        return res.json({ user: { avatar: req.body.avatar }, success: true, msg: 'Cập nhật ảnh đại diện thành công' })
    })
});

router.put('/updateStudent', checkLogin, checkStudent, (req, res) => {
    let fullname = req.body.fullname;
    let sClass = req.body.class;
    let falcuty = req.body.falcuty;
    Users.updateOne({ _id: req.data._id }, { $set: { fullname: fullname, class: sClass, falcuty: falcuty } }, (err, status) => {
        if (err) {
            console.log(err)
            return res.json({ success: false })
        }
        console.log("Update student success");
        return res.json({ success: true })
    })
})
module.exports = router