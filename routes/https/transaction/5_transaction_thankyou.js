let express = require('express');
let sendgrid  = require('sendgrid')(process.env.SG_API_KEY);

let router = express.Router();

//
//  Show the thank you page but also send an email to let my mother know
//  she received the payment.
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
	//	3.	Get the transaction information
	//
	let info = req.cookies.transaction;

	//
	//	1.	Create a new Sendgrid object
	//
	let email = new sendgrid.Email();

	//
	//	2.	Prepare the header of the message
	//
	email.addTo(process.env.EMAIL_TO);
	email.setFrom('sabina@gatti.pl');
	email.setSubject('Pieniądze doszły');
	email.setText('.');

	//
	//	3.	Select and add the right data to the template
	//
	email.setFilters({"templates": {"settings": {"enabled": 1, "template_id": "8f11e686-77dc-41b0-9c86-38110a603eaa"}}});
	email.addSubstitution(':name:', info.name);
	email.addSubstitution(':ammount:', info.cpu_total / 100);

	//
	//	4.	Send the actual email
	//
	sendgrid.send(email, function(err, json) {

		//
		//	Make sure there was no error
		//
		if(err)
		{
			console.error(err);

			return res.redirect('back');
		}

		//
		//  ->  Render the HTML page
		//
		res.render("_frame", {
			year: year,
			title: "Tłumacz przysięgły włoskiego - dziękuje",
			description: "Tłumaczenia Pisemne, Tłumaczenia Ustne i Doradca Międzynarodowy",
			og_image: "https://" + req.hostname + "/images/og/index.png",
			url: "https://" + req.hostname,
			partials: {
				body: 'transaction/thankyou'
			}
		});

	});

});

module.exports = router;
