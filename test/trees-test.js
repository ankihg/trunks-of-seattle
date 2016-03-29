'use strict';
//test with mocha -t 100000

let chai = require('chai');
let chaiHttp = require('chai-http');
require(__dirname + '/../server.js');

chai.use(chaiHttp);
let request = chai.request;
let expect = chai.expect;


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
    .send({lat: 23445, lng: 67890, cityID: 'sjdhfk'})
    .end((err, res)=>{
      // debugger;
      expect(err).to.be.null;
      expect(res.body).to.have.an('object');
      expect(res.body).to.have.property('_id');
      expect(res.body).to.have.property('lat');
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
