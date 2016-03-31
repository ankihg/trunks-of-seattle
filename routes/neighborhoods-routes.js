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
      // let neighborhood = req.params.id;
      // console.log('hitting neighborhood route');
      // neighborhoodsbox.find({neighborhood: neighborhood},(err, neighborhood)=>{
      //   if(err){
      //     return res.json({message: err});
      //   }
      //   console.log(neighborhood);
      // });
    })
    .put(jwtAuth, (req, res) => {

    })
    .delete(jwtAuth, (req, res) => {

    });
};
