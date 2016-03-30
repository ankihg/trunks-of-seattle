'use strict';
//test with mocha -t 100000

let chai = require('chai');
let chaiHttp = require('chai-http');
require(__dirname + '/../server.js');
let config = require(__dirname + '/../config/env.js');

chai.use(chaiHttp);
let request = chai.request;
let expect = chai.expect;

let userId;
let userToken;

let userJSON = {
  username: 'treehuggers',
  password: 'treelovers'
};

const models = require(__dirname + '/../models');
const Tree = models.Tree;
const Species = models.Species;

// describe('trees db testing', () => {
//
//   it('get tree with cityID TRE-1051550', (done) => {
//     Tree.findOne({cityID:'TRE-1051550'})
//     .populate('species')
//     .exec((err, tree) => {
//       expect(err).eql(null);
//       expect(tree.cityID).eql('TRE-1051550');
//       done();
//     });
//   });

  // it('get all trees', (done) => {
  //   Tree.find({}, (err, trees) => {
  //     expect(err).eql(null);
  //     console.log(trees.length);
  //     done();
  //   })
  // });

// });

describe('Integration testing for /trees routes', ()=>{
  let speciesTest;
  let speciesTestId;
  let treeId;

  before((done)=>{
    speciesTest = new Species({genus: 'prunus', species: 'Plam', commonName: 'Palm tree'});
    speciesTest.save((err, species)=>{
      if(err){
        console.log('err :' + err);
        return;
      }
      console.log('New Species input  :' + species);
      speciesTestId = species._id;
      let tree = new Tree({species: species._id, cityID: 'hsj22'});
      tree.save((err, tree)=>{
        if(err){
          console.log('err :' + err);
          return;
        }
        treeId = tree._id;
        console.log('New Tree input  :' + tree);
        done();
      });
    });
  });

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
        done();
      });
  });

  after((done)=>{
    Tree.remove({_id: treeId});
    Species.remove({_id: speciesTestId});
    Tree.remove({species: 'cherry'});
    done();
  });
  it('should return all trees data',(done)=>{
    request('localhost:3000')
    .get('/api/trees')
    .end((err, res)=>{
      expect(err).to.be.null;
      expect(res.body).to.be.an('array');
      expect(res.body[0]).to.have.property('species');
      done();
    });
  });
  it('should create a new set of tree data', (done)=>{
    request('localhost:3000')
    .post('/api/trees')
    .set('token', userToken)
    .send({lat: 23445, lng: 67890, cityID: 'sjdhfk'})
    .end((err, res)=>{
      // debugger;
      expect(err).to.be.null;
      expect(res.body).to.have.an('object');
      expect(res.body.data).to.have.property('_id');
      expect(res.body.data).to.have.property('lat');
      done();
    });
  });
  it('should only GET a specific id tree', (done)=>{
    request('localhost:3000')
    .get('/api/trees/' + treeId)
    .end((err, res)=>{
      expect(err).to.be.null;
      expect(res.body).to.have.an('object');
      expect(res.body).to.have.property('_id');
      expect(res.body._id).to.have.string(treeId);
      done();
    });
  });
  it('should PUT updates into the specific id', (done)=>{
    request('localhost:3000')
    .put('/api/trees/' + treeId)
    .set('token', userToken)
    .send({cityID: 'newcityID'})
    .end((err, res)=>{
      expect(err).to.be.null;
      expect(res.body).to.have.an('object');
      expect(res.body).to.have.property('cityID');
      expect(res.body.cityID).to.equal('newcityID');
      done();
    });
  });
  it('should GET specific species from trees', (done)=>{
    request('localhost:3000')
    .get('/api/trees/species/' + speciesTestId)
    .end((err, res)=>{
      expect(err).to.be.null;
      expect(res.body).to.have.an('array');
      expect(res.body[0].species).to.have.string(speciesTestId);
      done();
    });
  });
});

