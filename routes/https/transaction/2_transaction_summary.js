let cookie = new (require(process.cwd() + '/helpers/cookie'));
let express = require('express');

let router = express.Router();

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
	//	3.	Treat the number as float always
	//
	let money = parseFloat(req.body.money);

	//
	//  4.  Check if the price is a number and is available
	//
	if(isNaN(money))
	{
		//
		//	1.	Create a error for the user
		//
		let error = {
			msg: 'Podaj liczbę.'
		}

		//
		//	2.	Set the error as cookie
		//
		res.cookie('errors', error, cookie.settings());

		//
		//	->	Redirect the user back to the previous page
		//
		return res.redirect('/przelew/suma');
	}

	//
	//	5.	Convert the float in to a positive integer so we can manipulate the
	//		price without loosing precision
	//
	let cpu_money = money * 100;

	//
	//	6.	Calculate 23% taxes bases on the price entered by the user
	//
	let cpu_tax = cpu_money * (23 / 100);

	//
	//	7.	Add the tax to the price entered by the user and add .00 to the
	//		final price
	//
	let cpu_total = cpu_tax + cpu_money;

	//
	//	8.	Convert back the positive integer in to a floating point number
	//		readable to the human.
	//
	let human_total = cpu_total / 100;
	let human_tax = cpu_tax / 100;
	let human_money = cpu_money / 100;

	//
	//  ->  Render the HTML page
	//
	res.render("_frame", {
		money: human_money.toFixed(2),
		tax: human_tax.toFixed(2),
		total: human_total.toFixed(2),
		cpu_total: cpu_total,
		year: year,
		title: "Tłumacz przysięgły włoskiego - podsumowanie",
		description: "Tłumaczenia Pisemne, Tłumaczenia Ustne i Doradca Międzynarodowy",
		og_image: "https://" + req.hostname + "/images/og/index.png",
		url: "https://" + req.hostname,
		partials: {
			body: 'transaction/summary'
		}
	});

});

module.exports = router;
