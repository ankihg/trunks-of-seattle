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
        res.json({message: 'Created Tree', data: tree});
      });
    });

  router.route('/trees/count')
    .get((req, res) => {
      Tree.find({}).count((err, count) => {
        if (err) {
          return res.send(err);
        }
        res.status(200).json({message: 'Total Tree Count', data: {count: count}});
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
        res.json({message: 'Deleted Tree', data: data});
      });
    });

  router.route('/trees/species/count')
    .get((req, res) => {
      Tree.aggregate([{$group: {_id: '$species', count: {$sum:1}}}, {$sort: {count: -1}}], (err, species) => {
        if (err) {
          return res.send(err);
        }
        res.status(200).json({message: 'Total Species Count', data: species});
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

  router.route('/trees/species/:species/count')
    .get((req, res) => {
      Tree.find({species: req.params.species}).count((err, count) => {
        if (err) {
          return res.send(err);
        }
        res.status(200).json({message: 'Total Species Count', data: {speciesId: req.params.species, count: count}});
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
