const request = require('supertest');
const expect = require('chai').expect;
const express = require('express');

const app = require('../src/app');
const seed = require('../util/seed');

describe('POST /balances/deposit/:userId', function() {

  beforeEach(async () => {
    await seed();
  })
  afterEach(async () => {
    await seed();
  })

  it('returns 401 error if the profile is not a client', function(done) {
    request(app)
      .post('/balances/deposit/8')
      .set('profile_id', '8')
      .send({amount:250})
      .expect(401, done);
  });

  it('returns error if the deposit amount exceeds the 25%', function(done) {
    request(app)
      .post('/balances/deposit/2')
      .set('profile_id', '2')
      .send({amount:900})
      .expect(400, done);
  });

  it('returns success if the deposit is accepted', function(done) {
    request(app)
      .post('/balances/deposit/2')
      .set('profile_id', '2')
      .send({amount:50})
      .expect(200, done);
  });
});



