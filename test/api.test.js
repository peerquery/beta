
'use strict';

process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../src/app');

var expect = chai.expect;

chai.use(chaiHttp);

describe('API GET', function() {
    describe('/api/test', function() {
        it('responds with status 200', function(done) {
            chai.request(app)
                .get('/api/test')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });
});

describe('API', function() {
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
