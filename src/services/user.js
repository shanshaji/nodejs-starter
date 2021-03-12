const eventEmitter = require('../subscribers/eventEmitter');
const User = require('../models/user');

const signUp = async (userParams) => {
  const user = new User(userParams);
  await user.save();
  eventEmitter.emit('user_signup', user)
  const token = await user.generateAuthToken();
  return { user, token };
};

const deleteUser = async (user) => {
  await user.remove();
  eventEmitter.emit('user_deleted', user)
};

module.exports = { signUp, deleteUser };