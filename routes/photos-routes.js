'use strict';
const formidable = require('formidable');
const fs = require('fs');

module.exports = (router, authenticate, models) => {

  const Photo = models.Photo;

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
      console.log(files.upload.path);
      let newPhoto = new Photo();
      // console.log(files);
      newPhoto.postToFlickr(files);
    });
  });


};
