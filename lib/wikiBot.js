'use strict';
let api = require('nodemw');
let client = new api({
  server: 'en.wikipedia.org',
  path: '/w',
  debug: false
});

module.exports = client;
