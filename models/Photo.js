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

  PhotoSchema.methods.postToFlickr = function(filepath, tree, next) {

    let photo = this;
    Flickr.authenticate(FlickrOptions, function(error, flickr) {
      var uploadOptions = {
        photos: [{
          title: tree.species.commonName,
          photo: filepath //fs.createReadStream(file.path)
        }]
      };

      Flickr.upload(uploadOptions, FlickrOptions, function(err, result) {
        if (err) return next(err);
        console.log("photos uploaded", result);
        photo.flickrID = result[0];
        photo.save((err, p) => {
          return next(err, p);
        });

        // photo.update({flickrID:result[0]}, (err, report) => {
        //   console.log(photo);
        //   return next(err, report);
        // });
      });
    });
  }

  let Photo = mongoose.model('Photo', PhotoSchema);
  models.Photo = Photo;
};
