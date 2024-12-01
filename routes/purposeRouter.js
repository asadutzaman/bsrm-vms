const router = require('express').Router()
const purposeCtrl = require('../controllers/purposeCtrl');
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const authBackend = require('../middleware/authBackend');

/**
 *  Backend Route
 */
router.post('/store', authBackend, purposeCtrl.store);
router.get('/list', authBackend, purposeCtrl.list);

/**
 *  API Route
 */
router.get('/purpose/list', auth, purposeCtrl.list);



module.exports = router