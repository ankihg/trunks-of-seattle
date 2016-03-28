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

describe('trees db testing', () => {

  it('get tree with cityID TRE-1051550', (done) => {
    Tree.findOne({cityID:'TRE-1051550'})
    .populate('species')
    .exec((err, tree) => {
      expect(err).eql(null);
      expect(tree.cityID).eql('TRE-1051550');
      done();
    });
  });

  // it('get all trees', (done) => {
  //   Tree.find({}, (err, trees) => {
  //     expect(err).eql(null);
  //     console.log(trees.length);
  //     done();
  //   })
  // });

});

describe('Integration testing for /trees routes', ()=>{
  before((done)=>{
    
  });
  it('should return all trees data',(done)=>{

  });
});
