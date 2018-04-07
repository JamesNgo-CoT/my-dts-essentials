"use strict";

/* global Promise */

var loadScript = function () {
  var loaded = {};
  return function (url) {
    if (!loaded[url]) {
      loaded[url] = new Promise(function (resolve, reject) {
        return $.getScript(url).then(function (data, textStatus, jqXHR) {
          return resolve(data);
        }, function (jqXHR, textStatus, errorThrown) {
          return reject(errorThrown);
        });
      });
    }
    return loaded[url] || Promise.reject();
  };
}();

/* exported loadScripts */
var loadScripts = function loadScripts() {
  for (var _len = arguments.length, urls = Array(_len), _key = 0; _key < _len; _key++) {
    urls[_key] = arguments[_key];
  }

  var loadPromises = [];
  for (var i = 0, l = urls.length; i < l; i++) {
    loadPromises.push(loadScript(urls[i]));
  }
  return Promise.all(loadPromises);
};