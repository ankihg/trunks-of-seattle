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
    Tree.remove({_id: treeId}, (err, data)=>{
      if(err){
        return console.log(err);
      }
      console.log(data);
    });
    Species.remove({_id: speciesTestId},(err, data)=>{
      if(err){
        return console.log('test data not deleted');
      }
      console.log('test data deleted!' + data);
      done();
    });
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
});
