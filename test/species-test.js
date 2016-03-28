'use strict';

let chai = require('chai');
let chaiHttp = require('chai-http');
require(__dirname + '/../server.js');

chai.use(chaiHttp);
let request = chai.request;
let expect = chai.expect;

let speciesId;

let speciesJSON = {
  genus: 'big dogs',
  species: 'great dane',
  commonName: 'dog'
};

describe('test /species routes', () => {
  describe('GET /species/*', () => {
    before((done) => {
      request('localhost:3000')
        .post('/api/species')
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
      request('localhost:3000')
        .get('/api/species/' + speciesId)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.have.property('genus');
          expect(res.body).to.have.property('species');
          expect(res.body).to.have.property('commonName');
          expect(res.body.genus).to.equal('big dogs');
          expect(res.body.species).to.equal('great dane');
          expect(res.body.commonName).to.equal('dog');
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
    before((done) => {
      request('localhost:3000')
        .post('/api/species')
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
    before((done) => {
      request('localhost:3000')
        .post('/api/species')
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
      request('localhost:3000')
        .delete('/api/species/' + speciesId)
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