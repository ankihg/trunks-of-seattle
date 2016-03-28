'use strict';

module.exports = (router, models) => {
  let Neighborhood = models.Neighborhood;

  router.route('/neighborhoods')
    .get((req, res) => {

    })
    .post((req, res) => {

    });

  router.route('/neighborhoods/:neighborhood')
    .get((req, res) => {

    })
    .put((req, res) => {

    })
    .delete((req, res) => {

    });
};
