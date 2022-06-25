const request = require('supertest');
const expect = require('chai').expect;
const express = require('express');

const app = require('../src/app');

const seed = require('../util/seed');


describe('GET /admin/best-profession?start=<date>&end=<date>', function() {
  it('returns the most paid profession together with the amount', async function() {
    const  res = await request(app)
      .get('/admin/best-profession?start=2020-08-14&end=2020-08-15')
      .set('profile_id', '1')
      .expect('Content-Type', /json/)
      .expect(200);

      expect(res.body).to.deep.equal({
        "profession": "Programmer",
        "total": 121
    })
  });
});

describe('GET /admin/best-clients?start=<date>&end=<date>', function() {
  it('returns the most paid 2 clients (if available) with their fullNames', async function() {
    const  res = await request(app)
      .get('/admin/best-clients?start=2015-08-14&end=2020-08-15')
      .set('profile_id', '1')
      .expect('Content-Type', /json/)
      .expect(200);

      expect(res.body.length).to.be.equal(2);
  });

  it('returns the most paid 4 clients (if available) with their fullNames', async function() {
    const  res = await request(app)
      .get('/admin/best-clients?start=2010-08-14&end=2025-08-15&limit=4')
      .set('profile_id', '1')
      .expect('Content-Type', /json/)
      .expect(200);

      expect(res.body.length).to.be.equal(4);
  });
});
