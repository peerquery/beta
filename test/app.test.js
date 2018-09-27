'use strict';

process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../src/app');

var expect = chai.expect;

chai.use(chaiHttp);

describe('APP: get request to server', function() {
    describe('/', function() {
        it('responds with status 200', function(done) {
            chai.request(app)
                .get('/')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });
});

describe('APP: get request to sitemap', function() {
    describe('/sitemap.xml', function() {
        it('responds with redirect', function(done) {
            chai.request(app)
                .get('/sitemap.xml')
                .end(function(err, res) {
                    expect(res).to.redirect;
                    done();
                });
        });
    });
});

describe('APP: get request to sitemap_index', function() {
    describe('/sitemap_index.xml', function() {
        it('responds with status 200 and xml content-type', function(done) {
            chai.request(app)
                .get('/sitemap_index.xml')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res).to.have.header(
                        'content-type',
                        'application/xml'
                    );
                    done();
                });
        });
    });
});

describe('APP: get request to robots.txt', function() {
    describe('/robots.txt', function() {
        it('responds with text file', function(done) {
            chai.request(app)
                .get('/robots.txt')
                .end(function(err, res) {
                    expect(res).to.be.text;
                    done();
                });
        });
    });
});
