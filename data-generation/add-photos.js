'use strict';
const config = require(__dirname + '/../config/env.js');

const chai = require('chai');
chai.use(require('chai-http'));

const request = chai.request;
const expect = chai.expect;

const models = require(__dirname + '/../models');
const Tree = models.Tree;
const Photo = models.Photo;

describe('post photos by user ankihg', () => {

  let user;

  before(done => {
    request('localhost:'+config.PORT)
    .post('/login')
    .set('Authorization', 'basic YW5raWhnOnRyMzNzcGx6')
    .end((err, res) => {
      expect(err).eql(null);
      expect(res.body).property('token');
      expect(res.body).property('data');
      expect(res.body.data.username).eql('ankihg')
      user = res.body.data;
      user.token = res.body.token;
      done();
    })
    //.set('Authorization', 'basic YW5raWhnOnRyMzNzcGx6')
    //.send({username:'ankihg', password:'tr33splz'})
  });

  it('get all users', done => {
    request('localhost:'+config.PORT)
    .get('/api/users')
    .set('token', user.token)
    .end((err, res) => {
      expect(err).eql(null);
      expect(res.body).property('data');
      done();
    });
  });

  describe('post pic of TRE-81816', () => {
    let filepath = '/Users/annikahagelin/Google\ Drive/Google\ Photos/2016/IMG_20160330_191514.jpg';
    let tree;

    before(done => {
      console.log('hi hi hi');
      Tree.findOne({cityID: 'TRE-10926'})
      .populate('species')
      .exec((err, tr) => {
        expect(err).eql(null);
        expect(tr).not.eql(undefined);
        tree = tr;
        done();
      });
    });

    it('should post photo of tree', done => {
      request('localhost:'+config.PORT)
      .post('/api/photos')
      .set('token', user.token)
      .send({filepath: filepath, tree: tree})
      .end((err, res) => {
        // expect(err).eql(null);
        // expect(res.body).propery('data');
        console.log(err);
        console.log(res.body);
        done();
      });
    });

  });




});
