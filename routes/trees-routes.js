'use strict';

module.exports = (router, models) => {
  let Tree = models.Tree;

  router.route('/trees')
    .get((req, res) => {
      Tree.find({}, (err, trees)=>{
        if(err){
          return res.json({msg: err});
        }
        res.json(trees);
      });
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