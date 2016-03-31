'use strict';
let mongoose = require('mongoose');
let GeoTree = require(__dirname + '/../models/geotrees');
let fs = require('fs');
let exec = require('child_process').exec;

let MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/db';
mongoose.connect(MONGO_URI);
let MONGO_USER = process.env.MONGO_USER
let MONGO_PASS = process.env.MONGO_PASS
let MONGO_PORT = process.env.MONGO_PORT

//TreeSchema
let TreeSchema = new mongoose.Schema({
  species: {type: mongoose.Schema.Types.ObjectId, ref: 'Species'},
  lat: Number,
  lng: Number,
  cityID: String,
  plotType: String
});

let SpeciesSchema = new mongoose.Schema({
  genus: String,
  species: String,
  commonName: String
});

let Species = mongoose.model('Species', SpeciesSchema);
let Tree = mongoose.model('Tree', TreeSchema);

//Reading geojson directory files, adding neighborhood name, and cb to import data to MONGO LAB
// fs.readdir(__dirname + '/../geojson',(err, files, cb)=>{
//   cb = executeImportFiles;
//   files.forEach((file)=>{
//     var fileName = file.split('.')[0];
//     fs.readFile(__dirname + '/../geojson/' + file, (err, data)=>{
//       console.log(JSON.parse(data));
//       let jsonData = JSON.parse(data);
//       jsonData.neighborhood = fileName;
//       let backToJson = JSON.stringify(jsonData);
//       console.log(backToJson);
//       fs.writeFile(__dirname + '/../geojsonNew/' + file, backToJson,(err, data)=>{
//         console.log(data);
//         cb(files);
//       });//writefile
//     }); //readfile
//   }); //forEach
// }); //readdir
//
// //this is callback function for
// function executeImportFiles(files){
//   console.log('Here is files in cb : ' + files);
//   files.forEach((file)=>{
//     exec('mongoimport -h ' + MONGO_PORT + ' -d trunks-of-seattle -c neighborhoodsbox -u ' + MONGO_USER + ' -p ' + MONGO_PASS + ' --file ./../geojsonNew/' + file, (err, stdout, stderr)=>{
//       if(err){
//         console.error(err);
//         return;
//       }
//       console.log('Here is STDOUT : ' + stdout);
//     });
//   });
// };


// Populate & Converting data
Tree.find({}).limit(10).populate('species')
.exec((err, trees)=>{
  if(err){
    console.log('Here is error : ' + err);
    return;
  }
  trees.forEach((tree)=>{
    let newGeoTree = GeoTree({
      loc: {coordinates: [tree.lng, tree.lat], type: "Point"},
      cityID: tree.cityID,
      plotType: tree.plotType,
      species: tree._id
    });
    newGeoTree.save((err, data)=>{
      if(err){
        return console.log(err);
      }
      console.log(data);
    });
  });
});
