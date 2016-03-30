'use strict';

module.exports = (router, models) => {
  let Neighborhood = models.Neighborhood;
  let jwtAuth = require(__dirname + '/../lib/jwtAuth.js');

  router.route('/neighborhoods')
    .get((req, res) => {

    })
    .post(jwtAuth, (req, res) => {

    });

  router.route('/neighborhoods/:neighborhood')
    .get((req, res) => {

    })
    .put(jwtAuth, (req, res) => {

    })
    .delete(jwtAuth, (req, res) => {

    });
};
