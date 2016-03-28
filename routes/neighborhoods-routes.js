'use strict';

module.exports = (router, models) => {
  let Neighborhood = models.Neighborhood;
//:id would be Downtown Seattle/Ballard/Queen Anne..etc
  router.route('/neighborhoods')
    .get((req, res) => {

    })
    .post((req, res) => {

    })
    .put((req, res) => {

    })
    .delete((req, res) => {

    })
    .delete('/:id',(req, res) => {

    })
    .get('/:id',(req, res) => {

    })
    .get('/:id/genus',(req, res) => {

    })
    .get('/:id/species',(req, res) => {

    });
};
