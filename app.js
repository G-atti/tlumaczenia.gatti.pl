require('newrelic');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var braintree = require("braintree");
var session = require('express-session');

var index = require('./routes/index');

var transactionWelcome = require('./routes/0transaction-welcome');
var transactionAmmount = require('./routes/1transaction-ammount');
var transactionSummary = require('./routes/2transaction-summary');
var transactionDetail = require('./routes/3transaction-detail');
var transactionProcesing = require('./routes/4transaction-procesing');
var transactionThankyou = require('./routes/5transaction-thankyou');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'lifeisfun',
  resave: true,
  saveUninitialized: true,
  cookie  : { maxAge  : new Date(Date.now() + 60000) }
}));

// Redirect old URL to the new one.
app.use(function(req, res, next) {

  var protocol = req.protocol;
  var host = req.get('host');
  var path = req.get('href');
  var newURL = 'tlumaczenia.gatti.pl';
  var urls = {name: 'sg.gatti.pl', name: 'www.sg.gatti.pl'};

  for(url in urls) {
    if(host == urls[url]) {

      if(isNaN(path)) { path = ''; }

      return res.redirect(301, protocol + '://' + newURL + path);
    }
  }

  return next();
});

app.use('/', index);
app.use('/przelew', transactionWelcome);
app.use('/przelew/suma', transactionAmmount);
app.use('/przelew/podsumowanie', transactionSummary);
app.use('/przelew/dane', transactionDetail);
app.use('/przelew/procesing', transactionProcesing);
app.use('/przelew/dziekuje', transactionThankyou);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.statusCode = 404,
  res.render('index', {
    partials: {
      header: 'partials/header',
      navbar: 'partials/navbar',
      carousel: 'partials/empty',
      body: 'error',
      footer: 'partials/footer'
    }
  });
});

module.exports = app;
