'use strict';

module.exports = (router, models) => {
  let Tree = models.Tree;

  router.route('/trees')
    .get((req, res) => {

    })
    .post((req, res) => {

    });

  router.route('/trees/:tree')
    .get((req, res) => {

    })
    .put((req, res) => {

    })
    .delete((req, res) => {

    });

  router.route('/trees/species/:species')
    .get((req, res) => {

    })
    .put((req, res) => {

    })
    .delete((req, res) => {

    });

  router.route('/trees/species/:species/neighborhoods/:neighborhood')
    .get((req, res) => {

    })
    .put((req, res) => {

    })
    .delete((req, res) => {

    });
};