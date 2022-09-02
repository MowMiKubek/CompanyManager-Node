const express = require('express');
const path = require('path');
const ejsLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const {SESSION_KEY_SECRET} = require('./config');

const app = express();

// session
app.use(session({
    secret: SESSION_KEY_SECRET,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
    resave: false
}));

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/../views'));

// set layout
app.use(ejsLayouts);
app.set('layout', 'layouts/main');

// public folder
app.use(express.static('public'));

// set up body parser
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// middleware passing URL to render engine
app.use('/', require('./middleware/view-variables'))

// set up routes (this must be here, after setting up views etc.)
app.use(require('./routes/web'));

module.exports = app;