const mongoose = require('mongoose')
const Post = new mongoose.Schema({
    caption: {
        type: String
    },
    image: {
        type: String
    },
    video: {
        type: String
    },
    createTime: {
        type: String,
        default: new Date().toLocaleString()
    },
    createAt: {
        type: String,
        default: Date.now()
    },
    user: {
        type: String
    },
    fullname: {
        type: String
    },
    avatar: {
        type: String
    }
})


module.exports = mongoose.model('Post', Post)