var nodemailer = require('nodemailer');

var data = fs.readFileSync('./emailConfirmerConfig.json'),
	emailConfirmerOptions;

try {
	emailConfirmerOptions = JSON.parse(data);
} catch (err) {
	console.log('There has been an error parsing your JSON.');
	console.log(err);
	process.exit();
}

var sendEmailConfirmation = function(hash, receiverUsername, callBackFunction) {
	senderUsername = emailConfirmerOptions.nemoConfirmationEmail.userName  
	senderPassword = emailConfirmerOptions.nemoConfirmationEmail.password 
	var transporter = nodemailer.createTransport('smtps://' 
		+ senderUsername
		+ '%40gmail.com:' 
		+ senderPassword
		+ '@smtp.gmail.com');

	// setup e-mail data with unicode symbols
	var mailOptions = {
			from: '"No Reply" <' + senderUsername + '@gmail.com>',
			to: receiverUsername,
			subject: 'NEMO confirmation',
			text: 'Your account has been created bra',
			// FIXME Need to put in the correct URL link to confirm account:
			html: '<b>Your account has been created and must now be activated.</b> <br> \
							<b> Please click on the link below to confirm your account.</b> <br> \
							<b> ... INSERT LINK HERE .... </b>'
	};
	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			console.log("There was an error when sending the confirmation email");
			return console.log(error);
		}
		console.log('Message sent: ' + info.response);
	});
};
	
