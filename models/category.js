const mongoose = require('mongoose')
const Category = new mongoose.Schema({
    category: {
        type: String,
    }
})

// const createCategory = [
//     { category: "Phòng Công tác học sinh sinh viên (CTHSSV)" },
//     { category: "Phòng Đại học" },
//     { category: "Phòng Sau đại học" },
//     { category: "Phòng điện toán và máy tính" },
//     { category: "Phòng khảo thí và kiểm định chất lượng" },
//     { category: "Phòng tài chính" },
//     { category: "TDT Creative Language Center" },
//     { category: "Trung tâm tin học" },
//     { category: "Trung tâm đào tạo phát triển xã hội (SDTC)" },
//     { category: "Trung tâm phát triển Khoa học quản lý và Ứng dụng công nghệ (ATEM)" },
//     { category: "Trung tâm hợp tác doanh nghiệp và cựu sinh viên" },
//     { category: "Khoa Luật" },
//     { category: "Trung tâm ngoại ngữ tin học và bồi dưỡng văn hóa" },
//     { category: "Viện chính sách kinh tế và kinh doanh" },
//     { category: "Khoa Mỹ thuật công nghiệp" },
//     { category: "Khoa Điện - Điện tử" },
//     { category: "Khoa Công nghệ thông tin" },
//     { category: "Khoa Quản trị kinh doanh" },
//     { category: "Khoa Môi trường và bảo hộ lao động" },
//     { category: "Khoa Lao động công đoàn" },
//     { category: "Khoa Tài chính ngân hàng" },
//     { category: "Khoa giáo dục quốc tế" }]

// mongoose.model('Category', Category).create(
//     createCategory
// )
module.exports = mongoose.model('Category', Category)