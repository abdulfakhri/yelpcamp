if (process.env.NODE_ENV !== 'production')
{
    require('dotenv').config();
}

//Import resources
const express = require('express');
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const flash = require('connect-flash');
const sanitizeV5 = require('./utils/mongoSanitizeV5.js');
const helmet = require('helmet');

//Import authentication
const passport = require('passport');
const LocalStrategy = require('passport-local');

// const catchAsync = require("./utils/catchAsync");
const ExpressError = require('./utils/ExpressError.js');

// Require Model
const campgroundRoutes = require("./routes/campgrounds.js");
const reviewRoutes = require("./routes/reviews.js");
const userRoutes = require("./routes/users.js");
const User = require("./models/user.js");

// const dbUrl = 'mongodb://127.0.0.1:27017/yelp-camp'; //process.env.DB_URL; use this when we deploy
const dbUrl = process.env.DB_URL;

// Connect Mongoose
const mongoose = require('mongoose');
main().catch(err => console.log(err));

async function main()
{
    await mongoose.connect(dbUrl);
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/yelp-camp');` if your database has auth enabled
}

// Use EJS
app.engine("ejs", ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.set('query parser', 'extended');

// uses
//Parse data
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

const store = MongoStore.create(
    {
        mongoUrl: dbUrl,
        secret: 'thisshouldbeabettersecret!',
        touchAfter: 24 * 60 * 60
    });

store.on('error', function (e)
{
    console.log(e);
});

// Session and Cookies
const sessionConfig =
{
    store,
    name: 'session',
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie:
    {
        httpOnly: true,
        // secure: true, // this only works if site is HTTPS
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), //for a week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

//Uses
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

// Content Security Policy
const scriptSrcUrls =
[
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/",
];

const styleSrcUrls =
[
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/"
];

const connectSrcUrls =
[
    "https://api.maptiler.com/"
];

const fontSrcUrls = [];

app.use(helmet.contentSecurityPolicy(
    {
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                `https://res.cloudinary.com/dz7w4xpwj/`,
                "https://images.unsplash.com",
                "https://api.maptiler.com/"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

//Passport auth
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) =>
{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.get('/fakeUser', async (req, res) =>
{
    const user = new User({ email: 'johndoe@icloud.com', username: 'johndoe' });
    const newUser = await User.register(user, 'chicken');
    res.send(newUser);
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(sanitizeV5({ replaceWith: '_' }));

//use paths
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

// Routes
//Home
app.get('/', (req, res) =>
{
    res.render('home');
});

app.use((req, res, next) =>
{
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res) =>
{
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no, something went wrong!'
    res.status(statusCode).render('error', { err });
});

// Listener
app.listen(3000, () =>
{
    console.log('Listening on port 3000...');
});