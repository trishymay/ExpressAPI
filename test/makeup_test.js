'use strict'

process.env.MONGO_URI = 'mongodb://localhost/makeup_test';
require('../server.js');
var mongoose = require('mongoose');
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

var expect = chai.expect

describe('makeup api end points', function() {
  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
    done();
    });
  });

  it('should respond to a post request', function(done) {
    chai.request('localhost:3000/api/v1')
      .post('/makeups')
      .send({brand: 'Dior', type: 'lipstick', name: 'Dior Addict Lipstick', color: 'Stiletto'})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body).to.have.property('_id');
        expect(res.body.brand).to.eql('Dior');
        expect(res.body.type).to.eql('lipstick');
        expect(res.body.name).to.eql('Dior Addict Lipstick');
        expect(res.body.color).to.eql('Stiletto');
        done();
      });
  });

  describe('already has data in database', function() {
    var id;
    beforeEach(function(done) {
      chai.request('localhost:3000/api/v1')
        .post('/makeups')
        .send({brand: 'Givenchy'})
        .end(function(err, res) {
          id = res.body._id;
          done();
        });
    });

    it('should have an index', function(done) {
      chai.request('localhost:3000/api/v1')
        .get('/makeups')
        .end(function(err, res) {
          expect(err).to.eql(null);
          expect(Array.isArray(res.body)).to.be.true;
          expect(res.body[0]).to.have.property('brand');
          done();
        });
    });

    it('should be able to update a makeup', function(done) {
      chai.request('localhost:3000/api/v1')
        .put('/makeups/' + id)
        .send({brand: 'New Brand'})
        .end(function(err, res) {
          expect(err).to.eql(null);
          expect(res.body.brand).to.eql('New Brand');
          done();
        });
    });

    it('should be able to delete a makeup', function(done) {
      chai.request('localhost:3000/api/v1')
        .delete('/makeups/' + id)
        .end(function(err, res) {
          expect(err).to.eql(null);
          expect(res.body._id).to.eql(undefined);
          done();
        });
    });
  });
});