let express = require('express');
let router = express.Router();

//
//	Show the welcome page of the transaction pagr
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
		title: "Tłumacz przysięgły włoskiego - przelew",
		description: "Tłumaczenia Pisemne, Tłumaczenia Ustne i Doradca Międzynarodowy",
		og_image: "https://" + req.hostname + "/images/og/index.png",
		url: "https://" + req.hostname,
		partials: {
			body: 'transaction/welcome'
		}
	});

});

module.exports = router;
