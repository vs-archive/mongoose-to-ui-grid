'use strict';

var _ = require('lodash');

var utils = require('./utils');

module.exports = function (schema) {
  var columnDefs = utils.getPaths(schema, {});

  function toColumnsSchema(){
    return _.select(columnDefs, function(col){ return col.isCollumn !== false;});
  }

  function getUiGridColumnsProjection(){
    return _.pluck(columnDefs, 'field').join(' ');
  }

  console.log(toColumnsSchema());
  console.log(getUiGridColumnsProjection());
  schema.statics.getUiGridColumnProjection = getUiGridColumnsProjection;
  schema.statics.getUiGridColumnDefinition = toColumnsSchema;
  schema._uiGridProjection = toColumnsSchema();
};
