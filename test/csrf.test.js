
'use strict';

process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../src/app');

var expect = chai.expect;

chai.use(chaiHttp);

describe('CSRF', function() {
    describe('/projects', function() {
        it('responds with _csrf && _xcsrf cookie', function(done) {
            chai.request(app)
                .get('/ptojects')
                .end(function(err, res) {
                    expect(res).to.have.cookie('_csrf');
                    expect(res).to.have.cookie('_xcsrf');
                    done();
                });
        });
    });
});


describe('CSRF', function() {
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
