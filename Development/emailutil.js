var nodemailer = require('nodemailer');

function send_mail(from, to , subject ,html){
	var transporter = nodemailer.createTransport("SMTP",{
		service: 'gmail',
		debug:true,
		auth: {
			user: 'privateinvestmentnetwork',
			pass: 'networkinvestmentprivate'
		}
	});
	var mailOptions = {
	        from: from,  
	        to: to,  
	        subject: subject, 
	        text: 'Hello world  ', // plaintext body
	        html: html 
	    };
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
        }
    });    
}
var exports = module.exports = {};
exports.send_mail = send_mail;
//var user = require("./emailutil.js");
var from="privateinvestmentnetwork@gmail.com"
var to="nishu.saxena@gmail.com"
var subject='test'
 

//send_mail("nishu.saxena@gmail.com", "riturajratan@gmail.com","code test","<b> Is code sent </b>")

send_mail(from, to,subject,"<b> Is code sent </b>")