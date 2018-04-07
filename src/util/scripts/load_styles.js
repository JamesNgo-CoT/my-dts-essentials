const loadStyle = (() => {
  const loaded = {};
  return (url) => {
    if (!loaded[url]) {
      $('head').append($('<link href="' + url + '" rel="stylesheet" type="text/css">'));
      loaded[url] = true;
    }
  }
})();

/* exported loadStyles */
const loadStyles = (...urls) => {
  for (let i = 0, l = urls.length; i < l; i++) {
    loadStyle(urls[i]);
  }
};
