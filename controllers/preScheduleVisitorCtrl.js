// const PreScheduleVisitors = require('../models/userModel')
    //const bcrypt = require('bcrypt')
const bcrypt = require('bcrypt-nodejs')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator');
const VisitorInfo = require('../models/visitorInfoModel');
const Employees = require('../models/employeeModel');
const PreScheduleVisitors = require('../models/preScheduleVisitorModel');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        ciphers: 'SSLv3',
    },
});


const preScheduleVisitorCtrl = {
    register: async(req, res) => {
        try {
            const { name, email, password } = req.body;

            if (name == '' || email == '' || password == '') {
                req.flash('msg', 'Fillup all the fields!');
                return res.redirect('/user/create');
            }

            const user = await PreScheduleVisitors.findOne({ email })
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

            const newUser = new PreScheduleVisitors({
                name,
                email,
                password: passwordHash
            })

            // Save mongodb
            await newUser.save()
            req.flash('msg', 'User added successfully!');
            return res.redirect('/user');

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
    getEmployees: async (req, res) => {
        try {
          const employeeDetails = await Employees.find({ status: 1 }).select(
            "emp_id name designation"
          ); // Select only relevant fields
          res.json({ employeeDetails, status: true });
        } catch (err) {
          res.status(500).json({ msg: err.message, status: false });
        }
    },      
    index: (req, res) => {
        res.render('preschedule/index', { title: 'Pre schedule visitor List', message: req.flash('msg') });
    },
    create: (req, res) => {
        res.render('preschedule/create', { title: 'Create a preschdule visitor', message: req.flash('msg') });
    },
    preVisitorAjaxDatatable: async(req, res) => {
        const { page = 1, limit = 10, search = '' } = req.query;
        const query = search
            ? { fullname: { $regex: search, $options: 'i' } } // Case-insensitive search
            : {};

        try {
            const visitors = await PreScheduleVisitors.find(query)
                .skip((page - 1) * limit)
                .limit(parseInt(limit))
                .sort({ createdAt: -1 }); // Newest first

            const total = await PreScheduleVisitors.countDocuments(query);

            res.json({
                data: visitors,
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit),
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    save: async (req, res) => {
        try {
            const { fullname, mobile, pre_schedule_date, reason, employee_id } = req.body;
    
            // Fetch employee details using the employee_id
            const employee = await Employees.findOne({ emp_id: employee_id }).select('-_id emp_id email name designation department company');
            if (!employee) {
                return res.status(404).json({ msg: "Employee not found!" });
            }
    
            // Prepare the visitor object with employee information
            const visitorInfo = new PreScheduleVisitors({
                fullname,
                mobile,
                pre_schedule_date,
                reason,
                emp_info: employee, // Save the employee details in emp_info
            });
    
            // Save visitor information
            await visitorInfo.save();
    
            // Prepare email details
            const mailOptions = {
                from: '"VMS" <support@btracsl.com>', // Sender's email and name
                to: employee.email, // Employee email
                subject: 'New Visitor Scheduled',
                html: `
                    <h1>New Visitor Scheduled</h1>
                    <p>Dear ${employee.name},</p>
                    <p>A new visitor has been scheduled for you:</p>
                    <ul>
                        <li><strong>Visitor Name:</strong> ${fullname}</li>
                        <li><strong>Mobile:</strong> ${mobile}</li>
                        <li><strong>Reason:</strong> ${reason}</li>
                        <li><strong>Scheduled Date:</strong> ${new Date(pre_schedule_date).toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })}</li>
                    </ul>
                    <p>Best Regards,<br>VMS</p>
                `,
            };
    
            // Send email
            await transporter.sendMail(mailOptions);
    
            req.flash("msg", "Visitor added successfully and email sent to the employee!");
            return res.redirect("/schedule");
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
}

module.exports = preScheduleVisitorCtrl