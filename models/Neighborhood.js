'use strict';

module.exports = (mongoose, models) => {
  let NeighborhoodSchema = mongoose.Schema({
    // district: String,
    // species: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Species'
    // }]
    
  });

  let Neighborhood = mongoose.model('Neighborhood', NeighborhoodSchema);
  models.Neighborhood = Neighborhood;
};
