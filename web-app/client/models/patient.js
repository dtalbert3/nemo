var AmpersandModel = require('ampersand-model');

module.exports = AmpersandModel.extend({
  props: {
    id: 'any'
  },
  session: {
    selected: ['boolean', true, false]
  },
  derived: {

  }
});
