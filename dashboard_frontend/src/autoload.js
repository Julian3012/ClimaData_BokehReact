export const plotLoader = (root, plotId, sessionId) => {
  console.log("Autoload start for model: " + sessionId)
  function now() {
    return new Date();
  }

  var force = false;

  if (typeof root._bokeh_onload_callbacks === "undefined" || force === true) {
    root._bokeh_onload_callbacks = [];
    root._bokeh_is_loading = undefined;
  }


  function run_callbacks() {
    try {
      root._bokeh_onload_callbacks.forEach(function (callback) {
        if (callback != null)
          callback();
      });
    } finally {
      delete root._bokeh_onload_callbacks
    }
    console.debug("Bokeh: all callbacks have finished");
  }

  function load_libs(css_urls, js_urls, callback) {
    if (css_urls == null) css_urls = [];
    if (js_urls == null) js_urls = [];

    root._bokeh_onload_callbacks.push(callback);
    if (root._bokeh_is_loading > 0) {
      console.debug("Bokeh: BokehJS is being loaded, scheduling callback at", now());
      return null;
    }
    if (js_urls == null || js_urls.length === 0) {
      run_callbacks();
      return null;
    }
    console.debug("Bokeh: BokehJS not loaded, scheduling load and callback at", now());
    root._bokeh_is_loading = css_urls.length + js_urls.length;

    function on_load() {
      root._bokeh_is_loading--;
      if (root._bokeh_is_loading === 0) {
        console.debug("Bokeh: all BokehJS libraries/stylesheets loaded");
        run_callbacks()
      }
    }

    function on_error() {
      console.error("failed to load " + url);
    }

    for (var i = 0; i < css_urls.length; i++) {
      var url = css_urls[i];
      const element = document.createElement("link");
      element.onload = on_load;
      element.onerror = on_error;
      element.rel = "stylesheet";
      element.type = "text/css";
      element.href = url;
      console.debug("Bokeh: injecting link tag for BokehJS stylesheet: ", url);
      document.body.appendChild(element);
    }

    for (var i = 0; i < js_urls.length; i++) {
      var url = js_urls[i];
      var element = document.createElement('script');
      element.onload = on_load;
      element.onerror = on_error;
      element.async = false;
      element.src = url;
      console.debug("Bokeh: injecting script tag for BokehJS library: ", url);
      document.head.appendChild(element);
    }
  }; var element = document.getElementById(plotId);
  if (element == null) {
    console.error("Bokeh: ERROR: autoload.js configured with elementid " + plotId + " but no matching script tag was found. ")
    return false;
  }

  // function inject_raw_css(css) {
  //   const element = document.createElement("style");
  //   element.appendChild(document.createTextNode(css));
  //   document.body.appendChild(element);
  // }

  var js_urls = ["http://localhost:5010/static/js/bokeh.min.js?v=c6e430dae3b21eac93896aa0b6b43d3a", "http://localhost:5010/static/js/bokeh-widgets.min.js?v=6e6c2eb007d471426aeb6be7db849713", "http://localhost:5010/static/js/bokeh-tables.min.js?v=54b8dffc263336641f6399ab27ff5957", "http://localhost:5010/static/js/bokeh-gl.min.js?v=281a5558eb2e30de81d7f33d4aa5e1dc"];
  var css_urls = ["http://localhost:5010/static/css/bokeh.min.css?v=8fd4497fa606336ecf7914789df0ce04", "http://localhost:5010/static/css/bokeh-widgets.min.css?v=39c9e5a33345954077df1da16f43957a", "http://localhost:5010/static/css/bokeh-tables.min.css?v=69a9e725f277a6c569c9261b8ffe50eb"];

  var inline_js = [
    function (Bokeh) {
      Bokeh.set_log_level("info");
    },

    function (Bokeh) {

    },

    function (Bokeh) {
      (function () {
        var fn = function () {
          Bokeh.safely(function () {
            (function (root) {
              function embed_document(root) {

                var docs_json = 'null';
                var render_items = [{ "elementid": plotId, "sessionid": sessionId, "use_for_title": false }];
                root.Bokeh.embed.embed_items(docs_json, render_items, "/main_backend", "http://localhost:5010/main_backend");

              }
              if (root.Bokeh !== undefined) {
                embed_document(root);
              } else {
                var attempts = 0;
                var timer = setInterval(function (root) {
                  if (root.Bokeh !== undefined) {
                    embed_document(root);
                    clearInterval(timer);
                  }
                  attempts++;
                  if (attempts > 100) {
                    console.log("Bokeh: ERROR: Unable to run BokehJS code because BokehJS library is missing");
                    clearInterval(timer);
                  }
                }, 10, root)
              }
            })(window);
          });
        };
        if (document.readyState != "loading") fn();
        else document.addEventListener("DOMContentLoaded", fn);
      })();
    },
    function (Bokeh) { } // ensure no trailing comma for IE
  ];

  function run_inline_js() {

    for (var i = 0; i < inline_js.length; i++) {
      inline_js[i].call(root, root.Bokeh);
    }

  }

  if (root._bokeh_is_loading === 0) {
    console.debug("Bokeh: BokehJS loaded, going straight to plotting");
    run_inline_js();
  } else {
    load_libs(css_urls, js_urls, function () {
      console.debug("Bokeh: BokehJS plotting callback run at", now());
      run_inline_js();
    });
  }
}

export default plotLoader;