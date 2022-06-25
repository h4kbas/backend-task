const request = require('supertest');
const expect = require('chai').expect;

const app = require('../src/app');

describe('GET /jobs/unpaid', function() {
  it('returns all unpaid  and still active jobs belonging to the profile with json successfuly', async function() {
    const  res = await request(app)
      .get('/jobs/unpaid')
      .set('profile_id', '1')
      .expect('Content-Type', /json/)
      .expect(200);

      expect(res.body.length).to.be.equal(1)
  });
});