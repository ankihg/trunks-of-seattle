'use strict';

module.exports = (router, models) => {
  let basicHTTP = require(__dirname + '/../lib/basicHTTP.js');

  router.route('/signup')
    .post((req, res) => {

    });

  router.route('/login')
    .get(basicAuth, (req, res) => {

    });
};
