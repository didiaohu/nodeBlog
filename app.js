var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var settings = require('./settings');
var flash = require('connect-flash');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var multer = require('multer');

var fs = require('fs');
var accessLog = fs.createWriteStream('access.log', {flags: 'a'});
var errorLog = fs.createWriteStream('error.log', {flags:'a'});
var app = express();
var passport = require('passport'),
    GithubStrategy = require('passport-github').Strategy;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(multer({
  dest: './public/images',
  rename: function(fieldname, filename){
    return filename;
  }
}));
app.use(logger('dev'));
app.use(logger({stream: accessLog}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(err, req, res, next){
  var meta = '[' + new Date() + ']' + req.url + '\n';
  errorLog.write(meta + err.stack + '\n');
  next();
});

app.use(session({
  secret: settings.cookieSecret,
  key: settings.db,
  cookie: {maxAge: 1000 * 60 * 60 *24 *30},
  store: new MongoStore({
    url:'mongodb://localhost:27017/MongoDB'
  })
}));
app.use(flash());
//设置flash  
app.use(function(req, res, next){  
  res.locals.error = req.flash('error') || "";  
  res.locals.success = req.flash('success') || "";  
  next();  
});
app.use(passport.initialize());  
routes(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// set flash
// app.use(function (req, res, next) {
//   res.locals.errors = req.flash('error');
//   res.locals.infos = req.flash('info');
//   next();
// });

passport.use(new GithubStrategy({
  clientID: '6e315af5e19099f81beb',
  clientSecret: 'efea1863ec53e65ffb94632badb55817ff4007e2',
  callbackURL:'http://192.168.1.101:3000/login/github/callback'
}, function(accessToken, refreshToken, profile, done){
  done(null, profile);
}
));

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
