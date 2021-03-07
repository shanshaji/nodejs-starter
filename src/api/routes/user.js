const { Router } = require('express');
const router = Router();
const User = require('../../models/user');
const middlewares = require('../middleware');
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeEmail, sendCancellationEmail } = require('../../services/email');

module.exports = (app) => {
  app.use('/users', router);

  router.get('/me', middlewares.isAuth, middlewares.attachCurrentUser, async (req, res) => {
    res.send(req.user);
  });

  router.post('/', async (req, res) => {
    const user = new User(req.body);

    try {
      await user.save();
      sendWelcomeEmail(user.email, user.name);
      const token = await user.generateAuthToken();
      res.status(201).send({ user, token });
    } catch (e) {
      res.status(400).send(e);
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

      // cant use because schema wont work
      // const user = await User.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true })

      if (!user) {
        return res.status(404).send();
      }
      res.send(user);
    } catch (e) {
      res.status(500).send();
    }
  });

  router.delete('/me', middlewares.isAuth, middlewares.attachCurrentUser, async (req, res) => {
    try {
      await req.user.remove();
      sendCancellationEmail(req.user.email, req.user.name);
      res.send(req.user);
    } catch (e) {
      res.status(500).send();
    }
  });

  const upload = multer({
    limits: {
      fileSize: 10000000,
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        cb(new Error('File Must be image'));
      }
      cb(undefined, true);
      // cb(new Error('File Must be PDF')) // throw error
      // cb(undefined, true) //accept the file
      // cb(undefined, false) //reject the file
    },
  });
  router.post(
    '/me/avatar',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    upload.single('avatar'),
    async (req, res) => {
      const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
      req.user.avatar = buffer;
      await req.user.save();
      res.send('Avatar uploaded');
    },
    (error, req, res, next) => {
      res.status(400).send({ error: error.message });
    }
  );

  router.delete('/me/avatar', middlewares.isAuth, middlewares.attachCurrentUser, async (req, res) => {
    try {
      req.user.avatar = undefined;
      await req.user.save();
      res.send('avatar deleted');
    } catch (e) {
      res.status(500).send();
    }
  });

  router.get('/:id/avatar', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user || !user.avatar) {
        throw new Error();
      }
      res.set('Content-type', 'image/png');
      res.send(user.avatar);
    } catch (e) {
      res.status(404).send;
    }
  });
};
