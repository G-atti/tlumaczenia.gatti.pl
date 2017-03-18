var express = require('express');
var braintree = require("braintree");

var router = express.Router();

var gateway = braintree.connect({
  environment:  braintree.Environment.Production,
  merchantId:   process.env.BT_MERCHANT_ID,
  publicKey:    process.env.BT_PUBLIC_KEY,
  privateKey:   process.env.BT_PRIVATE_KEY
});

/* GET home page. */
router.use('/', function(req, res, next) {

  // refresh TTL for the session
  req.session.cookie.maxAge = new Date(Date.now() + 60000);

  // If session lost, redirect to the main page
  if(!req.session.total) {
    res.redirect('/');
  }

  var tmpTotal = req.session.total;
  var tmpErrors = req.session.errors;

  req.session.errors = null;

  gateway.clientToken.generate({}, function (err, response) {

    req.session.clientToken = response.clientToken;

    res.render('index', {
      clientToken: response.clientToken,
      total: tmpTotal,
      errors: tmpErrors,
      partials: {
        header: 'partials/header',
        navbar: 'partials/navbar',
        carousel: 'partials/empty',
        body: 'transaction-detail',
        footer: 'partials/footer'
      }
    });
  });

});

module.exports = router;
