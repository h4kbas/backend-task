const request = require('supertest');
const expect = require('chai').expect;
const app = require('../src/app');

describe('GET /contracts/:id', function() {
  it('returns with json successfuly if the contract belongs to the profile', function(done) {
    request(app)
      .get('/contracts/1')
      .set('profile_id', '1')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('returns with 404 error if the contract does not belong to the profile', function(done) {
    request(app)
      .get('/contracts/3')
      .set('profile_id', '1')
      .expect(404, done);
  });
});


describe('GET /contracts', function() {
  it('returns all contracts belonging to the profile with json successfuly', async function() {
    const res = await request(app)
      .get('/contracts')
      .set('profile_id', '2')
      .expect('Content-Type', /json/)
      .expect(200);
    
      expect(res.body.length).to.be.equal(2)
  });
});

