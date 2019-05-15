// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"roomba_custom.js":[function(require,module,exports) {
var searchClient = algoliasearch('0M6I92SH9L', '95c5542bd91e15ab39092e87e3785987'); // const search = instantsearch({
//   indexName: 'articles_raw',
//   searchClient,
// });
// search.addWidget(
//   instantsearch.widgets.searchBox({
//     container: '#searchbox',
//   })
// );
// search.addWidget(
//   instantsearch.widgets.hits({
//     container: '#hits',
//   })
// );
// search.start();

var articlesearch = instantsearch({
  searchClient: searchClient,
  indexName: 'ARTICLES',
  routing: false,
  searchParameters: {
    hitsPerPage: 3,
    attributesToSnippet: ['content:100'],
    snippetEllipsisText: " [...]"
  },
  searchFunction: function searchFunction(helper) {
    var query = articlesearch.helper.state.query;
    setTimeout(function () {
      videosearch.helper.setQuery(query);
      videosearch.helper.search();
      helper.search();
    }, 500);
  }
});
articlesearch.addWidget(instantsearch.widgets.searchBox({
  placeholder: 'Search for articles or videos',
  container: '#searchbox',
  autoFocus: false,
  showSubmit: false,
  showReset: true
}));
articlesearch.addWidget(instantsearch.widgets.stats({
  container: '#article-stats',
  templates: {
    text: "\n            Articles (\n              {{#hasNoResults}}No results{{/hasNoResults}}\n              {{#hasOneResult}}1 result{{/hasOneResult}}\n              {{#hasManyResults}}{{#helpers.formatNumber}}{{nbHits}}{{/helpers.formatNumber}}{{/hasManyResults}})\n            "
  }
}));
var videosearch = instantsearch({
  searchClient: searchClient,
  indexName: 'VIDEOS',
  routing: false,
  searchParameters: {
    hitsPerPage: 4,
    attributesToSnippet: ['content:10']
  }
});
articlesearch.addWidget(instantsearch.widgets.hits({
  container: '#articles',
  templates: {
    item: articleTemplate
  }
}));
videosearch.addWidget(instantsearch.widgets.hits({
  container: '#videos',
  templates: {
    item: videoTemplate
  }
}));
videosearch.addWidget(instantsearch.widgets.stats({
  container: '#video-stats',
  templates: {
    text: "\n            Videos  (\n              {{#hasNoResults}}No results{{/hasNoResults}}\n              {{#hasOneResult}}1 result{{/hasOneResult}}\n              {{#hasManyResults}}{{#helpers.formatNumber}}{{nbHits}}{{/helpers.formatNumber}}{{/hasManyResults}})\n            "
  }
}));
articlesearch.start();
videosearch.start();

function articleTemplate(hit) {
  return "\n    <div class=\"result\">\n        <div class=\"result__category\"></div>\n        <div class=\"result__image\">\n            <a\n                href=".concat(hit.path, "><img\n                    src=").concat(hit.thumbnail.image.uri, "\n                    alt=").concat(hit.title, "></a>\n        </div>\n        <div class=\"result__text\">\n            <div class=\"result__text__title\"><a\n                    href=").concat(hit.path, ">").concat(hit._highlightResult.title.value, "</a></div>\n            <span class=\"result__text__teaser\">").concat(hit._highlightResult.summary.value, "</span>\n            <span class=\"result__text__tag\">").concat(hit.tag, "</span>\n        </div>\n        </div>\n    ");
}

function videoTemplate(hit) {
  return "\n    <div class=\"result\">\n        <div class=\"result__image\">\n            <a\n                href=".concat(hit.path, "><img\n                    src=").concat(hit.thumbnail.image.uri, "\n                    alt=").concat(hit.title, "></a>\n        </div>\n        <div class=\"result__text\">\n            <div class=\"result__text__title\"><a\n                    href={hit.full_url}>").concat(hit._highlightResult.title.value, "</a></div>\n            <span class=\"result__text__teaser\">").concat(hit._highlightResult.body.value, "</span>\n            <span class=\"result__text__tag\">").concat(hit.tag, "</span>\n        </div>\n    </div>\n    ");
}
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50126" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","roomba_custom.js"], null)
//# sourceMappingURL=/roomba_custom.bcf062fa.js.map