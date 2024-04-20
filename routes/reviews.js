const express =             require('express');
const router =              express.Router({ mergeParams: true });
const { reviewSchema } =    require('../schemas');
const catchAsync =          require('../utils/catchAsync');
const ExpressError =        require('../utils/ExpressError');
const Campground =          require('../models/campground');
const Review =              require('../models/review');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',\t');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save(); // TODO do both savings in same time
    await campground.save();
    req.flash('success', 'Successfully added new review 👌🏻');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    Campground.findByIdAndUpdate(id, {$pull: { reviews: reviewId }})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted the review 👌🏻');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;