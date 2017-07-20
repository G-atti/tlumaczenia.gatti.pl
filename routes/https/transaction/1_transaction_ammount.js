let express = require('express');
let router = express.Router();

//
//	Show the transaction page
//
router.get('/', function(req, res, next) {

	//
	//  1.  Create a date object
	//
	let date  = new Date()

	//
	//  2.  Get the year of the actual date
	//
	let year = date.getFullYear();

	//
	//  ->  Render the HTML page
	//
	res.render("_frame", {
		year: year,
		title: "Home",
		description: "Home Page",
		og_image: "https://" + req.hostname + "/images/og/index.png",
		url: "https://" + req.hostname,
		partials: {
			body: 'transaction/amount'
		}
	});

});

module.exports = router;
