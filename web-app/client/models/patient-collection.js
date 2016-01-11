var Collection = require('ampersand-rest-collection');
var Patient = require('./patient');

module.exports = Collection.extend({
  model: Patient,
  url: '/api/patient'
});
