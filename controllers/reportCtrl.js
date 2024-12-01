const Users = require('../models/userModel')
const Employees = require('../models/employeeModel');
const VisitorInfo = require('../models/visitorInfoModel');

const reportCtrl = {
    generalReport: async(req, res) => {
        res.render('report/generalreport');
    },
    generalReportAjax: async(req, res) => {
        var today = new Date();
        var todayVisitor = [];
        var todayVisitorCount = 0;

        var weekVisitor = [];
        var weekVisitorCount = 0;

        var monthVisitor = [];
        var monthVisitorCount = 0;
        // todays visitor
        var rows = await VisitorInfo.find({});
        if (req.body.type == 1) {
            rows.forEach((row, i) => {
                if (row.createdAt.getDate() === today.getDate() && row.createdAt.getDay() === today.getDay()) {
                    todayVisitor.push(row);
                    todayVisitorCount += 1;
                }
            })
            return res.json(todayVisitor);
        } else if (req.body.type == 2) {
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
            return res.json(weekVisitor);
        } else if (req.body.type == 3) {
            // this months visitor
            rows = await VisitorInfo.find({});
            rows.forEach((row, i) => {
                if (row.createdAt.getFullYear() === today.getFullYear() && row.createdAt.getMonth() + 1 === today.getMonth() + 1) {
                    monthVisitor.push(row);
                    monthVisitorCount += 1;
                }
            })
            return res.json(monthVisitor);
        }

    },
}

module.exports = reportCtrl;