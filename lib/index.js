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
    if (!options || !options.config){
      return columns;
    }

    return _.select(columns, function(el) {
        return !!el.filter || // always include fields without filter
          el.filter === options.filter || // filter out
          el.field === '_id'; // always include _id field
    });
  }

  schema.statics.populateUiGridColumns = populateUiGridColumns;
  schema.statics.getUiGridColumnProjection = getUiGridColumnsProjection;
  schema.statics.getUiGridColumnDefinition = toColumnsSchema;
  schema._uiGridProjection = toColumnsSchema();
};