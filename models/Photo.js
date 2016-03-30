'use strict';
const fs = require('fs');

const Flickr = require('flickrapi');
const FlickrOptions = {
  api_key: process.env.FLICKR_API_KEY,
  secret: process.env.FLICKR_SECRET,
  user_id: process.env.FLICKR_USER_ID,
  access_token: process.env.FLICKR_ACCESS_TOKEN,
  access_token_secret: process.env.FLICKR_ACCESS_TOKEN_SECRET,
  permissions: 'write'
};

module.exports = (mongoose, models) => {
  let PhotoSchema = mongoose.Schema({
    flickrID: String,
    tree: {type: mongoose.Schema.Types.ObjectId, ref: 'Tree'}
  });

  PhotoSchema.methods.getFromFlickr = function(next) {

    let photo = this;

    Flickr.authenticate(FlickrOptions, function(error, flickr) {
      if (error) return next(error);
      flickr.photos.search({
        user_id: flickr.options.user_id,
        page: 1,
        per_page: 1,
        id:photo.flickrID
      }, (err, result) => {
        if (err) return next(err);
        return next(null, result.photos.photo[0]);
      });
    });
  };

  PhotoSchema.methods.postToFlickr = function(filepath, tree, next) {

    let photo = this;
    let desc = `${tree.species.genus} ${tree.species.species} at latitute:${tree.lat} and longitude:${tree.lng}`;
    if (tree.address) desc.concat(` near ${tree.address}`);

    Flickr.authenticate(FlickrOptions, function(error, flickr) {
      var uploadOptions = {
        photos: [{
          title: tree.species.commonName,
          photo: filepath,
          description: desc,
          tags: [tree.cityID, tree.species.commonName, `${tree.species.genus} ${tree.species.species}`, 'trees', 'Seattle', 'Trunks of Seattle']
        }]
      };

      Flickr.upload(uploadOptions, FlickrOptions, function(err, result) {
        if (err) return next(err);
        console.log("photos uploaded", result);
        photo.flickrID = result[0];
        photo.save((err, p) => {
          return next(err, p);
        });

      });
    });
  }

  let Photo = mongoose.model('Photo', PhotoSchema);
  models.Photo = Photo;
};
