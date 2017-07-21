let cookie = new (require(process.cwd() + '/helpers/cookie'));
let express = require('express');
let braintree = require("braintree");

let router = express.Router();

let gateway = braintree.connect({
	environment:  braintree.Environment.Sandbox,
	merchantId:   process.env.BT_MERCHANT_ID,
	publicKey:    process.env.BT_PUBLIC_KEY,
	privateKey:   process.env.BT_PRIVATE_KEY
});

//
//  Show a page with all the detail of the order
//
router.use('/:total', function(req, res, next) {

	//
	//  1.  Create a date object
	//
	let date  = new Date()

	//
	//  2.  Get the year of the actual date
	//
	let year = date.getFullYear();

	//
	//	3.	Get the total of the transaction to be displayed when paying
	//
	let human_total = req.params.total / 100;

	//
	//	4.	Have a positive integer
	//
	let cpu_total = req.params.total;

	//
	//	5.	Set the data in the past so we can delete the cookie from the
	//		browser
	//
	let cookie_options = {
		expires:  new Date(0)
	}

	//
	//	4.	Call Brain tree not sure what for
	//
	gateway.clientToken.generate({}, function (err, response) {

		//
		//  ->  Render the HTML page
		//
		res
		.cookie("errors", "", cookie.settings(cookie_options))
		.render("_frame", {
			year: year,
			human_total: human_total,
			cpu_total: cpu_total,
			title: "Home",
			client_token: response.clientToken,
			description: "Home Page",
			og_image: "https://" + req.hostname + "/images/og/index.png",
			url: "https://" + req.hostname,
			errors: req.cookies.errors || false,
			partials: {
				body: 'transaction/card'
			}
		});

	});

});

module.exports = router;
