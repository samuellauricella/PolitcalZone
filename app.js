const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator')
const promisify = require('es6-promisify');
const passport = require('passport');

const bodyParser = require('body-parser');
const sassMiddleware = require('node-sass-middleware');
const errorHandlers = require('./handlers/errorHandlers');
const flash = require('connect-flash');
const session = require('express-session');

/////////////// IMPORTING ROUTES//////////////////////////////

const routes = require("./routes/index")
require('./handlers/passport')

const app = express();

app.use(cookieParser());
app.use(expressValidator());

app.use(session({
  secret: process.env.SECRET,
  cookie: { maxAge: 60000},
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash())


// pass variables to our templates + all requests
app.use((req, res, next) => {
  res.locals.flashes = req.flash();
  res.locals.user = req.user || null;
  res.locals.currentPath = req.path;
  next();
});


// promisify some callback based APIs
app.use((req, res, next) => {
  req.login = promisify(req.login, req);
  next();
});

// view engine setup
app.set('views', [__dirname + '/views',__dirname + '/views/navigation',__dirname + '/views/content',__dirname + '/views/footer',__dirname + '/views/mixins']);
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));
// 



////////////// THIS IS WHERE WE ARE SETTING PATHS ///////////////////////////
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// One of our error handlers will see if these errors are just validation errors
app.use(errorHandlers.flashValidationErrors);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);


module.exports = app;
