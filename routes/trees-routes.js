'use strict';

module.exports = (router, models) => {
  let Tree = models.Tree;
  let jwtAuth = require(__dirname + '/../lib/jwtAuth.js');

  router.route('/trees')
    .get((req, res) => {
      Tree.find({}, (err, trees)=>{
        if(err){
          return res.json({msg: err});
        }
        res.json(trees);
      });
    })
    .post(jwtAuth, (req, res) => {
      let newTree = new Tree(req.body);
      newTree.save((err, tree)=>{
        if(err){
          return res.json({msg: err});
        }
        res.json(tree);
      });
    });

  router.route('/trees/:tree')
    .get((req, res) => {
      Tree.findOne({_id: req.params.tree}, (err, tree)=>{
        if(err){
          return res.json({msg: err});
        }
        res.json(tree);
      });
    })
    .put(jwtAuth, (req, res) => {
      Tree.findOneAndUpdate({_id: req.params.tree}, {$set: req.body }, {new: true}, (err, data)=>{
        if(err){
          return res.json({msg: err});
        }
        res.json(data);
      });
    })
    .delete(jwtAuth, (req, res) => {
      Tree.findOneAndRemove({_id: req.params.tree}, (err, data)=>{
        if(err){
          return res.json({msg: err});
        }
        res.json(data);
      });
    });

  router.route('/trees/species/:species')
    .get((req, res) => {
      Tree.find({species: req.params.species}, (err, tree)=>{
        if(err){
          return res.json({msg: err});
        }
        res.json(tree);
      });
    });

  router.route('/trees/species/:species/neighborhoods/:neighborhood')
    .get((req, res) => {

    })
    .put(jwtAuth, (req, res) => {

    })
    .delete(jwtAuth, (req, res) => {

    });
};
