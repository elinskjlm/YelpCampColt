const express =             require('express');
const { copyDestination, rememberOrigin } =   require('../middleware');
const catchAsync =          require('../utils/catchAsync');
const passport =            require('passport');
const users =               require('../controllers/users');
const router =              express.Router();

router.get('/access', users.renderAccessForms)

router.get('/register', users.renderRegisterForm)

router.get('/login', users.renderLoginForm)

router.get('/logout', rememberOrigin, copyDestination, users.logoutUser)

router.post('/register', copyDestination, catchAsync(users.registerNewUser))

router.post('/login', copyDestination, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.loginUser)

module.exports = router;