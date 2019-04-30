var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var router = express.Router();
const fs = require("fs");
const http = require("http");

//database
mongoose.connect('mongodb://localhost/scientia', { useNewUrlParser: true });
var db = mongoose.connection;

//routes
var routes = require('./routes/index');
var users = require('./routes/users');
var uauth = require('./routes/userauthentication');
var admauth = require('./routes/adminauthentication');

// Init App
var app = express();
//error 404

// View Engine
//Default view directory
app.set('views', path.join(__dirname, 'views'));
//default layout
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: false,
    resave: false
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user;
  res.locals.admin = req.admin;
  next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/userauthentication', uauth);
app.use('/adminauthentication', admauth);

app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('error', { url: req.url, title: 'Error 404 | Scientia' });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});



// Set Port
var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log('Server started on port '+ port);
});