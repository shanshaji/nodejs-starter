const request = require('supertest');
const User = require('../src/models/user');
const { userOne, userOneId, setupDatabase } = require('./fixtures/db');
const express = require('express');
const loaders = require('../src/loaders');
const app = express();

beforeAll(async (done) => {
  await loaders({ expressApp: app });
  done()
})
beforeEach(setupDatabase);
test('Should sign up a new user', async () => {
  const response = await request(app)
    .post('/api/users')
    .send({
      name: 'shan shaji',
      email: 'shanshaji@example.com',
      password: 'shanshaji',
    })
    .expect(201);

  //Assert that the database was changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  //Assertions about the response
  expect(response.body).toMatchObject({
    user: {
      name: 'shan shaji',
      email: 'shanshaji@example.com',
    },
    token: user.tokens[0].token,
  });

  // Assertions about password to be plain text
  expect(user.password).not.toBe('shanshaji');
});

test('Should login existing user', async () => {
  const response = await request(app)
    .post('/api/users/login')
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should Not login nonexisting user', async () => {
  await request(app)
    .post('/api/users/login')
    .send({
      email: userOne.email,
      password: 'incorrectp',
    })
    .expect(400);
});

test('Should get profile for user', async () => {
  await request(app).get('/api/users/me').set('Authorization', `Bearer ${userOne.tokens[0].token}`).send().expect(200);
});

test('Should Not get profile for unauthenticated user', async () => {
  await request(app).get('/api/users/me').send().expect(401);
});

test('Should Delete account for user', async () => {
  await request(app).delete('/api/users/me').set('Authorization', `Bearer ${userOne.tokens[0].token}`).send().expect(200);

  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test('Should NOT Delete account for unauthenticated user', async () => {
  await request(app).delete('/api/users/me').send().expect(401);
});

test('Should Update valid user fields', async () => {
  const name = 'rajappan';
  await request(app)
    .patch('/api/users/me/')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ name })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.name).toBe(name);
});

test('Should NOT Update Invalid user fields', async () => {
  await request(app)
    .patch('/api/users/me/')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ location: 'New York' })
    .expect(400);
});
