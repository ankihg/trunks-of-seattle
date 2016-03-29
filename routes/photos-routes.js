'use strict';
const formidable = require('formidable');
const fs = require('fs');

module.exports = (router, authenticate, models) => {

  const Photo = models.Photo;
  const Tree = models.Tree;

  router.route('/photos')
  .post((req, res) => {
    let newPhoto = new Photo({tree:req.body.tree._id});
    newPhoto.postToFlickr(req.body.filepath, req.body.tree, (err, photo) => {
      if (err) return res.status(500).json({msg:'error posting photo', err:err});
      return res.status(200).json({msg:'photo upload successful'});
    });
  });

  router.route('/photos/post')
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

  router.route('/photos/upload')
  .post((req, res) => {
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      console.log(fields.cityID);
      Tree.findOne({cityID:fields.cityID})
      .populate('species')
      .exec((err, tree) => {
        if (err) return res.status(500).json({msg:'error finding treee', err:err});
        if (!tree) return res.status(400).json({msg:'tree not found'});

        let newPhoto = new Photo({tree:tree._id});
        newPhoto.postToFlickr(files.upload.path, tree, (err, photo) => {
          if (err) return res.status(500).json({msg:'error posting photo', err:err});
          console.log('back from postToFlickr');
          console.log(photo);
        });
      });
    });
  });


};
