const mongoose = require('mongoose');
const Campground = require('../models/campground');
const camps = require('./locations');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', () => {
    console.log('Database Connected.');
})

const cleanDB = async () => await Campground.deleteMany({});

const seedDB = async () => {
    await Campground.insertMany(camps)
    // .then(() => console.log('insertMany Then'))
    // .catch(err => console.log('insertMany Catch', err));
}

cleanDB();

seedDB()
.then(() => {
     console.log('Seed Then');
     db.close();
})
.catch(err => {
    console.log('Seed Catch', err);
    db.close();
});