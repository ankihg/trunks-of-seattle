'use strict';

module.exports = (mongoose, models) => {
  let TreeSchema = mongoose.Schema({
    species: {type: mongoose.Schema.Types.ObjectId, ref: 'Species'},
    lat: Number,
    lng: Number,
    cityID: String,
    plotType: String
  });

  let Tree = mongoose.model('Tree', TreeSchema);
  models.Tree = Tree;
};
