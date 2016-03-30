'use strict';

let chai = require('chai');
let chaiHttp = require('chai-http');
require(__dirname + '/../server.js');
let config = require(__dirname + '/../config/env.js');

chai.use(chaiHttp);
let request = chai.request;
let expect = chai.expect;

let speciesJSON = {
  genus: 'big dogs',
  species: 'great dane',
  commonName: 'dog'
};

let userId;
let userToken;

let userJSON = {
  username: 'treehuggers',
  password: 'treelovers'
};

describe('test /species routes', () => {
  before((done) => {
    request('localhost:' + config.PORT)
      .post('/signup')
      .send(userJSON)
      .end((err, res) => {
        userId = res.body.user._id;
        userToken = res.body.token;
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.property('token');
        expect(res.body.user).to.have.property('username');
        expect(res.body.user).to.have.property('password');
        expect(res.body.token).to.not.equal(null);
        expect(res.body.user.username).to.equal('treehuggers');
        expect(res.body.user.password).to.not.equal(null);
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
        expect(res.body.user).to.have.property('_id');
        expect(res.body.user).to.have.property('username');
        expect(res.body.user).to.have.property('password');
        expect(res.body.message).to.equal('Deleted User');
        expect(res.body._id).to.not.equal(null);
        expect(res.body.user.username).to.equal('treehuggers');
        expect(res.body.user.password).to.not.equal(null);
        done();
      });
  });

  describe('GET /species/*', () => {
    let speciesId;
    before((done) => {
      request('localhost:' + config.PORT)
        .post('/api/species')
        .set('token', userToken)
        .send(speciesJSON)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          speciesId = res.body._id;
          done();
        });
    });

    after((done) => {
      request('localhost:' + config.PORT)
        .delete('/api/species/' + speciesId)
        .set('token', userToken)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          done();
        });
    });

    it('should respond to GET /species', (done) => {
      request('localhost:' + config.PORT)
        .get('/api/species')
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          let data = res.body.data;
          data = data[data.length - 1];
          expect(data).to.have.property('genus');
          expect(data).to.have.property('species');
          expect(data).to.have.property('commonName');
          expect(data.genus).to.equal('big dogs');
          expect(data.species).to.equal('great dane');
          expect(data.commonName).to.equal('dog');
          done();
        });
    });

    it('should respond to GET /species/:user', (done) => {
      request('localhost:' + config.PORT)
        .get('/api/species/' + speciesId)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.have.property('wiki');
          expect(res.body).to.have.property('founditem');
          expect(res.body.wiki).to.have.string('Great Dane');
          done();
        });
    });
  });


  describe('POST /species', () => {
    let speciesId;
    after((done) => {
      request('localhost:' + config.PORT)
        .delete('/api/species/' + speciesId)
        .set('token', userToken)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          done();
        });
    });

    it('should respond to POST /species', (done) => {
      request('localhost:' + config.PORT)
        .post('/api/species')
        .set('token', userToken)
        .send(speciesJSON)
        .end((err, res) => {
          speciesId = res.body._id;
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.have.property('genus');
          expect(res.body).to.have.property('species');
          expect(res.body).to.have.property('commonName');
          expect(res.body.genus).to.equal('big dogs');
          expect(res.body.species).to.equal('great dane');
          expect(res.body.commonName).to.equal('dog');
          expect(res.body._id).to.not.equal(null);
          done();
        });
    });
  });

  describe('PUT /species', () => {
    let speciesId;
    before((done) => {
      request('localhost:' + config.PORT)
        .post('/api/species')
        .set('token', userToken)
        .send(speciesJSON)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          speciesId = res.body._id;
          done();
        });
    });

    after((done) => {
      request('localhost:' + config.PORT)
        .delete('/api/species/' + speciesId)
        .set('token', userToken)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          done();
        });
    });

    it('should respond to PUT /species/:user', (done) => {
      request('localhost:' + config.PORT)
        .put('/api/species/' + speciesId)
        .set('token', userToken)
        .send({species: 'poodle'})
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.have.property('genus');
          expect(res.body).to.have.property('species');
          expect(res.body).to.have.property('commonName');
          expect(res.body.genus).to.equal('big dogs');
          expect(res.body.species).to.equal('poodle');
          expect(res.body.commonName).to.equal('dog');
          done();
        });
    });
  });

  describe('DELETE /species', () => {
    let speciesId;
    before((done) => {
      request('localhost:' + config.PORT)
        .post('/api/species')
        .set('token', userToken)
        .send(speciesJSON)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          speciesId = res.body._id;
          done();
        });
    });

    it('should respond to DELETE /species/:user', (done) => {
      request('localhost:' + config.PORT)
        .delete('/api/species/' + speciesId)
        .set('token', userToken)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body.message).to.be.equal('Deleted Species');
          done();
        });
    });
  });
});
