const User = require('../models/user');
const { sendWelcomeEmail, sendCancellationEmail } = require('./email');

const signUp = async (userParams) => {
  const user = new User(userParams);
  await user.save();
  sendWelcomeEmail(user.email, user.name);
  const token = await user.generateAuthToken();
  return { user, token };
};

const deleteUser = async (user) => {
  await user.remove();
  sendCancellationEmail(user.email, user.name);
};

module.exports = { signUp, deleteUser };
