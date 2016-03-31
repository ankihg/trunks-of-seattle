'use strict';
module.exports = (mongoose, models) => {
  let GeoTreesSchema = mongoose.Schema({
    loc: {
      coordinates: [],
      type: {type: String}
      },
      cityID: String,
      plotType: String,
      species: {type: mongoose.Schema.Types.ObjectId, ref: 'Species'},
  });

  let GeoTrees = mongoose.model('GeoTrees', GeoTreesSchema);
  models.geoTrees = GeoTrees;
};
