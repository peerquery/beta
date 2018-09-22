
'use strict';

process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../src/app');

var expect = chai.expect;

chai.use(chaiHttp);



describe('AUTH', function() {
    describe('/api/private/', function() {
        it('responds with status 401', function(done) {
            chai.request(app)
                .post('/api/private/')
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    done();
                });
        }); 
    });
});

describe('AUTH', function() {
    describe('/api/login', function() {
        it('responds with 401 status', function(done) {
            chai.request(app)
                .post('/api/login/test')
                .send({what: 'sample'})
                .end(function(err, res) {
                    expect(res).to.have.status(500);
                    done();
                });
        }); 
    });
});

describe('AUTH', function() {
    describe('/create/report', function() {
        it('responds with redirect to /login', function(done) {
            chai.request(app)
                .get('/create/report')
                .end(function(err, res) {
                    expect(res).to.redirect;
                    done();
                });
        }); 
    });
});

describe('AUTH', function() {
    describe('/logout', function() {
        it('responds with redirect to /', function(done) {
            chai.request(app)
                .get('/logout')
                .end(function(err, res) {
                    expect(res).to.redirect;
                    done();
                });
        }); 
    });
});

describe('AUTH', function() {
    describe('/api/private/', function() {
        it('responds with status 401', function(done) {
            chai.request(app)
                .post('/api/private/')
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    done();
                });
        }); 
    });
});

describe('AUTH', function() {
    describe('/api/private/auth', function() {
        it('responds with status 401', function(done) {
            chai.request(app)
                .get('/api/private/auth')
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    done();
                });
        }); 
    });
});
