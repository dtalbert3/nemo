var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');

// setup e-mail data with unicode symbols
var mailOptions = {
    from: '"No Reply ￼" <no-reply@nemo.com>', // sender address
		to: 'oopayne42@students.tntech.edu', // list of receivers
		subject: 'Hello ￼', // Subject line
		text: 'Hello world ￼', // plaintext body
		html: '<b>Hello world ￼</b>' // html body
};
// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});
