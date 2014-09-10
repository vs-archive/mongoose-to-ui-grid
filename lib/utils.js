'use strict';
var _ = require('lodash');

function UiGridOptions(obj) {
  _.merge(this, obj)
}

function MongooseUtils() {
}

function toUiGridColumnDef(pathes, parent) {
  var self = this;
  if (parent && !Array.isArray(parent)) {
    parent = [parent];
  }

  var mix = _.map(pathes, function (uiGridOptions, path) {
    if (uiGridOptions instanceof UiGridOptions) {
      if (parent && parent.length) {
        return _.merge(uiGridOptions, {field: [parent.join('.'), path].join('.')});
      }

      return _.merge(uiGridOptions, {field: path});
    }

    return toUiGridColumnDef(uiGridOptions, path);
  });

  if (parent) {
    return mix;
  }

  return _.flatten(mix);
}

/**
 * Returns an array with ui grid column options
 * @param schema - mongoose schema for collection
 * @param options - call options
 * @returns {*}
 */
MongooseUtils.prototype.getPaths = function getPaths(schema, options) {
  var self = this;
  var paths = _.reduce(schema.paths, function (result, pathSchema, path) {

    // Nested schema OR Array can no be a column
    if (pathSchema.schema || Array.isArray(pathSchema.options.type)) {
      if (self.include(pathSchema.schema) ||
        (!!pathSchema.options.type[0] && self.include(pathSchema.options.type[0]))){
        var msg = 'Nested schema or Array can not be a column in ui-grid! Path: ' + path;
        throw new Error(msg)
      }

      return result;
    }

    var valIncl = self.include(pathSchema);
    if (valIncl) {
      result[path] = valIncl;
    }

    return result;
  }, {});

  // include _id field by default
  if (!paths._id) {
    paths._id = new UiGridOptions({visible: false});
  }

  return toUiGridColumnDef(paths);
};

/**
 * Returns true for private fields
 * @param pathSchema - mongoose schema for path
 * @param path - path name
 * @param options - call options
 * @returns {Object}
 */
MongooseUtils.prototype.include = function include(pathSchema) {
  return !!pathSchema.options.uiGrid ? new UiGridOptions(pathSchema.options.uiGrid) : null;
};

module.exports = new MongooseUtils();