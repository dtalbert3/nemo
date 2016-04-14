var nodemailer = require('nodemailer');
var config = require('getconfig');

/*
var data = fs.readFileSync('./emailConfirmerConfig.json'),
	emailConfirmerOptions;


try {
	emailConfirmerOptions = JSON.parse(data);
} catch (err) {
	console.log('There has been an error parsing your JSON.');
	console.log(err);
	process.exit();
}

var data = fs.readFileSync('../web-app/config/dev.json'),
	nemoOptions;

try {
	nemoOptions = JSON.parse(data);
} catch (err) {
	console.log('There has been an error parsing your JSON.');
	console.log(err);
	process.exit();
}
*/
//var hostUrl = 'codyemoffitt.com';


function sendEmailConfirmation(data, callback) {
	console.log("inside conf");
	senderUsername = config.nemoConfirmationEmail.userName; 
	senderPassword = config.nemoConfirmationEmail.password;
	console.log("Sender: " + senderUsername);
	console.log("pass: " + senderPassword);
	var transporter = nodemailer.createTransport('smtps://' 
		+ senderUsername
		+ '%40gmail.com:' 
		+ senderPassword
		+ '@smtp.gmail.com');

	// setup e-mail data with unicode symbols
	//console.log ('"No Reply" <' + senderUsername + '@gmail.com>');
	//console.log (senderPassword);
	var mailOptions = {
			from: '"No Reply" <' + senderUsername + '@gmail.com>',
			to: data.receiverEmail,
			subject: 'NEMO confirmation',
			// Message body of the automated email
			text: data.name + ', \nWelcome to NEMO! An account has been'
						+ ' created for you and must now be activated. Please '
						+ 'click on the link below to verify your email and complete the signup process:'
						+ '\n \n' + 'http://' + config.server.db.host + '/' + data.confirmationHash
			
			// HTML message to be delivered to the user
			/*html: '<!DOCTYPE html><body><b> ' + data.name + ', </b> <br>'
						+ '<b> Welcome to NEMO! An account has been created for you and must now be activated.'
						+ ' Please click on the link below to complete the signup process.</b> <br> <br>'
						+	'<a href="' + hostUrl + '/' + data.confirmationHash + '">Activate your account Here</a> </body></html>' */
	};
	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			console.log("There was an error when sending the confirmation email");
			console.log(error);
			return callback("There was an error when sending the confirmation email" + error, null)
		}
		console.log('Message sent: ' + info.response);
	});
};

/*
var data = {
	confirmationHash: '123abc',
	receiverEmail: 'oopayne42@students.tntech.edu',
	name: 'Oliver'
};
*/

//sendEmailConfirmation( data, null);
