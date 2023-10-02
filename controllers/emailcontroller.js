const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'ajay.s.naviee@gmail.com', 
    pass: 'zvxw gwsh thbt htlc', 
  },
});

const sendActivationEmail = async (recipientEmail, activationLink) => {
  const mailOptions = {
    from: 'ajay.s.naviee@gmail.com', 
    to: recipientEmail,
    subject: 'Activate Your Account',
    text: `Click the following link to activate your account its enough and after that place the token: ${activationLink}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Activation email sent');
  } catch (error) {
    console.error('Error sending activation email:', error);
  }
};

module.exports = { sendActivationEmail };
