const express =             require('express');
const router =              express.Router({ mergeParams: true });
const catchAsync =          require('../utils/catchAsync');
const Campground =          require('../models/campground');
const Review =              require('../models/review');
const { validateReview, isAuthor, isLoggedIn, rememberDraft } =  require('../middleware');


router.post('/', rememberDraft, isLoggedIn, validateReview, catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save(); // TODO do both savings in same time
    await campground.save();
    delete req.session.reviewDraft;
    req.flash('success', 'Successfully added new review 👌🏻');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:reviewId', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    Campground.findByIdAndUpdate(id, {$pull: { reviews: reviewId }})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted the review 👌🏻');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;