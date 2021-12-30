//khai báo căn bản
const express = require('express')
const path = require('path');
const mongoose = require('mongoose')
const session = require('express-session')
const bodyParser = require('body-parser')
//socket
const app = express();

//khai báo models
const users = require('./models/user')
const posts = require('./models/post')
const comments = require('./models/comment')
const notifications = require('./models/notification')

//set view và session
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(path.resolve('./public')));
app.use(session({
    secret: "test",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

//khai báo mongo
mongoose.connect('mongodb://localhost:27017/FinalWeb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(console.log('connect to database success'))

//routes
app.use('/', require('./routes/index'))
app.use('/login', require('./routes/login'))
app.use('/admin', require('./routes/admin'))
app.use('/manager', require('./routes/manager'))
app.use('/student', require('./routes/student'))

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

io.on('connection', (socket) => {

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('notification', (msg) => {
        io.emit('notification', msg);
    });
});

//run server
server.listen(process.env.PORT, () => console.log(`Server is running on port http://localhost:${process.env.PORT}`))