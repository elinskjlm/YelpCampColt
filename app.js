if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express =             require('express');
const path =                require('path');
const mongoose =            require('mongoose');
const methodOverride =      require('method-override');
const ejsMate =             require('ejs-mate');
const session =             require('express-session');
const MongoStore =          require('connect-mongo');
const flash =               require('connect-flash');
const helmet =              require('helmet');
const ExpressError =        require('./utils/ExpressError');
const campgroundRoutes =    require('./routes/campgrounds');
const reviewRoutes =        require('./routes/reviews');
const userRoutes =          require('./routes/users');
const User =                require('./models/user');
const passport =            require('passport');
const LocalStrategy =       require('passport-local');
const dbUrl =               process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
const port =                process.env.PORT;
const secret =              process.env.SECRET;

const app = express();

mongoose.connect(dbUrl);
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

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600, // seconds
})

store.on('error', function(e) {
    console.log('SESSION STORE ERROR', e)
})

const sessionConfig = {
    name: 'session',
    secret,
    store,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // miliseconds
        maxAge: 1000 * 60 * 60 * 24 * 7 // miliseconds
    }
}
app.use(session(sessionConfig));
app.use(flash());

const scriptSrcUrls = [
    "https://cdn.jsdelivr.net/",
    "https://unpkg.com/maplibre-gl@4.2.0/",
    "https://unpkg.com/@maplibre/maplibre-gl-geocoder@1.2.0/",
];

const styleSrcUrls = [
    "https://demotiles.maplibre.org",
    "https://unpkg.com/maplibre-gl@4.2.0/",
    "https://unpkg.com/@maplibre/",
    "https://cdn.jsdelivr.net/",
];

const connectSrcUrls = [
    "https://tile.openstreetmap.org/",
    "https://nominatim.openstreetmap.org/",
    "https://demotiles.maplibre.org/font/",
    
];

const fontSrcUrls = [];

app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc:   [],
          connectSrc:   ["'self'", ...connectSrcUrls],
          fontSrc:      ["'self'", ...fontSrcUrls],
          scriptSrc:    ["'self'", "'unsafe-inline'", ...scriptSrcUrls],
          styleSrc:     ["'self'", "'unsafe-inline'", ...styleSrcUrls],
          workerSrc:    ["'self'", "blob:"],
          objectSrc:    [],
          imgSrc:       [
            "'self'",
            "blob:",
            "data:",
            "https://res.cloudinary.com/dis3rrz4f/",
          ]
        },
      },
    })
  );

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


app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/about', (req, res) => {
    res.render('about')
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