'use strict';

let chai = require('chai');
let chaiHttp = require('chai-http');
require(__dirname + '/../server.js');

chai.use(chaiHttp);
let request = chai.request;
let expect = chai.expect;

let speciesId;

let userJSON = {
  username: 'jamielim',
  password: 'helloworld'
};

describe('test /species routes', () => {
  describe('GET /species/*', () => {
    before((done) => {
      request('localhost:3000')
        .post('/api/species')
        .send(userJSON)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          speciesId = res.body._id;
          done();
        });
    });

    after((done) => {
      request('localhost:3000')
        .delete('/api/species/' + speciesId)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          done();
        });
    });

    it('should respond to GET /species', (done) => {
      request('localhost:3000')
        .get('/api/species')
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          let data = res.body.data;
          data = data[data.length - 1];
          expect(data).to.have.property('username');
          expect(data).to.have.property('password');
          expect(data.username).to.equal('jamielim');
          expect(data.password).to.not.equal(null);
          done();
        });
    });

    it('should respond to GET /species/:user', (done) => {
      request('localhost:3000')
        .get('/api/species/' + speciesId)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.have.property('username');
          expect(res.body).to.have.property('password');
          expect(res.body.username).to.equal('jamielim');
          expect(res.body.password).to.not.equal(null);
          done();
        });
    });
  });

  describe('POST /species', () => {
    after((done) => {
      request('localhost:3000')
        .delete('/api/species/' + speciesId)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          done();
        });
    });

    it('should respond to POST /species', (done) => {
      request('localhost:3000')
        .post('/api/species')
        .send(userJSON)
        .end((err, res) => {
          speciesId = res.body._id;
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.have.property('username');
          expect(res.body.username).to.be.equal('jamielim');
          expect(res.body).to.have.property('password');
          expect(res.body.password).to.not.equal(null);
          expect(res.body).to.have.property('_id');
          expect(res.body._id).to.not.equal(null);
          done();
        });
    });
  });

  describe('PUT /species', () => {
    before((done) => {
      request('localhost:3000')
        .post('/api/species')
        .send(userJSON)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          speciesId = res.body._id;
          done();
        });
    });

    after((done) => {
      request('localhost:3000')
        .delete('/api/species/' + speciesId)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          done();
        });
    });

    it('should respond to PUT /species/:user', (done) => {
      request('localhost:3000')
        .put('/api/species/' + speciesId)
        .send({password: 'mynewpassword'})
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.have.property('username');
          expect(res.body).to.have.property('password');
          expect(res.body.username).to.equal('jamielim');
          expect(res.body.password).to.not.equal(null);
          done();
        });
    });
  });

  describe('DELETE /species', () => {
    before((done) => {
      request('localhost:3000')
        .post('/api/species')
        .send(userJSON)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          speciesId = res.body._id;
          done();
        });
    });

    it('should respond to DELETE /species/:user', (done) => {
      request('localhost:3000')
        .delete('/api/species/' + speciesId)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body.message).to.be.equal('Deleted User');
          done();
        });
    });
  });
});