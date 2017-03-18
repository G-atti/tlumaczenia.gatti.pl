var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', {
    partials: {
      header: 'partials/header',
      navbar: 'partials/navbar',
      carousel: 'partials/empty',
      body: 'transaction-welcome',
      footer: 'partials/footer'
    }
  });

});

module.exports = router;
