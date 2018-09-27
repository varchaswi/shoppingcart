var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expresHbs = require('express-handlebars'); 
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var indexRouter = require('./routes/index');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);

var usersRouter = require('./routes/users');

var app = express();

var mongoDB = 'mongodb://super:1supers@ds153732.mlab.com:53732/testtutor';

mongoose.connect(mongoDB,{ useNewUrlParser: true });


mongoose.Promise = global.Promise;

//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

require('./config/passport');
// view engine setup
app.engine('.hbs',expresHbs({defaultLayout:'layout',extname:'.hbs'}));
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({ 
                  secret:'asecret',
                  resave:false,
                  saveUninitialized:false,
                  store: new MongoStore({
                    mongooseConnection:mongoose.connection,

                  }),
                  cookie:{maxAge:180*60*1000}
                }));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
})

app.use('/', indexRouter);
app.use('/user', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
