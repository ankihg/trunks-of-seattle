'use strict';

let express = require('express');
let app = express();
let publicRouter = express.Router();
let apiRouter = express.Router();
let models = require(__dirname + '/models');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let morgan = require('morgan');
let config = require(__dirname + '/config/env.js');
let client = require(__dirname + '/lib/wikiBot');

require(__dirname + '/routes/login-routes')(publicRouter, models);
require(__dirname + '/routes/neighborhoods-routes')(apiRouter, models);
require(__dirname + '/routes/species-routes')(apiRouter, models, client);
require(__dirname + '/routes/trees-routes')(apiRouter, models);
require(__dirname + '/routes/users-routes')(apiRouter, models);

app.use(bodyParser.json());
app.use('/', publicRouter);
app.use('/api', apiRouter);
app.use(morgan('dev'));

app.listen(config.PORT, () => {
  console.log('server started on port ' + config.PORT);
});
