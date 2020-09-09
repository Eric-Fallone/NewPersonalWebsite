var nodemailer = require('nodemailer');
var discord = require('../notifications/discord.js')
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ERIC_EMAIL_ACCOUNT,
    pass: process.env.ERIC_EMAIL_PASSWORD
  }
});

module.exports={
  sendEmail :function(emailData) {

    var mailOptions = {
      from: process.env.ERIC_EMAIL_ACCOUNT,
      to: process.env.ERIC_EMAIL_ACCOUNT,
      subject:emailData.name+" from "+ emailData.company,
      text: emailData.name + "\n\n"+emailData.company + "\n\n"+emailData.email + "\n\n" + emailData.telephone + "\n\n"+emailData.message
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        discord.webHook(emailData.name+" from "+ emailData.company+" has send you an email.");
      }
    });
  }
}
