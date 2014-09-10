'use strict';

var _ = require('lodash');

var utils = require('./utils');

module.exports = function (schema) {
  var paths = utils.getPaths(schema, {});

  function toColumnsSchema(){
    return paths;
  }

  function getUiGridColumnsProjection(){
    return _.pluck(paths, 'field')
  }

  schema.statics.getUiGridColumnProjection = getUiGridColumnsProjection;
  schema.statics.getUiGridColumnDefinition = toColumnsSchema;
  schema._uiGridProjection = toColumnsSchema();
};
