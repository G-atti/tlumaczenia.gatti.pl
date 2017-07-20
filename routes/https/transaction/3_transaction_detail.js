let express = require('express');
let braintree = require("braintree");

let router = express.Router();

let gateway = braintree.connect({
	environment:  braintree.Environment.Production,
	merchantId:   process.env.BT_MERCHANT_ID,
	publicKey:    process.env.BT_PUBLIC_KEY,
	privateKey:   process.env.BT_PRIVATE_KEY
});

//
//  Show a page with all the detail of the order
//
router.use('/', function(req, res, next) {

	//
	//  1.  Create a date object
	//
	let date  = new Date()

	//
	//  2.  Get the year of the actual date
	//
	let year = date.getFullYear();

	//
	//	1.	Call Brain tree not sure what for
	//
	gateway.clientToken.generate({}, function (err, response) {

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
				body: 'transaction/detail'
			}
		});

	});

});

module.exports = router;
