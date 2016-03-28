'use strict';

module.exports = (mongoose, models) => {
  let SpeciesSchema = mongoose.Schema({
    genus: String,
    species: String,
    commonName: String
  });

  let Species = mongoose.model('Species', SpeciesSchema);
  models.Species = Species;
};
