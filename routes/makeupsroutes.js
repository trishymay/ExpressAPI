'use strict';

var Makeup = require('../models/Makeup');
var eat_auth = require('../lib/eat_auth');
var bodyparser = require('body-parser');

module.exports = function(app, appSecret) {
  app.use(bodyparser.json());

  app.get('/makeups', eat_auth(appSecret), function(req, res) {
    Makeup.find({}, function(err, data) {
      console.log(req.body);
    // Makeup.find({user_id: req.user._id}, function(err, data) {
      if (err) return res.status(500).send({'msg': 'could not retrieve makeup'});

      res.json(data);
    });
  });

  app.post('/makeups', eat_auth(appSecret), function(req, res) {
    var newMakeup = new Makeup(req.body);
    newMakeup.save(function(err, makeup) {
      if (err) return res.status(500).send({'msg': 'could not save makeup'});

      res.json(makeup);
    });
  });

  app.put('/makeups/:id', eat_auth(appSecret), function(req, res) {
    var updatedMakeup = req.body;
    delete updatedMakeup._id;
    Makeup.update({_id: req.params.id}, updatedMakeup, function(err) {
      if (err) return res.status(500).send({'msg': 'could not update makeup'});

      res.json(req.body);
    });
  });

  app.delete('/makeups/:id', eat_auth(appSecret), function(req, res) {
    Makeup.remove({_id: req.params.id}, function(err) {
      if (err) return res.status(500).send({'msg': 'could not delete makeup'});

      res.json({msg: 'Makeup deleted'});
    });
  });
};