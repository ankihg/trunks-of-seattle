'use strict';

module.exports = (mongoose, models) => {
  let NeighborhoodSchema = mongoose.Schema({

  });

  let Neighborhood = mongoose.model('Neighborhood', NeighborhoodSchema);
  models.Neighborhood = Neighborhood;
};