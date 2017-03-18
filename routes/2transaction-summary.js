var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {

  // refresh TTL for the session
  req.session.cookie.maxAge = new Date(Date.now() + 60000);

  // Checkign if the price is a number and is aviable
  if (!req.body.money || (isNaN(req.body.money) && req.body.money.toString().indexOf('.') == -1)) {

    req.session.errors = errorMessage = new Array({msg: 'Podaj liczbę.'});

    return res.redirect('/przelew/suma');
  }

  var tmpAmmount = req.session.ammount = parseFloat(req.body.money);
  var tmpTax = tmpAmmount * (23 / 100);
  var tmpTotal = req.session.total = (tmpTax + tmpAmmount).toFixed(2);

  // If session lost, redirect to the main page
  if(!req.session.ammount) {
    res.redirect('/');
  }

  res.render('index', {
    money: tmpAmmount,
    tax: tmpTax.toFixed(2),
    total: tmpTotal,
    partials: {
      header: 'partials/header',
      navbar: 'partials/navbar',
      carousel: 'partials/empty',
      body: 'transaction-summary',
      footer: 'partials/footer'
    }
  });

});

module.exports = router;
