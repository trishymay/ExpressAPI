'use strict'

process.env.MONGO_URI = 'mongodb://localhost/makeup_test';
require('../server.js');
var mongoose = require('mongoose');
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

var expect = chai.expect

describe('makeup api end points and authentication', function() {
  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
    done();
    });
  });

  var token;
  it('should create a user and create a token', function(done) {
    chai.request('localhost:3000/api/v1')
    .post('/create_user')
    .send({email:'me@example.com',password:'2015'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('eat');
      token = res.body.eat;
      done();
    });
  });

  it('should give a fail message with an invalid token', function(done) {
    chai.request('localhost:3000/api/v1')
      .get('/makeups')
      .set('eat', 'bad')
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body).to.eql({ msg: 'could not authenticate' });
        done();
      });
  });

  it('should give a fail message with no token', function(done) {
    chai.request('localhost:3000/api/v1')
      .get('/makeups')
      .set('eat', null)
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body).to.eql({ msg: 'could not authenticate' });
        done();
      });
  });

  describe('already has data and a token', function() {
    var id;
    beforeEach(function(done) {
      chai.request('localhost:3000/api/v1')
        .post('/makeups')
        .set('eat', token)
        .send({brand: 'Givenchy'})
        .end(function(err, res) {
          id = res.body._id;
          done();
        });
    });

    it('should create a makeup with a valid token', function(done) {
      chai.request('localhost:3000/api/v1')
        .post('/makeups')
        .set('eat', token)
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

    it('should have an index with valid token', function(done) {
      chai.request('localhost:3000/api/v1')
        .get('/makeups')
        .set('eat', token)
        .end(function(err, res) {
          expect(err).to.eql(null);
          expect(Array.isArray(res.body)).to.be.true;
          expect(res.body[0]).to.have.property('brand');
          done();
        });
    });

    it('should be able to update a makeup with a valid token', function(done) {
      chai.request('localhost:3000/api/v1')
        .put('/makeups/' + id)
        .set('eat', token)
        .send({brand: 'New Brand'})
        .end(function(err, res) {
          expect(err).to.eql(null);
          expect(res.body.brand).to.eql('New Brand');
          done();
        });
    });

    it('should be able to delete a makeup with a valid token', function(done) {
      chai.request('localhost:3000/api/v1')
        .delete('/makeups/' + id)
        .set('eat', token)
        .end(function(err, res) {
          expect(err).to.eql(null);
          expect(res.body._id).to.eql(undefined);
          done();
        });
    });
  });
});