'use strict';

var _ = require('lodash');
var MongooseSchemaUtils = require('mongoose-schema-utils');

module.exports = function (schema) {
  var utils = new MongooseSchemaUtils(schema);
  var columns = [];

  _.each(utils.flatSchema, function(schema, path){
    if (schema.uiGrid || path === '_id'){
      var obj = _.merge({field: path}, schema);

      var uiGrid = schema.uiGrid;
      //delete obj.uiGrid;

      if (path === '_id'){
        obj.visible = false;
      }

      if (schema.ref) {
        uiGrid = Array.isArray(uiGrid) ? uiGrid : [uiGrid];
        _.forEach(uiGrid, function(uig){
          var p = [obj.field, uig.field].join('.');
          var o = _.merge({},obj, uig, {field: p, refField: obj.field});
          columns.push(o);
        });
        return ;
      }

      _.merge(obj, uiGrid);
      columns.push(obj);
    }
  });

  columns = _.sortBy(columns, 'order');

  function toColumnsSchema(config){
    var filteredColumns = filterColumns(columns, config);
    return _.select(filteredColumns, function(col){ return col.isCollumn !== false;});
  }

  function getUiGridColumnsProjection(config){
    var filteredColumns = filterColumns(columns, config);
    return _.map(filteredColumns, function (c){ return c.refField || c.field; })
      .join(' ');
  }

  function populateUiGridColumns (mq, config){
    var filteredColumns = filterColumns(columns, config);
    _.each(filteredColumns, function(schema){
      if (schema.ref){
        var uig = Array.isArray(schema.uiGrid) ? schema.uiGrid : [schema.uiGrid];
        var fields = _.pluck(uig, 'field').join(' ');
        mq.populate(schema.refField, fields);
      }
    });
    return mq;
  }

  function filterColumns(columns, options){
    if (!options || !options.choose){
      return columns;
    }

    return _.select(columns, function(el) {
      // always include _id field
      if (el.field === '_id'){
        return true;
      }

      // always include fields without filter
      if (el.enabled === false){
        return false;
      }

      // filter out
      return  Array.isArray(el.enabled) ?
      el.enabled.indexOf(options.choose) !== -1 :
      el.enabled === options.choose;
    });
  }

  schema.statics.populateUiGridColumns = populateUiGridColumns;
  schema.statics.getUiGridColumnProjection = getUiGridColumnsProjection;
  schema.statics.getUiGridColumnDefinition = toColumnsSchema;
  schema._uiGridProjection = toColumnsSchema();
};