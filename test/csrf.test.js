
'use strict';

process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../src/app');

var expect = chai.expect;

chai.use(chaiHttp);

describe('CSRF: get request', function() {
    describe('/projects', function() {
        it('responds with _csrf && _xcsrf cookie', function(done) {
            chai.request(app)
                .get('/projects')
                .end(function(err, res) {
                    expect(res).to.have.cookie('_csrf');
                    expect(res).to.have.cookie('_xcsrf');
                    done();
                });
        });
    });
});

describe('CSRF: post request without csrf', function() {
    describe('localhost/api/private/create/project', function() {
        it('responds with status 401', function(done) {
            chai.request(app)
                .post('/api/private/create/project')
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    done();
                });
        });
    });
});

describe('CSRF: get request first; then post request to API base with CSRF', function() {
    describe('/api', function() {
        it('get request responds with _csrf && _xcsrf cookie, post request responds with status 200 and body "/post API functional" ', function() {
            chai.request(app)
                .get('/')
                .then(function(res) {
                    expect(res).to.have.cookie('_csrf');
                    expect(res).to.have.cookie('_xcsrf');
                    // The `agent` now has the _csrf and _xcsrf cookie saved, and will send it
                    // back to the server in the next request:
                    return chai.request(app)
                        .post('/api')
                        .set('cookie', res.headers['set-cookie'])   //important! send the csrf cookies here!!!
                        .then(function (res) {
                            expect(res).to.have.status(200);
                            expect(res.text).to.equal('"/post API functional"');
                        });
                });
            chai.request(app).close();
        });
    });
});
