const router = require('express').Router();
const preScheduleVisitorCtrl = require('../controllers/preScheduleVisitorCtrl');
const userCtrl = require('../controllers/userCtrl');
const auth = require('../middleware/auth');
const authBackend = require('../middleware/authBackend');



/* Backend Panel Route starts */
// router.route('/')
//     .get(preScheduleVisitorCtrl.index)
//     .post(preScheduleVisitorCtrl.index);

router.get('/', authBackend, preScheduleVisitorCtrl.index);
router.get('/create', authBackend, preScheduleVisitorCtrl.create); 
router.post('/save', authBackend, preScheduleVisitorCtrl.save);
// router.get('/user/create', authBackend, userCtrl.create);
// router.get('/dashboard', authBackend, userCtrl.dashboard);

// router.get('/backlogout', userCtrl.backLogout);

// router.get('/user', authBackend, userCtrl.index);

// router.get('/user-ajax-datatable', authBackend, userCtrl.userAjaxDatatable);


module.exports = router;