let cookie = new (require(process.cwd() + '/helpers/cookie'));
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
//	Actually take the card data and use it to charge the user
//
router.post("/:total", function (req, res, next) {

	//
	//	1.	Transaction options
	//
	let options = {
		amount: req.params.total / 100,
		paymentMethodNonce: req.body.payment_method_nonce
	}

	//
	//	2.	Charge the user
	//
	gateway.transaction.sale(options, function(error, result) {

		//
		//	1.	Make sure there was no error
		//
		if(error)
		{
			//
			//	1.	Create a error for the user
			//
			let errors = {
				msg: 'Błąd zewnętrzny.'
			}

			//
			//	2.	Save the error as a cookie
			//
			res.cookie('errors', errors, cookie.settings());

			//
			//	->	Redirect the user back to the previous page
			//
			return res.redirect('back');
		}

		//
		//	2.	Make sure the transaction worked
		//
		if(Boolean(result.success) == false)
		{
			//console.log(result.errors.errorCollections.transaction.validationErrors);

			//
			//	1.	Create a error for the user
			//
			let errors = {
				msg: 'Dane karty są nieprawidłowe.'
			}

			//
			//	2.	Save the error as a cookie
			//
			res.cookie('errors', errors, cookie.settings());

			//
			//	->	Redirect the user back to the previous page
			//
			return res.redirect('back');
		}

		//
		//	3.	Save Customer name to say thank to him or her
		//
		let name = result.transaction.creditCard.cardholderName;

		//
		//	->	Show the thank you page
		//
		return res.redirect('/przelew/dziekuje');

	});

});

module.exports = router;
