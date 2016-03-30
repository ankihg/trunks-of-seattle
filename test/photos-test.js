'use strict';
//test with mocha -t 100000
const config = require(__dirname + '/../config/env.js');

const chai = require('chai');
const chaiHttp = require('chai-http');
require(__dirname + '/../server.js');

chai.use(chaiHttp);
const request = chai.request;
const expect = chai.expect;

const models = require(__dirname + '/../models');
const Species = models.Species;
const Tree = models.Tree;
const Photo = models.Photo;

describe('crud testing for resource photos', () => {

  let tree;
  let path = __dirname + '/../storage/plz.jpg';
  let photo;

  before((done) => {

    let newSpecies = new Species({genus:'plzus', species:'responda', commonName:'respond plz'});
    newSpecies.save((err, species) => {
      expect(err).eql(null);

      let newTree = new Tree({cityID:'TRE-123', species:species._id, lat:55, lng:55, plotType:'GRASS'});
      newTree.save((err, tr) => {
        expect(err).eql(null);
        Tree.populate(tr, 'species', (err, tr) => {
          expect(err).eql(null);

          tree = tr;
          done();
        });
      });
    });
  });

  it('post a photo', (done) => {
    request('localhost:'+config.PORT)
    .post('/photos')
    .send({filepath:path, tree:tree})
    .end((err, res) => {
      expect(err).eql(null);
      expect(res.body.msg).eql('photo upload successful');
      done();
    });
  });

  it('get all photos', (done) =>{
    request('localhost:'+config.PORT)
    .get('/photos')
    .end((err, res) => {
      expect(err).eql(null);
      expect(res.body.photos.length).eql(1);
      photo = res.body.photos[0];
      done();
    });
  });

  it('get all photos of tree', (done) => {
    request('localhost:'+config.PORT)
    .get('/photos/tree/'+tree._id)
    .end((err, res) => {
      expect(err).eql(null);
      expect(res.body.photos.length).eql(1);
      done();
    });
  });

  it('get photo by id', (done) => {
    request('localhost:'+config.PORT)
    .get('/photos/'+photo._id)
    .end((err, res) => {
      console.log(err);
      console.log(res);
    });
  });

  after((done) => {
    Photo.remove({}, (err) => {
      if (err) return console.log(err);
      console.log('photos rmeoved');
      done();
    });
  });

});
