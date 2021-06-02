'use strict';
require('dotenv').config();

// eslint-disable-next-line import/no-unresolved
const express = require('express');
const sequelize = require('./database/connect');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const passport = require("passport");
const HeaderAPIKeyStrategy = require('passport-headerapikey').HeaderAPIKeyStrategy

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

// Passport
passport.use(new HeaderAPIKeyStrategy(
  { header: 'Authorization', prefix: 'Api-Key ' },
  false,
  function (apikey, done) {
    if (apikey === process.env.API_KEY) {
      return done(null, true);
    } else {
      return done(null, false);
    }
  })
);

// Routes
app.get('/', (req, res) => {
  res.send('Hospital Capacity Tracker API');
});

app.get('/unauthorized', (req, res) => {
  res.send(401, 'Invalid API Key');
})

app.get('/hospitals',
  passport.authenticate('headerapikey', { session: false, failureRedirect: '/unauthorized' }),
  async (req, res, next) => {
    const filters = {};
    if (req.query.zip) filters.zip = req.query.zip;
    if (req.query.state) filters.state = req.query.state
    if (req.query.fips_code) filters.fips_code = req.query.fips_code;
    if (req.query.city) filters.city = { [Op.like]: '%' + req.query.city + '%' }

    const pagination = {};
    if (req.query.limit) pagination.limit = parseInt(req.query.limit);
    if (req.query.offset) pagination.offset = parseInt(req.query.offset);

    try {
      let result = await models.CapacityData.findAll({
        where: {
          ...filters,
          hospital_subtype: {
            [Op.or]: ['Short Term', 'Critical Access Hospital']
          }
        },
        order: [['hospital_name', 'ASC'], ['collection_week', 'DESC']],
        ...pagination
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
app.get('/hospitals/:hospital_pk',
  passport.authenticate('headerapikey', { session: false, failureRedirect: '/unauthorized' }),
  async (req, res, next) => {
    const pagination = {}
    if (req.query.limit) pagination.limit = parseInt(req.query.limit);
    if (req.query.offset) pagination.offset = parseInt(req.query.offset);

    try {
      let result;
      if (req.query.latest_week) {
        result = await models.CapacityData.findOne({
          where: {
            hospital_pk: req.params.hospital_pk
          },
          order: [['collection_week', 'ASC']],
          ...pagination
        });
      } else {
        result = await models.CapacityData.findAndCountAll({
          where: {
            hospital_pk: req.params.hospital_pk
          },
          order: [['collection_week', 'DESC']],
          ...pagination
        });
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
  res.send(500, { error: err.message });
});

module.exports = app;
