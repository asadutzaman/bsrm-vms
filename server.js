require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const session = require('express-session');
const cookieParser = require('cookie-parser')
const path = require('path')
const bp = require('body-parser')
const flash = require('connect-flash');

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}))
app.use(flash())
app.use(cors())
    // app.use(fileUpload({
    //     useTempFiles: true
    // }))
app.use(bp.json());
app.use(bp.urlencoded({
    extended: true
}));

// view engine
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'upload')));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// API Routes
app.use('/api', require('./routes/userRouter'))
app.use('/api', require('./routes/visitorRouter'))
app.use('/api', require('./routes/purposeRouter'))


// Backend
app.use('/', require('./routes/userRouter'))
app.use('/visitor', require('./routes/visitorRouter'))
app.use('/employee', require('./routes/employeeRouter'))
app.use('/report', require('./routes/reportRouter'))
app.use('/purpose', require('./routes/purposeRouter'))
app.use('/schedule', require('./routes/preScheduleVisitorRouter'))

console.log('Routing Done...');

// Connect to mongodb
const URI = process.env.MONGODB_URL
mongoose.connect(URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if (err) throw err;
    console.log('Connected to MongoDB');
})

// const PORT = process.env.PORT || 3000
// app.listen(PORT, () => {
//     console.log('Server is running on port', PORT);
// });
// console.log('This process is your pid ' + process.pid);

const PORT = process.env.PORT || 3004
app.listen(PORT, () => {
    console.log('Server is running on port', PORT)
})
