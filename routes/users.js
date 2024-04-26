const express =             require('express');
const { copyDestination, rememberOrigin } =   require('../middleware');
const User =                require('../models/user');
const catchAsync =          require('../utils/catchAsync');
const passport =            require('passport');
const router =              express.Router();

router.get('/access', (req, res) => {
    res.render('users/access')
})

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', copyDestination, catchAsync (async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp 🤷🏻‍♂️');
            const redirectUrl = res.locals.wishTo || '/';
            delete res.locals.wishTo;
            req.session.reviewDraft = res.locals.reviewDraft;
            res.redirect(redirectUrl);
        })
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}))

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', copyDestination, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', 'Welcome back 🙄');
    const redirectUrl = res.locals.wishTo || '/';
    delete res.locals.wishTo;
    req.session.reviewDraft = res.locals.reviewDraft;
    res.redirect(redirectUrl);
})

router.get('/logout', rememberOrigin, copyDestination, (req, res, next) => {
    req.logOut(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged out 🥾');
        delete req.session.wantsTo;
        delete req.session.cameFrom;
        res.redirect(res.locals.wishTo || '/');
    });
})

module.exports = router;