
'use strict';

process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../src/app');

var expect = chai.expect;

chai.use(chaiHttp);

describe('Public', function() {
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
