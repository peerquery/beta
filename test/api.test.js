
'use strict';

process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../src/app');

var expect = chai.expect;

chai.use(chaiHttp);

describe('API: get request API base', function() {
    describe('/api', function() {
        it('responds with status 200 and body "/get API functional" ', function(done) {
            chai.request(app)
                .get('/api')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.text).to.equal('"/get API functional"');
                    done();
                });
        });
    });
});
