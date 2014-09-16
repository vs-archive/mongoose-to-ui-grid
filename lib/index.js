'use strict';

var _ = require('lodash');

var utils = require('./utils');

module.exports = function (schema) {
  var columnDefs = utils.getPaths(schema, {});

  function toColumnsSchema(){
    return _.select(columnDefs, function(col){ return col.isCollumn !== false;});
  }

  function getUiGridColumnsProjection(config){
    if (config && config.filter) {
      columnDefs = _.select(utils.getPaths(schema, {}), function(el) {return el.filter === config.filter || el.field === '_id';});
    }

    return _.pluck(columnDefs, 'field').join(' ');
  }

  schema.statics.getUiGridColumnProjection = getUiGridColumnsProjection;
  schema.statics.getUiGridColumnDefinition = toColumnsSchema;
  schema._uiGridProjection = toColumnsSchema();
};