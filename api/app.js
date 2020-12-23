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

app.get('/hospitals', async (req, res) => {
  const filters = {};
  if (req.query.zip) filters.zip = req.query.zip;
  if (req.query.state) filters.state = req.query.state
  if (req.query.fips_code) filters.fips_code = req.query.fips_code;
  if (req.query.city) filters.city = { [Op.like]: '%' + req.query.city + '%' }

  try {
    let result = await models.CapacityData.findAll({
      where: {
        ...filters,
        hospital_subtype: {
          [Op.or]: ['Short Term', 'Critical Access Hospital']
        }
      },
      order: [['hospital_name', 'ASC'], ['collection_week', 'DESC']]
    });

    if (result && req.query.latest_week) {
      // extract only the latest week's data
      result = result.filter((data, index, self) =>
        index === self.findIndex((row) => (row.hospital_pk === data.hospital_pk))
      );
    }

    res.send(result);

  } catch (error) {
    next(error);
  }

});

// Get all records for a hospital by id
app.get('/hospitals/:hospital_pk', async (req, res) => {

  try {
    let result;
    if (req.query.latest_week) {
      result = await models.CapacityData.findOne({ where: { hospital_pk: req.params.hospital_pk }, order: [['collection_week', 'ASC']] });
    } else {
      result = await models.CapacityData.findAll({ where: { hospital_pk: req.params.hospital_pk }, order: [['collection_week', 'ASC']] });
    }
    res.send(result);
  } catch (error) {
    next(error);
  }
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
