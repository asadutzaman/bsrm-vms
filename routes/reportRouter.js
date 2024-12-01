const router = require('express').Router()
const reportCtrl = require('../controllers/reportCtrl');
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const authBackend = require('../middleware/authBackend');

/**
 *  Backend Route
 */
router.get('/general-report', authBackend, reportCtrl.generalReport);
router.post('/general-report-ajax', authBackend, reportCtrl.generalReportAjax);


module.exports = router