describe('testing counts for trees', () => {
  let cherrySpeciesId;
  let redwoodSpeciesId;
  let cherryTree1Id;
  let cherryTree2Id;
  let redwoodTree1Id;
  let redwoodTree2Id;
  let redwoodTree3Id;

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
    request('localhost:' + config.PORT)
      .post('/api/species')
      .set('token', userToken)
      .send({
        genus: 'Prunus',
        species: 'Prunus serrulata',
        commonName: 'Cherry Blossom'
      })
      .end((err, res) => {
        cherrySpeciesId = res.body.data._id;
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body.data).to.have.property('genus');
        expect(res.body.data).to.have.property('species');
        expect(res.body.data).to.have.property('commonName');
        expect(res.body.data.genus).to.equal('Prunus');
        expect(res.body.data.species).to.equal('Prunus serrulata');
        expect(res.body.data.commonName).to.equal('Cherry Blossom');
        done();
      });
  });

  before((done) => {
    request('localhost:' + config.PORT)
      .post('/api/species')
      .set('token', userToken)
      .send({
        genus: 'Sequoiadendron',
        species: 'Sequoiadendron giganteum',
        commonName: 'Redwood'
      })
      .end((err, res) => {
        redwoodSpeciesId = res.body.data._id;
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body.data).to.have.property('genus');
        expect(res.body.data).to.have.property('species');
        expect(res.body.data).to.have.property('commonName');
        expect(res.body.data.genus).to.equal('Sequoiadendron');
        expect(res.body.data.species).to.equal('Sequoiadendron giganteum');
        expect(res.body.data.commonName).to.equal('Redwood');
        done();
      });
  });

  before((done) => {
    request('localhost:' + config.PORT)
      .post('/api/trees')
      .set('token', userToken)
      .send({
        species: cherrySpeciesId,
        lat: 0,
        lng: 0,
        cityID: 'TRE-000',
        plotType: 'private land'
      })
      .end((err, res) => {
        cherryTree1Id = res.body.data._id;
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body.data).to.have.property('species');
        expect(res.body.data).to.have.property('lat');
        expect(res.body.data).to.have.property('lng');
        expect(res.body.data).to.have.property('cityID');
        expect(res.body.data).to.have.property('plotType');
        expect(res.body.data.species).to.equal(cherrySpeciesId);
        expect(res.body.data.lat).to.equal(0);
        expect(res.body.data.lng).to.equal(0);
        expect(res.body.data.cityID).to.equal('TRE-000');
        expect(res.body.data.plotType).to.equal('private land');
        done();
      });
  });

  before((done) => {
    request('localhost:' + config.PORT)
      .post('/api/trees')
      .set('token', userToken)
      .send({
        species: cherrySpeciesId,
        lat: 1,
        lng: 1,
        cityID: 'TRE-001',
        plotType: 'public land'
      })
      .end((err, res) => {
        cherryTree2Id = res.body.data._id;
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body.data).to.have.property('species');
        expect(res.body.data).to.have.property('lat');
        expect(res.body.data).to.have.property('lng');
        expect(res.body.data).to.have.property('cityID');
        expect(res.body.data).to.have.property('plotType');
        expect(res.body.data.species).to.equal(cherrySpeciesId);
        expect(res.body.data.lat).to.equal(1);
        expect(res.body.data.lng).to.equal(1);
        expect(res.body.data.cityID).to.equal('TRE-001');
        expect(res.body.data.plotType).to.equal('public land');
        done();
      });
  });

  before((done) => {
    request('localhost:' + config.PORT)
      .post('/api/trees')
      .set('token', userToken)
      .send({
        species: redwoodSpeciesId,
        lat: 0,
        lng: 0,
        cityID: 'TRE-002',
        plotType: 'private land'
      })
      .end((err, res) => {
        redwoodTree1Id = res.body.data._id;
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body.data).to.have.property('species');
        expect(res.body.data).to.have.property('lat');
        expect(res.body.data).to.have.property('lng');
        expect(res.body.data).to.have.property('cityID');
        expect(res.body.data).to.have.property('plotType');
        expect(res.body.data.species).to.equal(redwoodSpeciesId);
        expect(res.body.data.lat).to.equal(0);
        expect(res.body.data.lng).to.equal(0);
        expect(res.body.data.cityID).to.equal('TRE-002');
        expect(res.body.data.plotType).to.equal('private land');
        done();
      });
  });

  before((done) => {
    request('localhost:' + config.PORT)
      .post('/api/trees')
      .set('token', userToken)
      .send({
        species: redwoodSpeciesId,
        lat: 2,
        lng: 12,
        cityID: 'TRE-003',
        plotType: 'public land'
      })
      .end((err, res) => {
        redwoodTree2Id = res.body.data._id;
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body.data).to.have.property('species');
        expect(res.body.data).to.have.property('lat');
        expect(res.body.data).to.have.property('lng');
        expect(res.body.data).to.have.property('cityID');
        expect(res.body.data).to.have.property('plotType');
        expect(res.body.data.species).to.equal(redwoodSpeciesId);
        expect(res.body.data.lat).to.equal(2);
        expect(res.body.data.lng).to.equal(12);
        expect(res.body.data.cityID).to.equal('TRE-003');
        expect(res.body.data.plotType).to.equal('public land');
        done();
      });
  });

  before((done) => {
    request('localhost:' + config.PORT)
      .post('/api/trees')
      .set('token', userToken)
      .send({
        species: redwoodSpeciesId,
        lat: 4,
        lng: 3,
        cityID: 'TRE-004',
        plotType: 'private land'
      })
      .end((err, res) => {
        redwoodTree3Id = res.body.data._id;
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body.data).to.have.property('species');
        expect(res.body.data).to.have.property('lat');
        expect(res.body.data).to.have.property('lng');
        expect(res.body.data).to.have.property('cityID');
        expect(res.body.data).to.have.property('plotType');
        expect(res.body.data.species).to.equal(redwoodSpeciesId);
        expect(res.body.data.lat).to.equal(4);
        expect(res.body.data.lng).to.equal(3);
        expect(res.body.data.cityID).to.equal('TRE-004');
        expect(res.body.data.plotType).to.equal('private land');
        done();
      });
  });

  after((done) => {
    request('localhost:' + config.PORT)
      .delete('/api/trees/' + cherryTree1Id)
      .set('token', userToken)
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Deleted Tree');
        done();
      });
  });

  after((done) => {
    request('localhost:' + config.PORT)
      .delete('/api/trees/' + cherryTree2Id)
      .set('token', userToken)
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Deleted Tree');
        done();
      });
  });

  after((done) => {
    request('localhost:' + config.PORT)
      .delete('/api/trees/' + redwoodTree1Id)
      .set('token', userToken)
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Deleted Tree');
        done();
      });
  });

  after((done) => {
    request('localhost:' + config.PORT)
      .delete('/api/trees/' + redwoodTree2Id)
      .set('token', userToken)
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Deleted Tree');
        done();
      });
  });

  after((done) => {
    request('localhost:' + config.PORT)
      .delete('/api/trees/' + redwoodTree3Id)
      .set('token', userToken)
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Deleted Tree');
        done();
      });
  });

  after((done) => {
    request('localhost:' + config.PORT)
      .delete('/api/species/' + cherrySpeciesId)
      .set('token', userToken)
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.property('message');
        expect(res.body.data).to.have.property('genus');
        expect(res.body.data).to.have.property('species');
        expect(res.body.data).to.have.property('commonName');
        expect(res.body.message).to.equal('Deleted Species');
        expect(res.body.data.genus).to.equal('Prunus');
        expect(res.body.data.species).to.equal('Prunus serrulata');
        expect(res.body.data.commonName).to.equal('Cherry Blossom');
        done();
      });
  });

  after((done) => {
    request('localhost:' + config.PORT)
      .delete('/api/species/' + redwoodSpeciesId)
      .set('token', userToken)
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.property('message');
        expect(res.body.data).to.have.property('genus');
        expect(res.body.data).to.have.property('species');
        expect(res.body.data).to.have.property('commonName');
        expect(res.body.message).to.equal('Deleted Species');
        expect(res.body.data.genus).to.equal('Sequoiadendron');
        expect(res.body.data.species).to.equal('Sequoiadendron giganteum');
        expect(res.body.data.commonName).to.equal('Redwood');
        done();
      });
  });

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
        done();
      });
  });

  it('should return the count for all trees', (done) => {
    request('localhost:' + config.PORT)
      .get('/api/trees/count')
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.property('message');
        expect(res.body.data).to.have.property('count');
        expect(res.body.message).to.equal('Total Tree Count');
        expect(res.body.data.count).to.be.above(0);
        done();
      });
  });

  it('should return the count for all species of trees', (done) => {
    request('localhost:' + config.PORT)
      .get('/api/trees/species/count')
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.property('message');
        expect(res.body.data).to.be.an('array');
        expect(res.body.message).to.equal('Total Species Count');
        expect(res.body.data).to.include({_id: cherrySpeciesId, count: 2});
        expect(res.body.data).to.include({_id: redwoodSpeciesId, count: 3});
        done();
      });
  });

  it('should return the count for specific species of trees (cherry blossoms)', (done) => {
    request('localhost:' + config.PORT)
      .get('/api/trees/species/' + cherrySpeciesId + '/count')
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.property('message');
        expect(res.body.data).to.have.property('speciesId');
        expect(res.body.data).to.have.property('count');
        expect(res.body.data.speciesId).to.equal(cherrySpeciesId);
        expect(res.body.data.count).to.equal(2);
        done();
      });
  });

  it('should return the count for specific species of trees (redwoods)', (done) => {
    request('localhost:' + config.PORT)
      .get('/api/trees/species/' + redwoodSpeciesId + '/count')
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.property('message');
        expect(res.body.data).to.have.property('speciesId');
        expect(res.body.data).to.have.property('count');
        expect(res.body.data.speciesId).to.equal(redwoodSpeciesId);
        expect(res.body.data.count).to.equal(3);
        done();
      });
  });
});

