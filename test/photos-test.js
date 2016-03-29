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
const Photo = models.Photo;
