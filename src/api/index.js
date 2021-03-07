const { Router } = require('express');
const user = require('./routes/user.js');
const task = require('./routes/task.js');

const routes = () => {
    const app = Router();
    user(app);
    task(app);

	return app
}

module.exports = routes