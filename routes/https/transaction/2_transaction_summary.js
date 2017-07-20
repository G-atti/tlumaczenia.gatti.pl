var express = require('express');
var router = express.Router();

//
//  Process the data that was sent by the user
//
router.post('/', function(req, res, next) {

	//
	//  1.  Create a date object
	//
	let date  = new Date()

	//
	//  2.  Get the year of the actual date
	//
	let year = date.getFullYear();

	//
	//  1.  Check if the price is a number and is available
	//
	if(isNaN(parseInt(req.body.money)))
	{
		//
		//	1.	Create a error for the user
		//
		let error = {
			msg: 'Podaj liczbę.'
		}

		//
		//	->	Redirect the user back to the previous page
		//
		return res.redirect('/przelew/suma');
	}

	//
	//	2.	Convert the number in to a floating point
	//
	let money = parseFloat(req.body.money);

	//
	//	3.	Calculate 23% taxes bases on the price entered by the user
	//
	let tax = money * (23 / 100);

	//
	//	4.	Add the tax to the price entered by the user and add .00 to the
	//		final price
	//
	let total = (tax + money).toFixed(2);

	//
	//  ->  Render the HTML page
	//
	res.render("_frame", {
		year: year,
		money: money,
		tax: tax.toFixed(2),
		total: total,
		title: "Home",
		description: "Home Page",
		og_image: "https://" + req.hostname + "/images/og/index.png",
		url: "https://" + req.hostname,
		partials: {
			body: 'transaction/summary'
		}
	});

});

module.exports = router;
