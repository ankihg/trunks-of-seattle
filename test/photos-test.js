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
const User = models.User;

let userId;
let userToken;

let userJSON = {
  username: 'treehuggers',
  password: 'treelovers'
};

describe('crud testing for resource photos', () => {

  let tree;
  let path = __dirname + '/../storage/plz.jpg';
  let photo;

  before((done) => {
    request('localhost:' + config.PORT)
      .post('/signup')
      .send(userJSON)
      .end((err, res) => {
        userId = res.body.data._id;
        userToken = res.body.token;
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.property('token');
        expect(res.body.data).to.have.property('username');
        expect(res.body.data).to.have.property('password');
        expect(res.body.token).to.not.equal(null);
        expect(res.body.data.username).to.equal('treehuggers');
        expect(res.body.data.password).to.not.equal(null);
        done();
      });
  });

  before((done) => {

    let newSpecies = new Species({genus:'hjalpus', species:'miga', commonName:'hjalp mig'});
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
    .post('/api/photos')
    .set('token', userToken)
    .send({filepath:path, tree:tree})
    .end((err, res) => {
      // console.log(err);
      expect(err).eql(null);
      expect(res.body.msg).eql('photo upload successful');
      done();
    });
  });

  it('get all photos', (done) =>{
    request('localhost:'+config.PORT)
    .get('/api/photos')
    .end((err, res) => {
      expect(err).eql(null);
      expect(res.body.photos.length).eql(1);
      photo = res.body.photos[0];
      done();
    });
  });

  it('get all photos of tree', (done) => {
    request('localhost:'+config.PORT)
    .get('/api/photos/trees/'+tree._id)
    .end((err, res) => {
      expect(err).eql(null);
      expect(res.body.photos.length).eql(1);
      done();
    });
  });

  it('get flickr photo object by id', (done) => {
    request('localhost:'+config.PORT)
    .get('/api/photos/'+photo._id)
    .end((err, res) => {
      expect(err).eql(null);
      expect(res.body.data).property('id');
      expect(res.body.data).property('farm');
      done();
    });
  });

  it('get flickr photo by id', (done) => {
    request('localhost:'+config.PORT)
    .get('/photos/'+photo._id+'/view')
    .end((err, res) => {
      expect(err).eql(null);
      expect(res.text).not.eql(null);
      expect(res.text).not.eql(undefined);
      done();
    });
  });

  it('get all photos by user', (done) => {
    request('localhost:'+config.PORT)
    .get('/api/photos/users/'+userId)
    .end((err, res) => {
      expect(err).eql(null);
      expect(res.body).property('data');
      done();
    });
  })

  after((done) => {
    request('localhost:' + config.PORT)
      .delete('/api/users/' + userId)
      .set('token', userToken)
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.property('message');
        expect(res.body.data).to.have.property('_id');
        expect(res.body.data).to.have.property('username');
        expect(res.body.data).to.have.property('password');
        expect(res.body.message).to.equal('Deleted User');
        expect(res.body.data._id).to.not.equal(null);
        expect(res.body.data.username).to.equal('treehuggers');
        expect(res.body.data.password).to.not.equal(null);

        Photo.remove({}, (err) => {
          if (err) return console.log(err);
          console.log('photos rmeoved');

          User.remove({}, (err) => {
            if (err) return console.log(err);
            console.log('users rmeoved');
            done();
          });
        });
      });
  });
});
