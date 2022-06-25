const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')


// Configuration of the express app
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)


const {contracts, jobs, balances, admin} = require('./controller');

// Introducing routers to our app
app.use('/contracts',contracts);
app.use('/jobs', jobs);
app.use('/balances', balances);
app.use('/admin', admin);

module.exports = app;
