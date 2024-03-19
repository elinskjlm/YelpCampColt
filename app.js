const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', () => {
    console.log('Database Connected.');
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/makecampground', async (req, res) => {
    const camp = new Campground({ title: 'Camp1', description: 'just just'});
    await camp.save()
    .then(() => {
       res.send(camp) 
    })
    .catch(e => {
        res.send('WTF01') 
    })
})

app.listen(port, () => {
    console.log(`Serving on port ${port} 👂`);
})