'use strict';
let mongoose = require('mongoose');
let GeoTreesSchema = new mongoose.Schema({
  loc: {
    coordinates: [],
    type: {type: String}
    },
    cityID: String,
    plotType: String,
    species: {type: mongoose.Schema.Types.ObjectId, ref: 'Species'},
});

let GeoTrees = mongoose.model('GeoTrees', GeoTreesSchema);
module.exports = GeoTrees;
