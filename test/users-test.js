'use strict';

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

describe('test /users routes', () => {
  describe('GET /users/*', () => {
    before((done) => {
      request('localhost:' + config.PORT)
        .post('/api/users')
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
          done();
        });
    });

    it('should respond to GET /users', (done) => {
      request('localhost:' + config.PORT)
        .get('/api/users')
        .set('token', userToken)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          let data = res.body.data;
          data = data[data.length - 1];
          expect(data).to.have.property('username');
          expect(data).to.have.property('password');
          expect(data.username).to.equal('treehuggers');
          expect(data.password).to.not.equal(null);
          done();
        });
    });

    it('should respond to GET /users/:user', (done) => {
      request('localhost:' + config.PORT)
        .get('/api/users/' + userId)
        .set('token', userToken)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.have.property('username');
          expect(res.body).to.have.property('password');
          expect(res.body.username).to.equal('treehuggers');
          expect(res.body.password).to.not.equal(null);
          done();
        });
    });
  });

  describe('POST /users', () => {
    after((done) => {
      request('localhost:' + config.PORT)
        .delete('/api/users/' + userId)
        .set('token', userToken)
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
  });

  describe('PUT /users', () => {
    before((done) => {
      request('localhost:' + config.PORT)
        .post('/api/users')
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
          done();
        });
    });

    it('should respond to PUT /users/:user', (done) => {
      request('localhost:' + config.PORT)
        .put('/api/users/' + userId)
        .set('token', userToken)
        .send({username: 'treehuggers2'})
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.have.property('username');
          expect(res.body).to.have.property('password');
          expect(res.body.username).to.equal('treehuggers2');
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

    it('should respond to DELETE /users/:user', (done) => {
      request('localhost:' + config.PORT)
        .delete('/api/users/' + userId)
        .set('token', userToken)
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