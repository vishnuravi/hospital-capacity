'use strict';
require('dotenv').config();

// eslint-disable-next-line import/no-unresolved
const express = require('express');
const sequelize = require('./database/connect');

const app = express();

// DB connection
require("./database/connect");
var initModels = require("./models/init-models");
var models = initModels(sequelize);

// Routes
app.get('/', (req, res) => {
  res.send('Hospital Capacity Tracker API')
});

// Find hospitals by FIPS code
app.get('/hospitals/fips_code/:fips_code', async (req, res) => {
  const result = await models.CapacityData.findAll({ where: { fips_code: req.params.fips_code } });
  res.send(result);
})

// Error handler
app.use((err, req, res) => {
  console.error(err);
  res.status(500).send('Internal Serverless Error');
});

module.exports = app;
