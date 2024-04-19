const express =                 require('express');
const router =                  express.Router();
const { campgroundSchema } =    require('../schemas');
const { isLoggedIn } =          require('../middleware');
const catchAsync =              require('../utils/catchAsync');
const ExpressError =            require('../utils/ExpressError');
const Campground =              require('../models/campground');

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',\t');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

router.get('/new', isLoggedIn, catchAsync(async (req, res) => {
    res.render('campgrounds/new');
}))

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    // req.body.image = req.body.campground.image.indexOf("/") >= 0 ? req.body.image : "/"+req.body.image
    const newCamp = new Campground(req.body.campground);
    const id = newCamp._id;
    await newCamp.save();
    req.flash('success', 'Succesfully made a new campground 👍🏻');
    res.redirect(`campgrounds/${id}`);
}))

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const regexId = /^[0-9a-f]{24}$/i;
    const idIsValid = regexId.test(id);
    if (idIsValid) {
        const campground = await Campground.findById(id).populate('reviews');
        if (campground) return res.render('campgrounds/show', { campground });
    }
    const shortId = id.length <= 24 ? id : (id.slice(0, 10) + '...');
    req.flash('error', `No campground with this id (${shortId})`);
    return res.redirect('/campgrounds');
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render('campgrounds/edit', { camp });
}))

router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    // TODO make sure image URL is valid, or at least contains "/" in it 
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { runValidators: true, new: true });
    req.flash('success', 'Successfully updated campground 👍🏻')
    res.redirect(`/campgrounds/${id}`);
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the campground 👍🏻');
    res.redirect(`/campgrounds`);
}))


module.exports = router;