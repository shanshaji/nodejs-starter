const request = require('supertest');
const { setupDatabase } = require('../fixtures/db');
const express = require('express');
const loaders = require('../../src/loaders');
const taskCrudTests = require("./task/taskCrud")
const userCrudTests = require("./user/userCrud")
const app = express();

beforeAll(async (done) => {
    await loaders({ expressApp: app });
    done();
});
beforeEach(setupDatabase);

test("Should connect app", async () => {
    await request(app)
      .get('/status')
      .send()
      .expect(200);
})
describe('Endpoints availability', () => {
    it('should return 404', async () => {
      const res = await request(app).get('/api/nonexisting').send()
      expect(res.status).toEqual(404)
    })
})

userCrudTests(app)
taskCrudTests(app)