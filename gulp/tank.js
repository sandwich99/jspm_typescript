/* global Map */
'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

// file can be a vinyl file object or a string
// when a string it will construct a new one
var plugin = function(name, opt) {

  if (!name) {
    throw new PluginError('gulp-tank', 'Missing name option for gulp-tank');
  }
  opt = opt || {};

  if (!plugin.caches[name]) {
    plugin.caches[name] = new Map();
  }

  var cachedParts = plugin.caches[name];

  function bufferContents(file, enc, cb) {
    // ignore empty files
    if (file.isNull()) {
      cb();
      return;
    }

    // we don't do streams (yet)
    if (file.isStream()) {
      this.emit('error', new PluginError('gulp-tank',  'Streaming not supported'));
      cb();
      return;
    }

    cachedParts.set(file.path, file);

    cb();
  }

  function endStream(cb) {

    for(var file of cachedParts.values()) {
      this.push(file);
    }

    cb();
  }

  return through.obj(bufferContents, endStream);
};


plugin.caches = {};


module.exports = plugin;