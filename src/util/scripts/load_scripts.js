
const loadScript = (() => {
  const loaded = {};
  return (url) => {
    if (!loaded[url]) {
      loaded[url] = new Promise((resolve, reject) => $.getScript(url).then((data, textStatus, jqXHR) => resolve(data), (jqXHR, textStatus, errorThrown) => reject(errorThrown)));
    }
    return loaded[url] || Promise.reject();
  }
})();

/* exported loadScripts */
const loadScripts = (...urls) => {
  const loadPromises = [];
  for (let i = 0, l = urls.length; i < l; i++) {
    loadPromises.push(loadScript(urls[i]));
  }
  return Promise.all(loadPromises);
}
