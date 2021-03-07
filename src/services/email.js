const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  const msg = {
    to: email,
    from: '11bc089@skcet.ac.in', // Change to your verified sender
    subject: 'Welcome to task manager',
    text: `Thank you for joining ${name}`,
  };
  sgMail.send(msg);
};

const sendCancellationEmail = (email, name) => {
  const msg = {
    to: email,
    from: '11bc089@skcet.ac.in', // Change to your verified sender
    subject: 'Goodbye, so sad to see you go',
    text: `Bye Bye ${name}, goodbye`,
  };
  sgMail.send(msg);
};

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail,
};
