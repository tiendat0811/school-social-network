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

router.get('/', checkLogin, (req, res) => {
    Posts.find({ user: req.data._id.toString() }).then(data => {
        res.render('student', { user: req.data, findUser: { id: null }, posts: data })
    })
})

router.get('/:id?', checkLogin, (req, res) => {
    let findUser = (req.params.id === req.data._id.toString())
    Posts.find({ user: req.params.id }).then(data => {
        res.render('student', { user: req.data, findUser: findUser, posts: data })
    })
})

//update image
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)
// Delete the old file

router.post('/updateAvatar', checkLogin, function (req, res) {
    if (req.files) {
        var file = req.files.userPhoto;
        var random = Math.floor(Math.random() * 9999999999999999);
        var path = '/images/avatar/' + random + file.name
        file.mv('./public' + path, (err) => {
            if (err) {
                console.log(err)
            } else {
                console.log('post with image')
                Users.updateOne({ _id: req.data._id }, { $set: { avatar: path } }, (err, status) => {
                    if (err) {
                        console.log(err)
                        return res.render('student', { user: req.data, success: false })
                    }
                    let oldImg = "./public/" + req.data.avatar
                    unlinkAsync(oldImg)
                    console.log("Change avatar success");
                    return res.render('student', { user: { avatar: path }, success: true })
                })
            }
        })
    }
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