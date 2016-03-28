'use strict';

let chai = require('chai');
let chaiHttp = require('chai-http');
require(__dirname + '/../server.js');
let config = require(__dirname + '/../config/env.js');

chai.use(chaiHttp);
let request = chai.request;
let expect = chai.expect;

let userId;

let userJSON = {
  username: 'jamielim',
  password: 'helloworld'
};

describe('test /users routes', () => {
  describe('GET /users/*', () => {
    before((done) => {
      request('localhost:' + config.PORT)
        .post('/api/users')
        .send(userJSON)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          userId = res.body._id;
          done();
        });
    });

    after((done) => {
      request('localhost:' + config.PORT)
        .delete('/api/users/' + userId)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          done();
        });
    });

    it('should respond to GET /users', (done) => {
      request('localhost:' + config.PORT)
        .get('/api/users')
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

    it('should respond to GET /users/:user', (done) => {
      request('localhost:' + config.PORT)
        .get('/api/users/' + userId)
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

  describe('POST /users', () => {
    after((done) => {
      request('localhost:' + config.PORT)
        .delete('/api/users/' + userId)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          done();
        });
    });

    it('should respond to POST /users', (done) => {
      request('localhost:' + config.PORT)
        .post('/api/users')
        .send(userJSON)
        .end((err, res) => {
          userId = res.body._id;
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

  describe('PUT /users', () => {
    before((done) => {
      request('localhost:' + config.PORT)
        .post('/api/users')
        .send(userJSON)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          userId = res.body._id;
          done();
        });
    });

    after((done) => {
      request('localhost:' + config.PORT)
        .delete('/api/users/' + userId)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          done();
        });
    });

    it('should respond to PUT /users/:user', (done) => {
      request('localhost:' + config.PORT)
        .put('/api/users/' + userId)
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

  describe('DELETE /users', () => {
    before((done) => {
      request('localhost:' + config.PORT)
        .post('/api/users')
        .send(userJSON)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          userId = res.body._id;
          done();
        });
    });

    before((done) => {
      request('localhost:' + config.PORT)
        .post('/login')
        .send(userJSON)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          console.log(res.body);
          done();
        });
    });

    it('should respond to DELETE /users/:user', (done) => {
      request('localhost:' + config.PORT)
        .delete('/api/users/' + userId)
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