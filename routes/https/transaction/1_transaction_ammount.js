let cookie = new (require(process.cwd() + '/helpers/cookie'));
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
	//	3.	Set the data in the past so we can delete the cookie from the
	//		browser
	//
	let cookie_options = {
		expires:  new Date(0)
	}

	//
	//  ->  Render the HTML page
	//
	res
	.cookie("errors", "", cookie.settings(cookie_options))
	.render("_frame", {
		year: year,
		title: "Tłumacz przysięgły włoskiego - cena",
		description: "Tłumaczenia Pisemne, Tłumaczenia Ustne i Doradca Międzynarodowy",
		og_image: "https://" + req.hostname + "/images/og/index.png",
		url: "https://" + req.hostname,
		errors: req.cookies.errors || false,
		partials: {
			body: 'transaction/amount'
		}
	});

});

module.exports = router;
