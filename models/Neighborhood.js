'use strict';

module.exports = (mongoose, models) => {
  let NeighborhoodSchema = mongoose.Schema({
    // district: String,
    // trees: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Tree'
    // }]
  });

  let Neighborhood = mongoose.model('Neighborhood', NeighborhoodSchema);
  models.Neighborhood = Neighborhood;
};
