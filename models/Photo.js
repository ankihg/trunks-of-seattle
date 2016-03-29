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

  PhotoSchema.methods.postToFlickr = function(file) {

    Flickr.authenticate(FlickrOptions, function(error, flickr) {
    var uploadOptions = {
      photos: [{
        title: 'plz',
        photo: file.upload.path //fs.createReadStream(file.path)
      }]
    };

    Flickr.upload(uploadOptions, FlickrOptions, function(err, result) {
      if(err) {
        return console.error(error);
      }
      console.log("photos uploaded", result);
    });
  });
  }

  let Photo = mongoose.model('Photo', PhotoSchema);
  models.Photo = Photo;
};
