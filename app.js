const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const { campgroundSchema, reviewSchema } = require('./schemas');
const Campground = require('./models/campground');
const Review = require('./models/review');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const review = require('./models/review');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', () => {
    console.log('Database Connected 🤝');
})

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// app.use((req, res, next) => {
//     console.log(`New Request:`);
//     console.log(`\tHost: ${req.hostname}`);
//     console.log(`\tPath: ${req.path}`);
//     console.log(`\tMethod: ${req.method}`);
//     console.log(`\tParams: ${req.params}`);
//     console.log(`\tProtocol: ${req.protocol}`);
//     console.log(`\tBody: ${req.body}`);
//     console.log(`\tApp: ${req.app}`);
//     next();
// })

app.use(express.urlencoded({extended: true}));
// app.use(express.json())
app.use(methodOverride('_method'));

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',\t');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',\t');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

app.get('/campgrounds/new', catchAsync(async (req, res) => {
    res.render('campgrounds/new');
}))

app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    // req.body.image = req.body.campground.image.indexOf("/") >= 0 ? req.body.image : "/"+req.body.image
    const newCamp = new Campground(req.body.campground);
    const id = newCamp._id;
    await newCamp.save();
    res.redirect(`campgrounds/${id}`);
}))

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', { campground });
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render('campgrounds/edit', { camp });
}))

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    // TODO make sure image URL is valid, or at least contains "/" in it 
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { runValidators: true, new: true });
    res.redirect(`/campgrounds/${id}`);
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
}))

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save(); // TODO do both savings in same time
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.delete('/campgrounds/:campId/reviews/:reviewId', catchAsync(async (req, res) => {
    const { campId, reviewId } = req.params;
    Campground.findByIdAndUpdate(campId, {$pull: { reviews: reviewId }})
    await review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${campId}`);
}))

app.all('*' , (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Unkown Error 🤷🏻‍♂️';
    console.log(`⚠️ Error: ${err}`);
    res.status(statusCode).render(`error`, { err });
})

app.listen(port, () => {    
    console.log(`Serving on port ${port} 👂`);
})