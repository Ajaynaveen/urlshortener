const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // Use Gmail as the email service
  auth: {
    user: 'ajay.s.naviee@gmail.com', // Your Gmail email address
    pass: 'zvxw gwsh thbt htlc', // Your Gmail password
  },
});

const sendActivationEmail = async (recipientEmail, activationLink) => {
  const mailOptions = {
    from: 'ajay.s.naviee@gmail.com', // Your Gmail email address
    to: recipientEmail,
    subject: 'Activate Your Account',
    text: `Click the following link to activate your account: ${activationLink}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Activation email sent');
  } catch (error) {
    console.error('Error sending activation email:', error);
  }
};

module.exports = { sendActivationEmail };
