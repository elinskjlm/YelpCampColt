const express =         require('express');
const path =            require('path');
const mongoose =        require('mongoose');
const methodOverride =  require('method-override');
const ejsMate =         require('ejs-mate');
const ExpressError =    require('./utils/ExpressError');
const campgrounds =     require('./routes/campgrounds');
const reviews =         require('./routes/reviews');

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

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.use('/campgrounds/:id/reviews', reviews);
app.use('/campgrounds', campgrounds);

app.get('/', (req, res) => {
    res.render('home')
})

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