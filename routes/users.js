const express =             require('express');
const { copyDestination, rememberOrigin } =   require('../middleware');
const catchAsync =          require('../utils/catchAsync');
const passport =            require('passport');
const users =               require('../controllers/users');
const router =              express.Router();


router.get('/access', users.renderAccessForms);

router.route('/register')
    .get(users.renderRegisterForm)
    .post(copyDestination, catchAsync(users.registerNewUser));

router.route('/login')
    .get(users.renderLoginForm)
    .post(copyDestination, 
        passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), 
        users.loginUser);

router.get('/logout', rememberOrigin, copyDestination, users.logoutUser);

module.exports = router;