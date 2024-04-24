const express =             require('express');
const path =                require('path');
const mongoose =            require('mongoose');
const methodOverride =      require('method-override');
const ejsMate =             require('ejs-mate');
const session =             require('express-session');
const flash =               require('connect-flash');
const ExpressError =        require('./utils/ExpressError');
const campgroundRoutes =    require('./routes/campgrounds');
const reviewRoutes =        require('./routes/reviews');
const userRoutes =          require('./routes/users');
const User =                require('./models/user');
const passport =            require('passport');
const LocalStrategy =       require('passport-local');
const {tempFunc} = require('./middleware');
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
app.use(express.static(path.join(__dirname, 'public')));
const sessionConfig = {
    secret: 'temporaryTODOreplaceIt',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// app.use(tempFunc)
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
    res.render('home')
})

app.all('*' , (req, res, next) => {
    next(new ExpressError(`Page not found: ${req.url}`, 404));
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