var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  // refresh TTL for the session
  req.session.cookie.maxAge = new Date(Date.now() + 60000);

  var tmpAmmount = req.session.ammount;
  var tmpErrors = req.session.errors;

  req.session.errors = null;

  console.log(req.session.cookie.maxAge);

  res.render('index', {
    ammount: tmpAmmount,
    errors: tmpErrors,
    partials: {
      header: 'partials/header',
      navbar: 'partials/navbar',
      carousel: 'partials/empty',
      body: 'transaction-ammount',
      footer: 'partials/footer'
    }
  });

});

module.exports = router;
