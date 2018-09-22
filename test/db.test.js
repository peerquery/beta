
'use strict';

process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../src/app');

var expect = chai.expect;

chai.use(chaiHttp);

describe('DB', function() {
    describe('/api/private/projects/list', function() {
        it('responds with status 401', function(done) {
            chai.request(app)
                .get('/api/private/projects/list')
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    done();
                });
        });
    });
});

describe('DB', function() {
    describe('/api/test/data', function() {
        it('responds with status 200 && json', function() {
            return chai.request(app)
                .get('/api/test/data')           
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                })
                .catch(function (err) {
                    throw err;
                });
        }); 
    });
});
