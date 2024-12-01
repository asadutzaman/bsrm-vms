const Users = require('../models/userModel')
    //const bcrypt = require('bcrypt')
const bcrypt = require('bcrypt-nodejs')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator');
const VisitorInfo = require('../models/visitorInfoModel');
const Employees = require('../models/employeeModel');

const userCtrl = {
    register: async(req, res) => {
        try {
            const { name, email, password } = req.body;

            if (name == '' || email == '' || password == '') {
                req.flash('msg', 'Fillup all the fields!');
                return res.redirect('/user/create');
            }

            const user = await Users.findOne({ email })
            if (user) {
                req.flash('msg', 'User already exists!');
                return res.redirect('/user/create');
            }

            if (password.length < 6) {
                req.flash('msg', 'Password is at least 6 characters long.!');
                return res.redirect('/user/create');
            }

            // Password Encryption
            const passwordHash = bcrypt.hashSync(password);

            const newUser = new Users({
                name,
                email,
                password: passwordHash
            })

            // Save mongodb
            await newUser.save()
            req.flash('msg', 'User added successfully!');
            return res.redirect('/user');

            // Then create jsonwebtoken to authentication
            // const accesstoken = createAccessToken({ id: newUser._id })
            // const refreshtoken = createRefreshToken({ id: newUser._id })

            // res.cookie('refreshtoken', refreshtoken, {
            //     httpOnly: true,
            //     path: '/api/refresh_token',
            //     maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
            // })

            // res.json({ accesstoken })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    accessToken: async(req, res) => {
        try {
            const { email, password } = req.body;

            const user = await Users.findOne({ email })
            if (!user) return res.status(400).json({ status: false, msg: "User does not exist." })

            const isMatch = bcrypt.compareSync(password, user.password);

            if (!isMatch) return res.status(400).json({ status: false, msg: "Incorrect password." })

            // If login success , create access token and refresh token
            const accesstoken = createAccessToken({ id: user._id })
            const refreshtoken = createRefreshToken({ id: user._id })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/api/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
            })

            res.json({ accesstoken, status: true })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    logout: async(req, res) => {
        try {
            res.clearCookie('refreshtoken', { path: '/api/refresh_token' })
            return res.json({ msg: "Logged out", status: true })
        } catch (err) {
            return res.status(500).json({ msg: err.message, status: false })
        }
    },
    refreshToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token) return res.status(400).json({ msg: "Please Login or Register", status: false })

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({ msg: "Please Login or Register", status: false })

                const accesstoken = createAccessToken({ id: user.id })

                res.json({ accesstoken, status: true })
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message, status: false })
        }

    },
    getUser: async(req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('-password')
            if (!user) return res.status(400).json({ msg: "User does not exist.", status: false })

            res.json({ user, status: true })
        } catch (err) {
            return res.status(500).json({ msg: err.message, status: false })
        }
    },
    getEmployee: async(req, res) => {
        try {
            const employeeDetails = await Employees.find({ status: 1 });
            res.json({ employeeDetails, status: true });
        } catch (err) {
            return res.status(500).json({ msg: err.message, status: false })
        }
    },
    backLogin: async(req, res) => { // backend login
        try {
            if (req.method == 'GET') return res.render('login', { message: req.flash('msg') });

            const { email, password } = req.body;

            const user = await Users.findOne({ email });
            if (!user) {
                req.flash('msg', 'User does not exist!');
                return res.redirect('..');
            }

            const isMatch = bcrypt.compareSync(password, user.password);
            if (!isMatch) {
                req.flash('msg', 'Incorrect Password!');
                return res.redirect('..');
            }

            const refreshtoken = createRefreshToken({ id: user._id });
            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
            });
            return res.redirect('/dashboard');
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    backLogout: async(req, res) => { // backend logout
        try {
            res.clearCookie('refreshtoken')
            return res.redirect('/');
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    dashboard: async(req, res) => {
        const visitorCount = await VisitorInfo.countDocuments({});

        var today = new Date();
        var todayVisitor = [];
        var todayVisitorCount = 0;

        var weekVisitor = [];
        var weekVisitorCount = 0;

        var monthVisitor = [];
        var monthVisitorCount = 0;

        var currentVisitor = [];
        var currentVisitorCount = 0;

        // current visitor
        var rows = await VisitorInfo.find({});
        rows.forEach((row, i) => {
            if (row.createdAt.getDate() === today.getDate() && row.createdAt.getDay() === today.getDay() && row.status == 1) {
                currentVisitor.push(row);
                currentVisitorCount += 1;
            }
        })

        // todays visitor
        var rows = await VisitorInfo.find({});
        rows.forEach((row, i) => {
            if (row.createdAt.getDate() === today.getDate() && row.createdAt.getDay() === today.getDay()) {
                todayVisitor.push(row);
                todayVisitorCount += 1;
            }
        })

        // this weeks visitor
        Date.prototype.getWeek = function() {
            var onejan = new Date(this.getFullYear(), 0, 1);
            return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
        }
        var week = today.getWeek();
        rows = await VisitorInfo.find({});
        rows.forEach((row, i) => {
                if (row.createdAt.getFullYear() === today.getFullYear() && week - 2 === row.createdAt.getWeek() - 2) {
                    weekVisitor.push(row);
                    weekVisitorCount += 1;
                }
            })
            // this months visitor
        rows = await VisitorInfo.find({});
        rows.forEach((row, i) => {
            if (row.createdAt.getFullYear() === today.getFullYear() && row.createdAt.getMonth() + 1 === today.getMonth() + 1) {
                monthVisitor.push(row);
                monthVisitorCount += 1;
            }
        })
        var total = parseInt(todayVisitorCount) + parseInt(weekVisitorCount) + parseInt(monthVisitorCount);
        var todayProgress = (100 * todayVisitorCount) / total;
        var weekProgress = (100 * weekVisitorCount) / total;
        var monthProgress = (100 * monthVisitorCount) / total;
        return res.render('dashboard', { todayVisitorCount, weekVisitorCount, monthVisitorCount, weekVisitor, todayVisitor, monthVisitor, todayProgress, weekProgress, monthProgress, currentVisitor });


        // res.json(currentVisitor);
    },
    index: (req, res) => {
        res.render('user/index', { title: 'User List', message: req.flash('msg') });
    },
    create: (req, res) => {
        res.render('user/create', { title: 'Create User', message: req.flash('msg') });
    },
    userAjaxDatatable: async(req, res) => {
        var searchStr = req.query.search['value'];
        var recordsTotal = await Users.countDocuments({});
        var recordsFiltered;

        if (searchStr) {
            var regex = new RegExp(searchStr, "i");
            searchStr = { $or: [{ 'name': regex }, { 'email': regex }] };
            var users = await Users.find(searchStr, '_id name email role');
            recordsFiltered = await Users.countDocuments(searchStr);
        } else {
            searchStr = {};
            var users = await Users.find({}).limit(Number(req.query.length)).skip(Number(req.query.start));
            recordsFiltered = recordsTotal;
        }

        var data = [];
        var nestedData = {};
        var role;
        if (users) {
            users.map((user, i) => {

                var view = '';
                view += "<a href='#' data-id='" + user['_id'] + "' class='btn btn-xs btn-light-danger btn-icon delete'>";
                view += "<i class='fa fa-eye'></i>";
                view += "</a>";

                const status = "<span style='font-weight:bold' class='label label-lg label-light-danger label-inline'>Active</span>";

                if (user['role'] === 1) {
                    role = "<span>Super admin</span>"
                } else {
                    role = "<span>Admin</span>"
                }

                nestedData = {
                    _id: user['_id'],
                    name: user['name'],
                    email: user['email'],
                    status: status,
                    role: role,
                    action: view
                };

                data.push(nestedData);
            })
        }

        var mytable = JSON.stringify({
            "draw": req.query.draw,
            "recordsFiltered": recordsFiltered,
            "recordsTotal": recordsTotal,
            "data": data
        });
        res.send(mytable);
    }
}


const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' })
}
const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

module.exports = userCtrl