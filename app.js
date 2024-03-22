const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', () => {
    console.log('Database Connected 🤝');
})

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

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
})

app.get('/campgrounds/new', async (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', async (req, res) => {
    const newCamp = new Campground(req.body);
    const id = newCamp._id;
    await newCamp.save();
    res.redirect(`campgrounds/${id}`);
})

app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', { campground });
})

app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params;
    try {
        console.log(id);
        const camp = await Campground.findById(id);
        res.render('campgrounds/edit', { camp });
    }
    catch (err) {
        console.log(err);
        res.send(`Error while trying to edit. Check terminal`);
    }
})

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/campgrounds/${id}`);
})

app.listen(port, () => {    
    console.log(`Serving on port ${port} 👂`);
})