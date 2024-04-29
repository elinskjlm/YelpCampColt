const mongoose = require('mongoose');
const Campground = require('../models/campground');
const camps = require('./campSeeds');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', () => {
    console.log('Database Connected.');
})

const cleanDB = async () => await Campground.deleteMany({});

const seedDB = async () => {
    await Campground.insertMany(camps)
}

cleanDB();

seedDB()
.then(() => {
     console.log('Seeding Done.');
})
.catch(err => {
    console.log('Seeding Error: ', err);
})
.finally(() => {
    db.close();
});