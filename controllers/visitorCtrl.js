const Users = require('../models/userModel');
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const VisitorInfo = require('../models/visitorInfoModel');
const Employees = require('../models/employeeModel');
const multiparty = require('multiparty');
const moveFile = require('move-file');

const visitorCtrl = {
    getVisitorInfo: async (req, res) => {
        try {
            let created_by = '',
                fullname = '',
                mobile = '',
                company = '',
                address = '',
                image = '',
                cardno = '';
            created_by = req.user.id;
            fullname = req.body.stepOne.fullName.value;
            mobile = req.body.stepOne.mobileNo.value;
            company = req.body.stepOne.company.value;
            address = req.body.stepOne.address.value;
            image = req.body.stepThree.image.fileName;
            cardno = req.body.stepFour.cardno.value;
            // created_by = req.body.user.id;

            const emp_info = {
                emp_name: req.body.stepTwo.emp_name.value,
                emp_mobile: req.body.stepTwo.emp_mobile.value,
                designation: req.body.stepTwo.designation.value,
                department: req.body.stepTwo.department.value
            };

            let date_ob = new Date();
            let date = ("0" + date_ob.getDate()).slice(-2);
            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            let year = date_ob.getFullYear();
            let hours = date_ob.getHours();
            let minutes = date_ob.getMinutes();
            let seconds = date_ob.getSeconds();
            var start_time = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
            var end_time = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

            const visitorData = new VisitorInfo({
                fullname,
                mobile,
                company,
                address,
                image,
                cardno,
                emp_info,
                start_time,
                end_time,
                created_by
            })

            await visitorData.save();
            res.json({ msg: "visitor successfully submitted the request!", status: true });
            //  console.log('visitor successfully submitted the request!');
            // console.log(image);
            // return res.status(500).json({ status: true, msg: 'testing' })

        } catch (err) {
            return res.status(500).json({ msg: err.message, status: false });
            // return res.status(500).json({payload: req.body.stepOne.fullName.value,status:false,msg : 'testing'})
        }
    },
    index: (req, res) => {
        res.render('visitor/index', { title: 'Visitor List' });
    },
    getVisitorInfoV2: async (req, res) => {
        const form = new multiparty.Form();
        const timeNow = new Date().getTime();
        var fileName;

        let fullname = '',
            mobile = '',
            from = '',
            image = '',
            cardno = '';


        form.parse(req, async (err, fields, files) => {
            if (err) return res.json({ message: 'validation error', status: false });
            if (!fields.fullName) return res.json({ message: 'fullname is required!', status: false });
            if (!fields.mobileNo) return res.json({ message: 'mobileno is required!', status: false });
            if (!fields.emp_mobile) return res.json({ message: 'employee mobile is required!', status: false });
            if (!fields.created_id) return res.json({ message: 'createdId is required!', status: false });
            if (!fields.created_by) return res.json({ message: 'createdby is required!', status: false });
            const newFilePath = './upload/images/' + timeNow;
            if (files.image) {
                const currentPath = newFilePath + files.image[0].originalFilename;
                fileName = timeNow + files.image[0].originalFilename;
                await moveFile(files.image[0].path, currentPath);
            }
            fullname = fields.fullName[0];
            mobile = fields.mobileNo[0];
            from = fields.from[0];
            image = fileName;
            cardno = fields.cardno[0];

            const created_by = {
                _id: fields.created_id[0],
                name: fields.created_by[0]
            };

            const purpose = {
                _id: fields.purpose_id[0],
                purposename: fields.purposename[0]
            };

            const emp_info = {
                emp_name: fields.emp_name[0],
                emp_mobile: fields.emp_mobile[0],
                designation: fields.designation[0],
                department: fields.department[0]
            };

            const visitorData = new VisitorInfo({
                fullname,
                mobile,
                from,
                image,
                cardno,
                emp_info,
                created_by,
                purpose,
                time_in: new Date(),
                time_out: new Date(),
                duration: 0
            })
            const axios = require('axios');

            //SMS Integration
            // const url = 'http://103.9.185.211/smsSendApi.php?mobile='+emp_info.emp_mobile+'&message='+fullname +' has requested a visit now&cli=CARCOPOLO';
            
            // await axios.get(url)
            //   .then((response) => {
            //     console.log(response.data);
            // })
            //   .catch((error) => {
            //     console.error(error);
            // });

            await visitorData.save();
            res.json({ visitorData, status: true });
        })
    },
    visitorActiveInactive: async (req, res) => {
        var result;
        if (req.body.is_active == 1) {
            result = await VisitorInfo.findOneAndUpdate({ _id: req.body.id }, { is_active: 0 });
            return res.json('inactive');
        } else if (req.body.is_active == 0) {
            result = await VisitorInfo.findOneAndUpdate({ _id: req.body.id }, { is_active: 1 });
            return res.json('active');
        }
    },
    visitorStatusUpdate: async (req, res) => {
        try {
            var visit_data = await VisitorInfo.findById(req.body.id, { "status": 1, "time_out": 1, "duration": 1, "createdAt": 1 });
            var timeout, timein, duration;
            if (visit_data) {
                await VisitorInfo.updateOne(
                    { "_id": req.body.id },
                    { $set: { "time_out": new Date() } }
                );
                var visit = await VisitorInfo.findById(req.body.id, { "status": 1, "time_in": 1, "time_out": 1, "duration": 1 });
                timeout = (visit.time_out).getTime();
                timein = (visit.time_in).getTime();
                duration = dhm(Math.abs(timeout - timein));
                await VisitorInfo.updateOne(
                    { "_id": req.body.id },
                    { $set: { "status": 2, "duration": duration } }
                );
                return res.json({ msg: "Check out successfull !", status: true });
            } else {
                return res.json({ msg: "No record found !", status: false });

            }
        } catch (err) {
            return res.status(200).json({ msg: err.message, statuscode: 200 });
        }
    },
    visitorAjaxDatatable: async (req, res) => {
        var searchStr = req.query.search['value'];
        var recordsTotal = await VisitorInfo.countDocuments({});
        var recordsFiltered;

        if (searchStr) {
            var regex = new RegExp(searchStr, "i");
            searchStr = { $or: [{ 'fullname': regex }, { 'from': regex }, { 'cardno': regex }, { 'time_in': regex }, { 'time_out': regex }, { 'mobile': regex }, { 'status': regex }, { 'emp_info.emp_name': regex }] };
            var visitors = await VisitorInfo.find(searchStr, 'cardno fullname image from mobile status time_in time_out emp_info').sort({ 'createdAt': -1 });
            recordsFiltered = await VisitorInfo.countDocuments(searchStr);
        } else {
            searchStr = {};
            var visitors = await VisitorInfo.find({}).limit(Number(req.query.length)).skip(Number(req.query.start)).sort({ 'createdAt': -1 });
            recordsFiltered = recordsTotal;
        }

        // test
        // const tt = await VisitorInfo.find({}).then(async function(users){
     
        //     return users.forEach( async function(user) {
        //         user.items = await Employees.findOne({ mobile: user['mobile'] });
        //       });
        //     // return await users.map( async function (user) { 
        //     //     const aa =  await Employees.findOne({ mobile: user['mobile'] })
        //     //     return {...user, test: aa}; 
        //     // });

        // });
        // console.log(tt)

        // var dd = [];
        // const a = (await VisitorInfo.find({})).map( async function (user) { 
        //     const aa =  await Employees.findOne({ mobile: user['mobile'] })
        //     dd.push({...user, test: aa}); 
        // });
        // console.log(dd);

        // const tt = await VisitorInfo.find({}).exec()
        // .then(function(users) {
        //     var userIDs = users.map(function(user) {
        //       return user._id;
        //     });
          
        //     // returns a promise
        //     return Promise.all([
        //       // include users for the next `then`
        //       // avoids having to store it outside the scope of the handlers
        //       users,
        //       Employees.findOne({
        //         mobile: 
        //       }).exec()
        //     ]);
        //   })
        //   .then(function(results) {
            // var users = results[0];
            // var items = results[1];

            // return new Promise(function (resolve, reject) {
            
            //     results.map(async function (user) {
            //         user.items = await Employees.findOne({ mobile: user['mobile'] });
            //         return user;
            //     });

            //     resolve(results);
              
            // })

            // return Promise(function(r){
            //     // test
            //     return results.map(async function (user) {
            //         user.items = await Employees.findOne({ mobile: user['mobile'] });
            //         return user;
            //     });
            // });
          
        //     var data = [];
        //     results.forEach(async function(user) {
        //       const items = await Employees.findOne({
        //                 mobile: user.mobile
        //             })
        //         data.push({...user._doc, items: items });
        //     });
          
        //     return data;
        //   }).catch(function (err) {
        //     // do something with errors from either find
        //   });

        //   console.log(tt);

        // test


        // var testdata = [];
        // var ttt = (await VisitorInfo.find({})).map(async (v, i) => {
        //     // visitor.test = 2;
        //     const emp_data = await Employees.findOne({ mobile:v['mobile'] });
        //     testdata.push({test:emp_data,...v._doc});

        //     // console.log(  {test:emp_data,...v._doc} );
        // });

        // console.log(testdata)

        var data = [];
        var nestedData = {};
        var meeting_duration;
        if (visitors) {
            visitors.map((visitor, i) => {

                let timein_date = (visitor['time_in']).toLocaleDateString('en-ca');
                let timein_time = (visitor['time_in']).toLocaleTimeString();

                let timeout_date = (visitor['time_out']).toLocaleDateString('en-ca');
                let timeout_time = (visitor['time_out']).toLocaleTimeString();

                var status;
                if (visitor['status']) {
                    if (visitor['status'] == 1) {
                        status = "<span style='font-weight:bold' class='label label-lg label-light-info label-inline'>CheckedIn</span>";
                    } else if (visitor['status'] == 2) {
                        status = "<span style='font-weight:bold' class='label label-lg label-light-success label-inline'>Done</span>";
                    }
                } else {
                    status = "<span style='font-weight:bold' class='label label-lg label-light-danger label-inline'>CheckedIn</span>";
                }

                // var emp_status;
               
                // if (emp_data?.mobile == visitor['mobile']) {
                //     emp_status = "<span style='font-weight:bold' class='label label-lg label-light-success label-inline'>Employee </span>"+emp_data;
                // } else {
                //     emp_status = "";
                // }

                var action = "";
                if (visitor['status']) {
                    if (visitor['status'] != 2) {
                        action += "<button data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' class='btn btn-xs btn-light-success btn-icon eyebtn'>";
                        action += "<i class='ki ki-bold-more-ver'></i>";
                        action += "<div class='dropdown-menu'>";
                        action += "<a class='dropdown-item' href='#' data-id='" + visitor['_id'] + "' data-status='2'>CheckedOut</a>";
                        action += "</div>";
                        action += "</button>";
                    }
                }

                image = '<img src="/images/' + visitor['image'] + '" width="100" height="50" style="cursor:pointer;border-radius:50%" class="h-75 align-self-end zoom" alt="" />';

                nestedData = {
                    cardno: visitor['cardno'],
                    fullname: visitor['fullname'],
                    image: image,
                    time_in: timein_date + ' ' + timein_time,
                    time_out: timeout_date + ' ' + timeout_time,
                    duration: visitor['duration'],
                    from: visitor['from'],
                    mobile: visitor['mobile'],
                    status: status,
                    emp_name: visitor['emp_info']['emp_name'],
                    action: action
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
        await VisitorInfo.deleteMany({});
        res.json('visitor data deleted');
    },
    getVisitor: async (req, res) => {
        const visitor = await VisitorInfo.findOne({ mobile: req.params.mobile }).select('fullname from');
        if (!visitor) return res.json({ visitor: {}, status: false });
        return res.json({ visitor: visitor, status: true });
    },
    getVisitorAll: async(req, res) => {
        try {
            const visitorDetails = await VisitorInfo.find({ status: 1 });
            res.json({ visitorDetails, status: true });
        } catch (err) {
            return res.status(500).json({ msg: err.message, status: false })
        }
    },
}

function dhm(ms) {
    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    const daysms = ms % (24 * 60 * 60 * 1000);
    const hours = Math.floor(daysms / (60 * 60 * 1000));
    const hoursms = ms % (60 * 60 * 1000);
    const minutes = Math.floor(hoursms / (60 * 1000));
    const minutesms = ms % (60 * 1000);
    const sec = Math.floor(minutesms / 1000);
    return days + " d : " + hours + " h : " + minutes + " m";
}

module.exports = visitorCtrl