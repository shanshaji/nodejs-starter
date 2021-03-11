const { Router } = require('express');
const router = Router();
const User = require('../../models/user');
const middlewares = require('../middleware');
const { signUp, deleteUser } = require('../../services/user');

module.exports = (app) => {
  app.use('/users', router);

  router.get('/me', middlewares.isAuth, middlewares.attachCurrentUser, async (req, res) => {
    res.send(req.user);
  });

  router.post('/', async (req, res, next) => {
    try {
      const { user, token } = await signUp(req.body, next);
      res.status(201).send({ user, token });
    } catch (e) {
      next(e);
    }
  });

  router.post('/login', async (req, res) => {
    try {
      const user = await User.findByCredentials(req.body.email, req.body.password);
      const token = await user.generateAuthToken();
      res.send({ user, token });
    } catch (e) {
      res.status(400).send();
    }
  });

  router.post('/logout', middlewares.isAuth, middlewares.attachCurrentUser, async (req, res) => {
    try {
      req.user.tokens = req.user.tokens.filter((token) => {
        return token.token !== req.token;
      });
      await req.user.save();
      res.send('logged out');
    } catch (e) {
      res.status(500).send();
    }
  });

  router.post('/logoutAll', middlewares.isAuth, middlewares.attachCurrentUser, async (req, res) => {
    try {
      req.user.tokens = [];
      await req.user.save();
      res.send('logged out from all');
    } catch (e) {
      res.status(500).send();
    }
  });

  router.patch('/me', middlewares.isAuth, middlewares.attachCurrentUser, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid Updates' });
    }
    try {
      const user = req.user;

      updates.forEach((update) => (user[update] = req.body[update]));

      await user.save();

      if (!user) {
        return res.status(404).send();
      }
      res.send(user);
    } catch (e) {
      res.status(500).send();
    }
  });

  router.delete('/me', middlewares.isAuth, middlewares.attachCurrentUser, async (req, res, next) => {
    try {
      await deleteUser(req.user);
      res.send(req.user);
    } catch (e) {
      next(e);
    }
  });
};
