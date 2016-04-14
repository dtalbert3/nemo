var nodemailer = require('nodemailer');

// The email is sent from a gmail account: nemo.confirmation@gmail.com
//																password: nemoconfirm

// create transporter object using the default SMTP transport
// The transporter object authenticates the gmail account
var transporter = nodemailer.createTransport('smtps://nemo.confirmation%40gmail.com:nemoconfirm@smtp.gmail.com');

// setup e-mail data with unicode symbols
var mailOptions = {
    from: '"No Reply ￼" <nemo.confirmation@gmail.com>', // sender address
		to: 'oopayne42@students.tntech.edu', // list of receivers
		subject: 'NEMO confirmation', // Subject line
		text: 'Your account has been created bra', // plaintext body
		html: '<b>Hello world ￼</b>' // html body
};
// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});
