const Users = require('../models/userModel')
//const bcrypt = require('bcrypt')
const bcrypt = require('bcrypt-nodejs')
const jwt = require('jsonwebtoken')
const Employees = require('../models/employeeModel');
const multiparty = require('multiparty');
const fs = require('fs');
const csv = require('fast-csv');
const moveFile = require('move-file');
const axios = require('axios');

const employeeCtrl = {
    getEmployee: async (req, res) => {
        try {
            const employeeDetails = await Employees.find({ status: 1 });
            res.json({ employeeDetails, status: true });
        } catch (err) {
            return res.status(500).json({ msg: err.message, status: false })
        }
    },

    employeeActiveInactive: async (req, res) => {
        var result;
        if (req.body.status == 1) {
            result = await Employees.findOneAndUpdate({ _id: req.body.id }, { status: 0 });
            return res.json('inactive');
        } else if (req.body.status == 0) {
            result = await Employees.findOneAndUpdate({ _id: req.body.id }, { status: 1 });
            return res.json('active');
        }
    },

    index: (req, res) => {
        res.render('employee/index', { title: 'Employee List', message: req.flash('msg') });
    },
    create: (req, res) => {
        res.render('employee/create', { title: 'Add Employee ok', message: req.flash('msg') });
    },
    edit: async (req, res) => {
        const row = await Employees.findById({ _id: req.params.id });
        // res.send(row);
        res.render('employee/edit', { employee: row, title: 'Edit Employee', message: req.flash('msg') });
    },
    update: async (req, res) => {
        const { name, mobile, email, designation, department, company, joining } = req.body;
        var result = await Employees.findOneAndUpdate({ _id: req.params.id }, {
            name,
            mobile,
            email,
            designation,
            department,
            company,
        });
        req.flash('msg', 'Employee Updated successfully!');
        return res.redirect('/employee/list');
    },
    bulkCreate: (req, res) => {
        res.render('employee/bulkcreate', { title: 'Bulk Upload', message: req.flash('msg') });
    },
    bulkStore: async (req, res) => {
        const form = new multiparty.Form();
        const timeNow = new Date().getTime();
        var fileName;
        const fileRows = [];

        form.parse(req, async (err, fields, files) => {

            const newFilePath = './upload/images/' + timeNow;
            if (files.image) {
                try {

                    let tutorials = [];
                    let path = __dirname + "./upload/images/" + files.image[0].originalFilename;

                    await moveFile(files.image[0].path, path);

                    fs.createReadStream(path)
                        .pipe(csv.parse({ headers: true }))
                        .on("error", (error) => {
                            throw error.message;
                        })
                        .on("data", async (row) => {
                            tutorials.push(row);
                            var flag = false;
                            var m_mobile;
                            if (row.mobile.length < 11) {
                                m_mobile = '0' + row.mobile;
                            } else {
                                m_mobile = row.mobile;
                            }
                            // console.log(row.designation);
                            var temp = new Employees({
                                name: row.name,
                                email: row.email,
                                mobile: m_mobile,
                                department: row.department,
                                designation: row.designation,
                                company: row.company
                            })
                            const isMatch = await Employees.findOne({ mobile: m_mobile });
                            if (isMatch) {
                                flag = true;
                            }
                            if (!flag) {
                                await temp.save();
                            }
                        })
                        .on("end", () => {
                            // console.log(tutorials)
                        });
                    req.flash('msg', 'Employee added successfully in Bulk!');
                    return res.redirect('/employee/list');
                } catch (error) {
                    console.log(error);
                    req.flash('msg', 'Please upload the file!');
                    return res.redirect('/employee/bulkcreate');
                }
            };
        })

    },
    store: async (req, res) => {
        try {
            const { emp_id, name, mobile, email, designation, department, company, joining } = req.body;
    
            if (!name || !mobile || !designation || !emp_id) {
                req.flash('msg', 'Fill up all the required fields!');
                return res.redirect('/employee/create');
            }
    
            const employee = await Employees.findOne({ mobile });
            if (employee) {
                req.flash('msg', 'Employee already exists!');
                return res.redirect('/employee/create');
            }
    
            const empData = new Employees({
                emp_id,
                name,
                mobile,
                email,
                designation,
                department,
                company, // Ensure this is optional if not in the form
                joining,
            });
    
            await empData.save();
            req.flash('msg', 'Employee added successfully!');
            return res.redirect('/employee/list');
        } catch (err) {
            console.error('Error saving employee:', err.message); // Log the error
            req.flash('msg', 'An error occurred while adding the employee.');
            return res.redirect('/employee/create');
        }
    },    
    employeeAjaxDatatable: async (req, res) => {
        var searchStr = req.query.search['value'];
        var recordsTotal = await Employees.countDocuments({});
        var recordsFiltered;

        if (searchStr) {
            var regex = new RegExp(searchStr, "i");
            searchStr = { $or: [{ 'name': regex }, { 'email': regex }, { 'mobile': regex }, { 'designation': regex }, { 'department': regex }] };
            var employees = await Employees.find(searchStr, '_id name email designation department mobile status');
            recordsFiltered = await Employees.countDocuments(searchStr);
        } else {
            searchStr = {};
            var employees = await Employees.find({}).limit(Number(req.query.length)).skip(Number(req.query.start));
            recordsFiltered = recordsTotal;
        }

        var data = [];
        var nestedData = {};
        var status;
        if (employees) {
            employees.map((employee, i) => {

                var view = '';
                view += "<a href='/employee/edit/" + employee['_id'] + "' data-id='" + employee['_id'] + "' class='btn btn-xs btn-light-danger btn-icon edit'>";
                view += "<i class='fa fa-edit'></i>";
                view += "</a>";

                if (employee['status'] === 1) {
                    status = "<span style='cursor:pointer;font-weight:bold' class='label label-lg label-light-success label-inline status' data-id='" + employee['_id'] + "' data-status='" + employee['status'] + "'>Active</span>";
                } else {
                    status = "<span style='cursor:pointer;font-weight:bold' class='label label-lg label-light-danger label-inline status' data-id='" + employee['_id'] + "' data-status='" + employee['status'] + "'>Inactive</span>";
                }

                nestedData = {
                    name: employee['name'],
                    mobile: employee['mobile'],
                    designation: employee['designation'],
                    department: employee['department'],
                    status: status,
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
    delete: async (req, res) => {
        // await Employees.deleteMany({});
        axios.get('http://hris.btraccl.com/v1/employee/list').then(resp => {
            // console.log(resp.data);
            let employees = [];
            resp.data.data.map(async (employee, index) => {
                let empData = {
                    emp_id: employee['id_no'],
                    name: employee['name'],
                    mobile: employee['mobile_no'],
                    email: employee['email'],
                    designation: employee['designation'],
                    department: employee['department'],
                    company: '',
                    joining: employee['joining_date'],
                };
                employees.push(empData);
            })
            Employees.insertMany(employees)
                .then(() => {
                    res.status(200).send({
                        message: "Employee uploaded successfully: ",
                    });
                })
                .catch((error) => {
                    res.status(500).send({
                        message: "Fail to import data into database!",
                        error: error.message,
                    });
                });
        });
    },
}

module.exports = employeeCtrl;