var express = require('express');
var braintree = require("braintree");
var _ = require('underscore');

var router = express.Router();

var gateway = braintree.connect({
  environment:  braintree.Environment.Production,
  merchantId:   process.env.BT_MERCHANT_ID,
  publicKey:    process.env.BT_PUBLIC_KEY,
  privateKey:   process.env.BT_PRIVATE_KEY
});

router.post("/", function (req, res, next) {

  // If session lost, redirect to the main page
  if(!req.session.ammount) {
    res.redirect('/');
  }

  var nonce = req.body.payment_method_nonce;;
  var tmpTotal = req.session.total;

  gateway.transaction.sale({
    amount: tmpTotal,
    paymentMethodNonce: nonce,
  }, function (err, result) {

    console.log(result);

    if(Boolean(result.success) == true) {

      req.session.customername = result.transaction.creditCard.cardholderName;
      res.redirect('/przelew/dziekuje');

    } else {

      console.log(result.errors.errorCollections.transaction.validationErrors);

      req.session.errors = errorMessage = new Array({msg: 'Dane karty są nieprawidłowe.'});

      res.redirect('back');
    }
  });
});

module.exports = router;
