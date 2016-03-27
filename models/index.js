'use strict';

let mongoose = require('mongoose');
let config = require(__dirname + '/../config/env.js');

mongoose.connect(config.MONGO_URI);

let models = {};
require(__dirname + '/Neighborhood.js')(mongoose, models);
require(__dirname + '/Tree.js')(mongoose, models);
require(__dirname + '/User.js')(mongoose, models);

module.exports = models;