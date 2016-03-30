'use strict';
const formidable = require('formidable');
const fs = require('fs');

module.exports = (router, publicRouter, models) => {
  let jwtAuth = require(__dirname + '/../lib/jwtAuth.js');

  const Photo = models.Photo;
  const Tree = models.Tree;

  router.route('/photos')
  .get((req, res) => {
    console.log('get photos');
    Photo.find({}, (err, photos) => {
      if (err) return res.status(500).json({msg:'error reading photos', err:err});
      return res.status(200).json({photos});
    });
  })
  .post(jwtAuth, (req, res) => {
    let newPhoto = new Photo({tree:req.body.tree._id, user:req.user._id});
    newPhoto.postToFlickr(req.body.filepath, req.body.tree, req.user, (err, photo) => {
      if (err) return res.status(500).json({msg:'error posting photo', err:err});
      return res.status(200).json({msg:'photo upload successful'});
    });
  });

  router.route('/photos/:photo')
  .get((req, res) => {
    Photo.findById(req.params.photo, (err, photo) => {
      if (err) return res.status(500).json({msg:'error finding photo', err:err});
      if (!photo) return res.status(400).json({msg:'photo does not exist', err:err});
      photo.getFromFlickr((err, flickrPhoto) => {
        if (err) return res.status(500).json({msg:'error getting photo from flickr', err:err});
        return res.status(200).json({msg:'get flickr photo object', data:flickrPhoto});
      });
    });
  });

  router.route('/photos/tree/:tree')
  .get((req, res) => {
    Photo.find({tree:req.params.tree}, (err, photos) => {
      if (err) return res.status(500).json({msg:'error reading photos', err:err});
      return res.status(200).json({photos});
    });
  });

  publicRouter.route('/photos/:photo/view')
  .get((req, res) => {
    //http://stackoverflow.com/questions/10353097/flickr-api-include-photo-in-website
    //http://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
    Photo.findById(req.params.photo, (err, photo) => {
      if (err) return res.status(500).json({msg:'error finding photo', err:err});
      if (!photo) return res.status(400).json({msg:'photo does not exist', err:err});
      photo.getFromFlickr((err, flickrPhoto) => {
        if (err) return res.status(500).json({msg:'error getting photo from flickr', err:err});

        var photoURL = `http://farm${flickrPhoto.farm}.staticflickr.com/${flickrPhoto.server}/${flickrPhoto.id}_${flickrPhoto.secret}.jpg`;
        var img = `<img src=${photoURL}></img>`
        return res.status(200).send(img);
      });
    });
  });

  publicRouter.route('/photos/form')
  .get((req, res) => {
    console.log('get post photos');

    var body = '<html>'+
      '<head>'+
      '<meta http-equiv="Content-Type" '+
      'content="text/html; charset=UTF-8" />'+
      '</head>'+
      '<body>'+
      '<form action="/photos/upload" enctype="multipart/form-data" '+
      'method="post">'+
      '<input type="text" name="cityID"></br>'+
      '<input type="file" name="upload">'+
      '<input type="submit" value="Upload file" />'+
      '</form>'+
      '</body>'+
      '</html>';

    res.status(200).set('Content-Type', 'text/html').send(body);
  });

  publicRouter.route('/photos/upload')
  .post((req, res) => {
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      Tree.findOne({cityID:fields.cityID})
      .populate('species')
      .exec((err, tree) => {
        if (err) return res.status(500).json({msg:'error finding treee', err:err});
        if (!tree) return res.status(400).json({msg:'tree not found'});

        let newPhoto = new Photo({tree:tree._id});
        newPhoto.postToFlickr(files.upload.path, tree, (err, photo) => {
          if (err) return res.status(500).json({msg:'error posting photo', err:err});
          res.redirect('/photos/'+photo._id+'/view');
        });
      });
    });
  });
};
