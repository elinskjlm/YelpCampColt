const { reviewSchema, campgroundSchema } = require('./schemas');
const ExpressError =            require('./utils/ExpressError');
const Campground =              require('./models/campground');
const Review =                  require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in 🖐🏻');
        return res.redirect('/access');
    }
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

// module.exports.tempFunc = (req, res, next) => {
    // console.log('☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️tempFunc');
    // console.log(`${req.method} requset\tfrom ${getPath(req.get('referer'))}\tto ${req.originalUrl}`);
    // console.log('🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾🌾');
//     next();
// }



module.exports.rememberDestination = (req, res, next) => {
    req.session.wishTo = req.originalUrl;
    next();

}

module.exports.rememberDraft = (req, res, next) => {
    req.session.reviewDraft ||= req.body.review;
    next();
}

module.exports.rememberOrigin = (req, res, next) => {
    req.session.wishTo = getPath(req.get('referer'));
    next();
}

module.exports.copyDestination = (req, res, next) => {
    res.locals.wishTo = req.session.wishTo;
    res.locals.reviewDraft = req.session.reviewDraft;
    next();
}
