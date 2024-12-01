const router = require('express').Router()
const employeeCtrl = require('../controllers/employeeCtrl');
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const authBackend = require('../middleware/authBackend');

/**
 *  Backend Route
 */
router.get('/list', authBackend, employeeCtrl.index);
router.get('/create', authBackend, employeeCtrl.create);
router.post('/store', authBackend, employeeCtrl.store);
router.get('/edit/:id', authBackend, employeeCtrl.edit);
router.post('/update/:id', authBackend, employeeCtrl.update);
router.get('/employee-ajax-datatable', authBackend, employeeCtrl.employeeAjaxDatatable);
router.get('/bulkcreate', authBackend, employeeCtrl.bulkCreate);
router.post('/bulkstore', authBackend, employeeCtrl.bulkStore);
router.put('/activeinactive', authBackend, employeeCtrl.employeeActiveInactive);
router.delete('/delete-employees', employeeCtrl.delete);

module.exports = router