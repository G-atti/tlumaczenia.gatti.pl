var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  var date  = new Date()
  var tmpYear = date.getFullYear();

  res.render('index', {
    year: tmpYear,
     partials: {
       header: 'partials/header',
       navbar: 'partials/navbar',
       carousel: 'partials/carousel',
       features: 'partials/features',
       video: 'partials/video',
       featuresdetailed: 'partials/featuresdetailed',
       contact: 'partials/contact',
       body: 'home',
       footer: 'partials/footer'
     }
   });

});

module.exports = router;
