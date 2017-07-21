let express = require('express');
let sendgrid  = require('sendgrid')(process.env.SG_API_KEY_ID);

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
	email.setFilters({"templates": {"settings": {"enabled": 1, "template_id": "fd062812-8259-4816-bd88-611d08f19aa2"}}});
	email.addSubstitution(':name:', req.session.customername);
	email.addSubstitution(':ammount:', req.session.ammount);

	//
	//	4.	Send the actual email
	//
	sendgrid.send(email, function(err, json) {

		//
		//	Make sure there was no error
		//
		if(err)
		{
			return console.error(err);
		}

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
				body: 'transaction/thankyou'
			}
		});

	});

});

module.exports = router;
