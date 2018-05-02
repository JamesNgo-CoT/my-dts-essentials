'use strict';

/* exported loadStyle */
var loadStyle = function () {
  var loaded = {};
  return function (url) {
    if (!loaded[url]) {
      $('head').append($('<link href="' + url + '" rel="stylesheet" type="text/css">'));
      loaded[url] = true;
    }
  };
}();

/* exported loadStyles */
var loadStyles = function loadStyles() {
  for (var _len = arguments.length, urls = Array(_len), _key = 0; _key < _len; _key++) {
    urls[_key] = arguments[_key];
  }

  for (var i = 0, l = urls.length; i < l; i++) {
    loadStyle(urls[i]);
  }
};