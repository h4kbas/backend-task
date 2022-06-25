const request = require('supertest');
const expect = require('chai').expect;
const express = require('express');

const app = require('../src/app');

const seed = require('../util/seed');


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

describe('POST /jobs/:job_id/pay', function() {

  // Since it changes data, we gotta reset the database to check for other cases
  beforeEach(async () => {
    await seed();
  })
  afterEach(async () => {
    await seed();
  })
  it('should give an 404 error if the job does not exists', function(done) {
    request(app)
      .post('/jobs/999/pay')
      .set('profile_id', '1')
      .expect(404, done);
  });

  it('should give an 400 error if the client tries to pay the job of others', function(done) {
    request(app)
      .post('/jobs/3/pay')
      .set('profile_id', '1')
      .expect(400, done);
  });

  it('should do the transfer successfuly if the client has the job, has the money and the job is not paid', function(done) {
    request(app)
      .post('/jobs/2/pay')
      .set('profile_id', '1')
      .expect(200, done);
  });
});

