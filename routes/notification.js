const express = require('express')
const router = express.Router()

const Users = require('../models/user')
const Posts = require('../models/post')
const Notifications = require('../models/notification')
const Comments = require('../models/comment')
const Categories = require('../models/category')

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

router.get('/', checkLogin, (req, res) => {
    Categories.find().then(data => {
        var category = [];
        for (let i = 0; i < data.length; i++) {
            category.push(data[i])
        }
        res.render('notification', { user: req.data, category: category })
    }).catch(err => {
        console.log(err)
        res.render('index')
    })
})

router.get('/:category/:p', (req, res) => {
    let p = req.params.p
    if (p >= 1) {
        p = p * 10
    }
    Notifications.find({ category: req.params.category }).sort({ createAt: -1 }).skip(p).limit(10).then(data => {
        var notifications = [];
        for (let i = 0; i < data.length; i++) {
            notifications.push(data[i])
        }
        res.json({ notifications: notifications, status: 'success' })
    }).catch(err => {
        console.log(err)
        res.json({ status: err })
    })
})

router.get('/:id?', checkLogin, (req, res) => {
    Notifications.findOne({ _id: req.params.id }).then(data => {
        res.render('notification-detail', { user: req.data, notification: data })
    })
})

module.exports = router