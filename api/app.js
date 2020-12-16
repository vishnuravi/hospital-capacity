'use strict';
require('dotenv').config();

// eslint-disable-next-line import/no-unresolved
const express = require('express');
const sequelize = require('./database/connect');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const app = express();

// DB connection
require("./database/connect");
var initModels = require("./models/init-models");
var models = initModels(sequelize);

// CORS Headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('x-powered-by', 'serverless-express');
  next();
});

// Routes
app.get('/', (req, res) => {
  res.send('Hospital Capacity Tracker API - Running')
});

// Get all records for a zip code
app.get('/hospitals/zip_code/:zip_code', async (req, res) => {
  const result = await models.CapacityData.findAll({ where: { zip: req.params.zip_code }, order: [['hospital_name', 'ASC'], ['collection_week', 'DESC']] });
  res.send(result);
});

// Get all records for a FIPS county code
app.get('/hospitals/fips_code/:fips_code', async (req, res) => {
  const result = await models.CapacityData.findAll({ where: { fips_code: req.params.fips_code }, order: [['hospital_name', 'ASC'], ['collection_week', 'DESC']] });
  res.send(result);
});

// Get all records for a city
app.get('/hospitals/city/:city', async (req, res) => {
  const result = await models.CapacityData.findAll({ where: { city: { [Op.like]: '%' + req.params.city + '%' } }, order: [['hospital_name', 'ASC'], ['collection_week', 'DESC']]});
  res.send(result);
});

// Get all records for a state
app.get('/hospitals/state/:state', async (req, res) => {
  const result = await models.CapacityData.findAll({ where: { state: req.params.state }, order: [['hospital_name', 'ASC'], ['collection_week', 'DESC']]});
  res.send(result);
});

// Get all records for a hospital by id
app.get('/hospitals/id/:id', async (req, res) => {
  const result = await models.CapacityData.findAll({ where: { hospital_pk: req.params.id }, order: [['collection_week', 'ASC']]});
  res.send(result);
});

// Get latest record for a hospital by id
app.get('/hospitals/id/latest/:id', async (req, res) => {
  const result = await models.CapacityData.findOne({ where: { hospital_pk: req.params.id }, order: [['collection_week', 'DESC']]});
  res.send(result);
});

// Error handler
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.render('error', { error: err });
});



module.exports = app;
