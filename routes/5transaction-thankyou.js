var express = require('express');
var sendgrid  = require('sendgrid')(process.env.SG_API_KEY_ID);

var router = express.Router();

router.get('/', function(req, res, next) {

  // If session lost, redirect to the main page
  if(!req.session.ammount) {
    return res.redirect('/');
  }

  var email = new sendgrid.Email();

  email.addTo(process.env.GEN_EMAIL);
  email.setFrom('sabina@gatti.pl');
  email.setSubject('Pieniądze doszły');
  email.setText('.');

  email.setFilters({"templates": {"settings": {"enabled": 1, "template_id": "fd062812-8259-4816-bd88-611d08f19aa2"}}});
  email.addSubstitution(':name:', req.session.customername);
  email.addSubstitution(':ammount:', req.session.ammount);

  sendgrid.send(email, function(err, json) {

    if (err) { return console.error(err); }
    console.log(json);

  });

  req.session.destroy();

  res.render('index', {
    partials: {
      header: 'partials/header',
      navbar: 'partials/navbar',
      carousel: 'partials/empty',
      body: 'transaction-thankyou',
      footer: 'partials/footer'
    }
  });

});

module.exports = router;
