const express =             require('express');
const router =              express.Router({ mergeParams: true });
const catchAsync =          require('../utils/catchAsync');
const reviews =             require('../controllers/reviews');
const { validateReview, isAuthor, isLoggedIn, rememberDraft } =  require('../middleware');


router.post('/', rememberDraft, isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isAuthor, catchAsync(reviews.deleteReview))

module.exports = router;