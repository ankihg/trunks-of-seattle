'use strict';
let mongoose = require('mongoose');
let GeoTree = require(__dirname + '/../models/geotrees');

// let MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/db';
mongoose.connect('mongodb://localhost/db');

//TreeSchema
let TreeSchema = new mongoose.Schema({
  species: {type: mongoose.Schema.Types.ObjectId, ref: 'Species'},
  lat: Number,
  lng: Number,
  cityID: String,
  plotType: String
});

let Tree = mongoose.model('Tree', TreeSchema);

//Converting data
Tree.find({}, (err, trees)=>{
  console.log(trees);
  trees.forEach((tree)=>{
    let newGeoTree = GeoTree({
      loc: {coordinates: [tree.lng, tree.lat], type: "Point"},
      cityID: tree.cityID,
      plotType: tree.plotType,
      species: tree.ObjectId
    });
    newGeoTree.save((err, data)=>{
      if(err){
        return console.log(err);
      }
      console.log(data);
    });
  });
});
