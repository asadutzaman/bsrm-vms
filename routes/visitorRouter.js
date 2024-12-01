const router = require('express').Router()
const visitorCtrl = require('../controllers/visitorCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const authBackend = require('../middleware/authBackend');

/**
 *  API Route
 */
router.post('/visitorinfo', auth, visitorCtrl.getVisitorInfo);
router.post('/visitorinfo/v2', auth, visitorCtrl.getVisitorInfoV2);
router.post('/visitor/:mobile', auth, visitorCtrl.getVisitor);
router.get('/all', auth, visitorCtrl.getVisitorAll);


/**
 *  Backend Route
 */
router.get('/', authBackend, visitorCtrl.index);
router.get('/visitor-ajax-datatable', authBackend, visitorCtrl.visitorAjaxDatatable);
router.put('/status/update', authBackend, visitorCtrl.visitorStatusUpdate);
router.put('/activeinactive', authBackend, visitorCtrl.visitorActiveInactive);
router.delete('/delete-visitors', visitorCtrl.delete);




module.exports = router