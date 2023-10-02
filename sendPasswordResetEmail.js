const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: 'ajay.s.naviee@gmail.com', 
    pass: 'zvxw gwsh thbt htlc', 
  },
});


const sendPasswordResetEmail = (toEmail, resetToken) => {
  const mailOptions = {
    from: 'ajay.s.naviee@gmail.com', 
    to: toEmail, 
    subject: 'Password Reset',
    html: `<p>Click the following link to reset your password: <a href="http://localhost:3000/reset-password/${resetToken}">Reset Password</a></p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

module.exports = sendPasswordResetEmail;
