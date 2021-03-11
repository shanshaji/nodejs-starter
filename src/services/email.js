const sgMail = require('@sendgrid/mail');
const logger = require('../loaders/logger');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  const msg = {
    to: email,
    from: process.env.VERIFIED_SENDER, // Change to your verified sender
    subject: 'Welcome to task manager',
    text: `Thank you for joining ${name}`,
  };
  sendEmail(msg);
};

const sendCancellationEmail = (email, name) => {
  const msg = {
    to: email,
    from: process.env.VERIFIED_SENDER, // Change to your verified sender
    subject: 'Goodbye, so sad to see you go',
    text: `Bye Bye ${name}, goodbye`,
  };
  sendEmail(msg);
};

const sendEmail = async (content) => {
  try {
    await sgMail.send(content);
  } catch (e) {
    logger.error(`Error sending Email ${e.message}`);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail,
};
