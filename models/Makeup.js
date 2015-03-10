'use strict';

var mongoose = require('mongoose');

var makeupSchema = new mongoose.Schema({
  brand: String,
  type: String,
  name: String,
  color: String
});

module.exports = mongoose.model('Makeup', makeupSchema);