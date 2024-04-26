const express =             require('express');
const { saveInfoToSession, copyToLocals } =   require('../middleware');
const User =                require('../models/user');
const catchAsync =          require('../utils/catchAsync');
const passport =            require('passport');
const router =              express.Router();

router.get('/register', saveInfoToSession, (req, res) => {
    res.render('users/register')
})
router.get('/access', (req, res) => {
    res.render('users/access')
})
router.post('/register', copyToLocals, catchAsync (async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp 🤷🏻‍♂️');
            const redirectUrl = res.locals.wantsTo || '/';
            delete req.session.wantsTo;
            res.redirect(redirectUrl);
        })
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}))

router.get('/login', saveInfoToSession, (req, res) => {
    res.render('users/login');
})

router.post('/login', copyToLocals, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    // console.log(`router.post('/login'\t`);
    req.flash('success', 'Welcome back 🙄');
    const redirectUrl = res.locals.wantsTo || '/';
    delete req.session.wantsTo;
    req.session.reviewDraft = res.locals.reviewDraft;
    // console.log('🤡' + JSON.stringify(res.locals));
    // console.log('🤡' + JSON.stringify(req.session));
    res.redirect(redirectUrl);
})

router.get('/logout', saveInfoToSession, copyToLocals, (req, res, next) => {
    req.logOut(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged out 🥾');
        delete req.session.wantsTo;
        delete req.session.cameFrom;
        res.redirect(res.locals.wantsTo || '/campgrounds');
    });
})

module.exports = router;