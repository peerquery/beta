'use strict';

process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../src/app');

var expect = chai.expect;

chai.use(chaiHttp);

describe('AUTH: unauthorized post request to private API', function() {
    describe('/api/private', function() {
        it('responds with status 401', function(done) {
            chai.request(app)
                .post('/api/private')
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    done();
                });
        });
    });
});

describe('AUTH: post invalid data to login API', function() {
    describe('/api/login', function() {
        it('responds with 500 status and body "sorry, error processing login" ', function() {
            chai.request(app)
                .get('/login')
                .then(function(res) {
                    expect(res).to.have.cookie('_csrf');
                    expect(res).to.have.cookie('_xcsrf');
                    // The `agent` now has the _csrf and _xcsrf cookie saved, and will send it
                    // back to the server in the next request:
                    return chai
                        .request(app)
                        .post('/api/login')
                        .set('cookie', res.headers['set-cookie']) //important! send the csrf cookies here!!!
                        .then(function(res) {
                            expect(res).to.have.status(500);
                            expect(res.test).to.equal(
                                '"sorry, error processing login"'
                            );
                        });
                });
            chai.request(app).close();
        });
    });
});

describe('AUTH: get request to route a restricted to logged-in users', function() {
    describe('/create/report', function() {
        it('responds with redirect', function(done) {
            chai.request(app)
                .get('/create/report')
                .end(function(err, res) {
                    expect(res).to.redirect;
                    done();
                });
        });
    });
});

describe('AUTH: get request to logout route', function() {
    describe('/logout', function() {
        it('responds with redirect', function(done) {
            chai.request(app)
                .get('/logout')
                .end(function(err, res) {
                    expect(res).to.redirect;
                    done();
                });
        });
    });
});

describe('AUTH: post request to private API without auth', function() {
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

describe('AUTH: get request to private API without auth', function() {
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
