const { reviewSchema, campgroundSchema } = require('./schemas');
const ExpressError =            require('./utils/ExpressError');
const Campground =              require('./models/campground');
const Review =                  require('./models/review');
// const { session } = require('passport');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in 🖐🏻');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) res.locals.returnTo = req.session.returnTo;
    next();
}

module.exports.isAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params;
    if(req.originalUrl.includes('/reviews')){
        const review = await Review.findById(reviewId);
        if (!review.author.equals(req.user._id)) {
            req.flash('error', 'You do not have premission to do that 🖐🏻');
            return res.redirect(`/campgrounds/${id}`);
        }
    } else {
        const camp = await Campground.findById(id);
        if (!camp.author.equals(req.user._id)) {
            req.flash('error', 'You do not have premission to do that 🖐🏻');
            return res.redirect(`/campgrounds/${id}`);
        }
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',\t');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',\t');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

const getPath = (refer => {
    if (refer) {
        const noProt = refer.replace('http://', '');
        const parts = noProt.split('/');
        parts.shift();
        return parts.join('/');
    }
    return undefined;
})

module.exports.tempFunc = (req, res, next) => {
    console.log('☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️tempFunc');
    console.log(`${req.method} requset\tfrom ${getPath(req.get('referer'))}\tto ${req.originalUrl}`);
    console.log(`req.session.reviewDraft: ${req.session.reviewDraft}`);
    console.log(`req.session.cameFrom: ${req.session.cameFrom}`);
    console.log(`req.session.wantsTo: ${req.session.wantsTo}`);
    console.log(`res.locals.reviewDraft: ${res.locals.reviewDraft}`);
    console.log(`res.locals.cameFrom: ${res.locals.cameFrom}`);
    console.log(`res.locals.wantsTo: ${res.locals.wantsTo}`);
    console.log('🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾');
    next();
}

module.exports.saveInfoToSession = (req, res, next) => {
    // console.log(req.body.review || '~~~~~~~~~~~~~~~~~~');
    req.session.reviewDraft ||= req.body.review;
    req.session.cameFrom = getPath(req.get('referer'));
    req.session.wantsTo = req.originalUrl;
    // console.log('\t\t👽👽👽👽👽👽👽👽👽saveInfoToSession');
    // console.log(`\t\treq.session.reviewDraft: ${JSON.stringify(req.session.reviewDraft)}`);
    // console.log(`\t\treq.session.cameFrom: ${req.session.cameFrom}`);
    // console.log(`\t\treq.session.wantsTo: ${req.session.wantsTo}`);
    // console.log('\t\t🐸🐸🐸🐸🐸🐸🐸🐸🐸');
    next();
}

module.exports.copyToLocals = (req, res, next) => {
    // console.log('\t\t🦥🦥🦥🦥🦥🦥🦥copyToLocals');
    // console.log(`\t\tres.locals.reviewDraft: ${res.locals.reviewDraft}`);
    // console.log(`\t\tres.locals.cameFrom: ${res.locals.cameFrom}`);
    // console.log(`\t\tres.locals.wantsTo: ${res.locals.wantsTo}`);
    // console.log('\t\t⬇️  ⬇️  ⬇️  ⬇️');
    res.locals.reviewDraft = req.session.reviewDraft;
    res.locals.cameFrom = req.session.cameFrom;
    res.locals.wantsTo = req.session.wantsTo;
    // console.log(`\t\tres.locals.reviewDraft: ${JSON.stringify(res.locals.reviewDraft)}`);
    // console.log(`\t\tres.locals.cameFrom: ${res.locals.cameFrom}`);
    // console.log(`\t\tres.locals.wantsTo: ${res.locals.wantsTo}`);
    // console.log('\t\t⬇️  ⬇️  ⬇️  ⬇️');
    if(['/login', '/logout', '/register'].includes(res.locals.wantsTo)) res.locals.wantsTo = res.locals.cameFrom;
    // console.log(`\t\tres.locals.cameFrom: ${res.locals.cameFrom}`);
    // console.log(`\t\tres.locals.wantsTo: ${res.locals.wantsTo}`);
    // console.log('\t\t🦔🦔🦔🦔🦔🦔🦔');
    next();
}

