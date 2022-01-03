const mongoose = require('mongoose')
const category = require('./category')
const Notification = new mongoose.Schema({
    title: {
        type: String,
    },
    summary: {
        type: String,
    },
    detail: {
        type: String,
    },
    category: {
        type: String,
    },
    createTime: {
        type: String,
    },
    createAt: {
        type: String,
        default: Date.now()
    },
    user: {
        type: String,
    },
    fullname: {
        type: String
    }
})
// for (let i = 0; i < 50; i++) {
//     mongoose.model('Notification', Notification).create({ title: "Tiêu đề " + i, summary: "Tóm tắt " + i, detail: "Chi tiết " + i, createAt: Date.now(), category: "Phòng điện toán và máy tính" })
// }


module.exports = mongoose.model('Notification', Notification)