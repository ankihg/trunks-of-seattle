'use strict';
const Flickr = require('flickrapi');
const FlickrOptions = {
  api_key: process.env.FLICKR_API_KEY,
  secret: process.env.FLICKR_SECRET,
  user_id: process.env.FLICKR_USER_ID,
  access_token: process.env.FLICKR_ACCESS_TOKEN,
  access_token_secret: process.env.FLICKR_ACCESS_TOKEN_SECRET
};

/* export FLICKR_USER_ID="141429933@N06"
export FLICKR_ACCESS_TOKEN="72157666368248132-41204919f4b2768e"
export FLICKR_ACCESS_TOKEN_SECRET="830d049b9f430504" */

module.exports = (mongoose, models) => {
  let PhotoSchema = mongoose.Schema({
    flickrID: String,
    tree: {type: mongoose.Schema.Types.ObjectId, ref: 'Tree'}
  });

  PhotoSchema.methods.postToFlickr = function(file) {
    console.log(require('fs').readFileSync(__dirname+'/../storage/plz.jpg'));

    Flickr.authenticate(FlickrOptions, function(error, flickr) {
    var uploadOptions = {
      photos: [{
        title: 'plz',
        photo: require('fs').readFileSync(__dirname+'/../storage/plz.jpg')
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
