'use strict';

process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../src/app');

var expect = chai.expect;

chai.use(chaiHttp);

describe('PUBLIC: get sample public dir file', function() {
    describe('/manifest.json', function() {
        it('responds with .json file', function(done) {
            chai.request(app)
                .get('/manifest.json')
                .end(function(err, res) {
                    expect(res).to.be.json;
                    done();
                });
        });
    });
});

describe('ROUTES: get non existent page', function() {
    describe('/mani.js', function() {
        it('responds with 404 status', function(done) {
            chai.request(app)
                .get('/mani.js')
                .end(function(err, res) {
                    expect(res).to.have.status(404);
                    done();
                });
        });
    });
});
