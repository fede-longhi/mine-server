const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
require("custom-env").env("pmm");
const cors = require('cors');

const distance = require('google-distance-matrix');
distance.key(process.env.GOOGLE_API_KEY);
distance.mode('driving');

const app = express();

//Enable Alls CORS Request
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./server/routes')(app);
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the beginning of nothingness.',
}));

module.exports = app;