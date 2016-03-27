'use strict';

module.exports = (mongoose, models) => {
  let TreeSchema = mongoose.Schema({

  });

  let Tree = mongoose.model('Tree', TreeSchema);
  models.Tree = Tree;
};