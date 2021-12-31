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

router.get('/posts/:p?', checkLogin, (req, res) => {
    let p = req.params.p
    if (p >= 1) {
        p = p * 10
    }
    Posts.find().sort({ createAt: -1 }).skip(p).limit(10).then(data => {
        var posts = [];
        for (let i = 0; i < data.length; i++) {
            posts.push(data[i])
        }
        res.json({ posts: posts, status: 'success' })
    }).catch(err => {
        console.log(err)
        res.json({ status: err })
    })
})

router.post('/comments', checkLogin, (req, res) => {

    Comments.find({ postId: req.body.postId }).sort({ createAt: -1 }).then(data => {
        var comments = [];
        for (let i = 0; i < data.length; i++) {
            comments.push(data[i])
        }
        res.json({ comments: comments, status: 'success' })
    }).catch(err => {
        console.log(err)
        res.json({ status: err })
    })
})


router.get('/', checkLogin, (req, res) => {
    Notifications.find().sort({ createAt: -1 }).then(data => {
        var notification = [];
        for (let i = 0; i < data.length; i++) {
            notification.push(data[i])
        }
        Categories.find().then(data => {
            var category = [];
            for (let i = 0; i < data.length; i++) {
                category.push(data[i])
            }
            res.render('index', { user: req.data, notification: notification, category: category })
        }).catch(err => {
            console.log(err)
            res.render('index')
        })
    }).catch(err => {
        console.log(err)
        res.render('index')
    })
})

//đăng nhập bằng google
const passport = require('passport')
require('../passport')
router.use(passport.initialize());
router.use(passport.session());

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login', failureMessage: true }),
    function (req, res) {
        var token = jwt.sign({ _id: req.user._id }, secret, { expiresIn: '30m' })
        res.cookie('token', token)
        res.redirect('/')
    }
)

//đăng xuất
router.get('/logout', (req, res) => {
    console.log("logout")
    res.json({ logout: true })
})

//đăng bài
const fileUpload = require('express-fileupload');
router.use(fileUpload());
router.post('/addPost', checkLogin, (req, res) => {
    let caption = req.body.caption;
    let video = checkYoutubeUrl(req.body.video);
    if (req.files) {
        var file = req.files.image;
        var random = Math.floor(Math.random() * 99999999999999);
        var path = '/images/post/' + random + file.name
        file.mv('./public' + path, (err) => {
            let image = ''
            if (err) {
                console.log(err)
            } else {
                console.log('post with image')
            }
        })
    }
    let post = new Posts({
        caption: caption,
        image: path,
        video: video,
        user: req.data._id,
        fullname: req.data.fullname,
        createAt: Date.now()
    })
    post.save((error, postResult) => {
        if (error) {
            console.log(error)
            return res.json({ msg: error, success: false })
        }
        console.log('add post success')
        return res.json({ success: true, postResult: postResult, msg: 'Đăng bài viết thành công' })
    });
})

//check youtube url
function checkYoutubeUrl(url) {
    if (url.includes("https://www.youtube.com/embed/")) {
        var html = '<iframe width="560" height="315" src="' + url + '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
        return html;
    } else {
        if (url.includes("&list=")) {
            var idVideos = url.split("v=");
            var idVideoList = idVideos[idVideos.length - 1];
            idVideos = idVideoList.split("&list=")
            var idVideo = idVideos[0];

            url = "https://www.youtube.com/embed/" + idVideo;
            var html = '<iframe width="560" height="315" src="' + url + '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
            return html;
        } else {
            if (url.includes("https://www.youtube.com/watch?v=")) {
                var idVideos = url.split("v=");
                var idVideo = idVideos[idVideos.length - 1]

                url = "https://www.youtube.com/embed/" + idVideo;
                var html = '<iframe width="560" height="315" src="' + url + '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
                return html;
            }
            else {
                return '';
            }
        }
    }
}

//sửa bài
var ObjectId = require('mongodb').ObjectId;
router.put('/updateCaption', checkLogin, (req, res) => {
    Posts.updateOne({ _id: new ObjectId(req.body._id), user: req.data._id.toString() }, { $set: { caption: req.body.caption } }, (err, obj) => {
        if (err) {
            console.log(err)
            return res.json({ success: false, msg: "Chỉnh sửa bài viết thất bại" })
        }
        if (obj.modifiedCount === 1) {
            return res.json({ success: true })
        } else {
            return res.json({ success: false, msg: "Bạn không có quyền chỉnh sửa bài viết này" })
        }
    })
})

//Xoá bài
router.delete('/deletePost', checkLogin, (req, res) => {
    Posts.deleteOne({ _id: new ObjectId(req.body._id), user: req.data._id.toString() }, function (err, obj) {
        if (err) {
            console.log(err)
            return res.json({ success: false, msg: "Xoá bài viết thất bại" })
        }
        console.log(obj)
        if (obj.deletedCount === 1) {
            return res.json({ success: true })
        } else {
            return res.json({ success: false, msg: "Bạn không có quyền xoá bài viết này" })
        }
    });
})

//Đăng thông báo
router.post('/addNotification', checkLogin, (req, res) => {
    let title = req.body.title
    let summary = req.body.summary
    let detail = req.body.detail
    let category = req.body.permission

    let notification = new Notifications({
        title: title,
        summary: summary,
        detail: detail,
        category: category,
        user: req.data._id,
        fullname: req.data.fullname,
        createAt: Date.now()
    })
    notification.save((error, notiResult) => {
        if (error) {
            console.log(error)
            return res.json({ msg: error, success: false })
        }
        console.log('add notification success')
        return res.json({ success: true, notiResult: notiResult, msg: 'Đăng thông báo thành công' })
    });
})

//Đăng comment
router.post('/addComment', checkLogin, (req, res) => {
    let comment = req.body.comment
    let postId = req.body.postId

    console.log(req.body)

    let newComment = new Comments({
        comment: comment,
        postId: postId,
        user: req.data._id,
        fullname: req.data.fullname,
        createAt: Date.now()
    })
    newComment.save((error, notiResult) => {
        if (error) {
            console.log(error)
            return res.json({ msg: error, success: false })
        }
        console.log('add comment success')
        return res.json({ success: true, newComment: newComment, msg: 'Đăng bình luận thành công' })
    });
})

//Sửa comment
router.put('/updateComment', checkLogin, (req, res) => {
    console.log(req.body)
    Comments.updateOne({ _id: new ObjectId(req.body._id), user: req.data._id.toString() }, { $set: { comment: req.body.comment } }, (err, obj) => {
        if (err) {
            console.log(err)
            return res.json({ success: false, msg: "Chỉnh sửa bình luận thất bại" })
        }
        if (obj.modifiedCount === 1) {
            return res.json({ success: true })
        } else {
            return res.json({ success: false, msg: "Bạn không có quyền chỉnh sửa bình luận này" })
        }
    })
})

//Xoá comment
router.delete('/deleteComment', checkLogin, (req, res) => {
    Comments.deleteOne({ _id: new ObjectId(req.body._id), user: req.data._id.toString() }, function (err, obj) {
        if (err) {
            console.log(err)
            return res.json({ success: false, msg: "Xoá bình luận thất bại" })
        }
        console.log(obj)
        if (obj.deletedCount === 1) {
            return res.json({ success: true })
        } else {
            return res.json({ success: false, msg: "Bạn không có quyền xoá bình luận này" })
        }
    });
})
module.exports = router;