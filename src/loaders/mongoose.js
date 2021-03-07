const mongoose = require('mongoose');

module.exports = async () => {
  const { connection } = await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
  return connection.db;
};
