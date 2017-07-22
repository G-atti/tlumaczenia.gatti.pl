
let express = require('express');

let router = express.Router();

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
		title: "Tłumacz przysięgły włoskiego",
		description: "Tłumaczenia Pisemne, Tłumaczenia Ustne i Doradca Międzynarodowy",
		og_image: "https://" + req.hostname + "/images/og/index.png",
		url: "https://" + req.hostname,
		partials: {
			body: 'home'
		}
	});

});

module.exports = router;
