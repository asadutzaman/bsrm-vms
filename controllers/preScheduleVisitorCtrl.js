const Users = require('../models/userModel')
    //const bcrypt = require('bcrypt')
const bcrypt = require('bcrypt-nodejs')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator');
const VisitorInfo = require('../models/visitorInfoModel');
const Employees = require('../models/employeeModel');
const PreScheduleVisitors = require('../models/preScheduleVisitorModel');

const preScheduleVisitorCtrl = {
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
    getPreScheduleVisitor: async(req, res) => {
        try {
            const user = await PreScheduleVisitors.findById(req.user.id).select('-password')
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
    index: (req, res) => {
        res.render('preschedule/index', { title: 'Pre schedule visitor List', message: req.flash('msg') });
    },
    create: (req, res) => {
        res.render('preschedule/create', { title: 'Create a preschdule visitor', message: req.flash('msg') });
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
    },
    save: async(req, res) => {
        try {
            const { fullname, mobile, pre_schedule_date, reason } = req.body;
            const visitorInfo = new PreScheduleVisitors({
                fullname,
                mobile,
                pre_schedule_date,
                reason,
            });
            await visitorInfo.save();
            req.flash('msg', 'Visitor added successfully!');
            return res.redirect('/schedule');
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
}

module.exports = preScheduleVisitorCtrl