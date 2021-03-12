const request = require('supertest');
const Task = require('../src/models/task');
const { userOne, userTwo, taskOne, setupDatabase } = require('./fixtures/db');
const express = require('express');
const loaders = require('../src/loaders');

const app = express();

beforeAll(async (done) => {
  await loaders({ expressApp: app });
  done()
})


beforeEach(setupDatabase);

test('Should create task for user', async () => {
  const response = await request(app)
    .post('/api/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: 'From My tests',
    })
    .expect(201);

  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
});

test('Should fetch tasks for user', async () => {
  const response = await request(app)
    .get('/api/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body).toHaveLength(2);
});

test('Should NOT Delete tasks of another user', async () => {
  await request(app)
    .delete(`/api/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);
  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});
