const User = require('../models/user');

module.exports.renderAccessForms = (req, res) => {
    res.render('users/access')
}

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register')
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.logoutUser = (req, res, next) => {
    req.logOut(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged out 🥾');
        delete req.session.wantsTo;
        delete req.session.cameFrom;
        res.redirect(res.locals.wishTo || '/');
    });
}

module.exports.registerNewUser = async (req, res) => {
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
}

module.exports.loginUser = (req, res) => {
    req.flash('success', 'Welcome back 🙄');
    const redirectUrl = res.locals.wishTo || '/';
    delete res.locals.wishTo;
    req.session.reviewDraft = res.locals.reviewDraft;
    res.redirect(redirectUrl);
}

