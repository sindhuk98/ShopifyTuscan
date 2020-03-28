const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'planetpegasi@gmail.com',
           pass: 'Mars2088!'
       }
   });

   const mailOptions = {
    from: 'planetpegasi@gmail.com', // sender address
    to: 'planetpegasi@gmail.com',//shangrilafashions@gmail.com', // list of receivers
    subject: 'TuscanApp Products/Variants Updates' // Subject line
    //html: '<p>YaY Planet Pegasi You guys Rock</p>'// plain text body
  };

  const sendEmail = (mailOptions) => {
    transporter.sendMail(mailOptions, function (err, info) {
      if(err)
        console.log(err)
      else
        console.log(info);
   });
  }

  module.exports = {
    sendEmail:sendEmail,
    mailOptions: mailOptions
  };
 