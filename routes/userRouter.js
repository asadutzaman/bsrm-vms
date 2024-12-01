const router = require('express').Router();
const userCtrl = require('../controllers/userCtrl');
const auth = require('../middleware/auth');
const authBackend = require('../middleware/authBackend');

router.post('/register', userCtrl.register);
/* API Route starts */
router.post('/access_token', userCtrl.accessToken);

router.get('/logout', userCtrl.logout);

router.get('/refresh_token', userCtrl.refreshToken);

router.get('/infor', auth, userCtrl.getUser);

router.get('/employee', auth, userCtrl.getEmployee);

/* Backend Panel Route starts */
router.route('/')
    .get(userCtrl.backLogin)
    .post(userCtrl.backLogin);

router.get('/dashboard', authBackend, userCtrl.dashboard);

router.get('/backlogout', userCtrl.backLogout);

router.get('/user', authBackend, userCtrl.index);
router.get('/user/create', authBackend, userCtrl.create);

router.get('/user-ajax-datatable', authBackend, userCtrl.userAjaxDatatable);


module.exports = router;