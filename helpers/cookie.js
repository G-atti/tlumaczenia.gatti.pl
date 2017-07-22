////////////////////////////////////////////////////////////////////////////////
// __          __             _____    _   _   _____   _   _    _____		  //
// \ \        / /     /\     |  __ \  | \ | | |_   _| | \ | |  / ____|		  //
//  \ \  /\  / /     /  \    | |__) | |  \| |   | |   |  \| | | |  __		  //
//   \ \/  \/ /     / /\ \   |  _  /  | . ` |   | |   | . ` | | | |_ |		  //
//    \  /\  /     / ____ \  | | \ \  | |\  |  _| |_  | |\  | | |__| |		  //
//     \/  \/     /_/    \_\ |_|  \_\ |_| \_| |_____| |_| \_|  \_____|		  //
//																			  //
////////////////////////////////////////////////////////////////////////////////
//
//			This settings are related to our infrastructure security.
//
//				  NEVER EDIT this file without authorization
//
//     Changing this setting in the wrong way will compromise our security
//
////////////////////////////////////////////////////////////////////////////////

//
//	Q: 	WHY THIS IS A CLASS AND NOT A MODULE?
//
//	A: 	Because modules in NodeJS are singletons, meaning loading a module in
//		different places won't give you a unique set of data, but rather you
//		will share the same data, and if one file changes the data in the
//		module, this change will be reflected everywhere.
//
//		Since we need different data in different places, a class is the best
//		option. So when we create an object out of the class we get a copy
//		of the data.
//

//
//	1.	Import the URL module so we can extract easily the hostname
//
let url = require('url');

//
//	Constructor
//
function Cookie() {

	//
	// 	2.	Domain name for the cookie. Defaults to the domain name of the app.
	//
	this.domain = "tlumaczenia.gatti.loc";

	//
	//	3.	Flags the cookie to be accessible only by the web server. Meaning
	//		JavaScript inside the browser won't be able to get this cookie by
	//		invoking
	//
	//		document.cookie
	//
	//		Of course we hope the browser will do the right thing.
	//
	//		This option helps mitigate XSS
	//
	this.httpOnly = true;

	//
	//	4.	Path for the cookie. Defaults to “/” which means the cookie will be
	//		accessible in each route of the main domain.
	//
	//			EXAMPLE
	//
	//			example.com
	//			example.com/about
	//			example.com/article/title
	//
	this.path = "/";

	//
	//	5.	Marks the cookie to be used with HTTPS only. By default we allow
	//		it to be insecure for developer when they work on the code on
	//		their local machine.
	//
	//		The next IF statement will switch this back to true
	//
	this.secure = true;

	//
	//	6.	We don't sign our cookies, because we already use JWT which already
	//		signs the data before we wet it as a cookie. It is completely
	//		unnecessary to sign the data twice.
	//
	this.signed = false;

	//
	//	7.	Set the expiration data for the cookie so the user have to log in
	//		every so often.
	//
	//		Right now we have set the time to be 24h from now, so in theory
	//		once a day they have to log in in to the dashboard for security
	//		reason.
	//
	this.expires = 0;

	//
	//	8.	If the app is deployed anywhere else form our local machine, then
	//		we set the right cookies no mater what.
	//
	if(process.env.NODE_ENV != 'production')
	{
		//
		//	1.	Get the hostname of the server
		//
		let hostname = url.parse(process.env.BASE_URL).hostname;

		//
		//	2.	Split the string by dots, so we can get each sub-domain and
		//		remove the first element
		//
		let hostname_array = hostname.split(".");

		//
		//	3.	Remove the top element only if the domain is bigger then 2
		//		values.
		//
		//		We are interested to set the right domain for sub-domains. Root
		//		domains should stay untouched.
		//
		if(hostname_array.length > 2)
		{
			//
			//	1.	Remove the first element from the array
			//
			hostname_array.shift();
		}

		//
		//	4.	Recombine the array in to a string without the first element
		//
		let root_hostname = hostname_array.join(".");

		//
		//	5.	Set the wild card for the server domain
		//
		this.domain = "." + root_hostname;

		//
		//	6.	Make the cookie only settable if the connection is over TLS
		//		when the code is not anymore on the developer local machine.
		//
		this.secure = false;
	}

}

//
//	When you call this function with an option object, then you can over-right
//	the default settings
//
Cookie.prototype.settings = function(options) {

	//
	//	1.	The data to return based on the default settings
	//
	//		WARNING
	//
	//		If you change the expires time here to another one, make sure you
	//		do the same in the Auth project for the worker.
	//
	internal_options = {
		expires: new Date(Date.now() + 60 * 60 * 48 * 1000),
		httpOnly: this.httpOnly,
		domain: this.domain,
		path: this.path,
		secure: this.secure,
		signed: this.signed
	}

	//
	//	2.	Loop over the potential options and replace the internal once
	//		with the new ones.
	//
	for(let key in options)
	{
		internal_options[key] = options[key];
	}

	//
	//	->	Return back all the Cookie settings
	//
	return internal_options

};

module.exports = Cookie;
