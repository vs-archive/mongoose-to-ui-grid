'use strict';

var _ = require('lodash');
var MongooseSchemaUtils = require('mongoose-schema-utils');

module.exports = function (schema) {
  var utils = new MongooseSchemaUtils(schema);
  var columns = [];
  _.reduce(utils.flatSchema, function(result, schema, path){
    if (schema.uiGrid || path === '_id'){
      var obj = _.merge({field: path}, schema, schema.uiGrid);
      delete obj.uiGrid;
      if (path === '_id'){
        obj.visible = false;
      }

      columns.push(obj);
    }
    return result;
  });

  function toColumnsSchema(){
    return _.select(columns, function(col){ return col.isCollumn !== false;});
  }

  function getUiGridColumnsProjection(config){
    var filteredColumns = columns;
    if (config && config.filter) {
      filteredColumns = _.select(columns, function(el) {return el.filter === config.filter || el.field === '_id';});
    }

    return _.pluck(filteredColumns, 'field').join(' ');
  }

  schema.statics.getUiGridColumnProjection = getUiGridColumnsProjection;
  schema.statics.getUiGridColumnDefinition = toColumnsSchema;
  schema._uiGridProjection = toColumnsSchema();
};