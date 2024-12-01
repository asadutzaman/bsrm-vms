const Users = require('../models/userModel')
const Employees = require('../models/employeeModel');
const VisitorInfo = require('../models/visitorInfoModel');
const Purpose = require('../models/purposeModel');

const purposeCtrl = {
    store: async(req, res) => {
        const { purposename } = req.body;
        const data = new Purpose({
            purposename
        })
        await data.save();
        res.json('purpose saved');
    },
    list: async(req, res) => {

        try {
            const rows = await Purpose.find().where('status', '1').select('_id purposename');
            res.json({ purposeList: rows, status: true });
        } catch (err) {
            return res.status(500).json({ msg: err.message, status: false })
        }

    },
}

module.exports = purposeCtrl;