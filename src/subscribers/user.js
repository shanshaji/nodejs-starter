const eventEmitter = require('../subscribers/eventEmitter');
const { sendWelcomeEmail, sendCancellationEmail } = require('../services/email');

eventEmitter.on('user_signup', async (user) => {
    sendWelcomeEmail(user.email, user.name);
})

eventEmitter.on('user_deleted', async (user) => {
    sendCancellationEmail(user.email, user.name);
})
