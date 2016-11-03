/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	__webpack_require__(2);

	var _panel = __webpack_require__(68);

	var _app = __webpack_require__(71);

	var _app2 = _interopRequireDefault(_app);

	__webpack_require__(72);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var objToQueryString = function objToQueryString(params) {
	  return Object.keys(params).map(function (k) {
	    return [k, encodeURIComponent(params[k])].join('=');
	  }).join('&');
	};

	var API = {
	  get: function get(endpoint) {
	    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	    var secret = arguments[2];

	    return fetch('https://mixpanel.com/api/2.0/' + endpoint + '?' + objToQueryString(params), {
	      headers: {
	        'Authorization': 'Basic ' + btoa(secret)
	      },
	      method: 'GET'
	    }).then(function (response) {
	      if (response.status < 400 || response.body) {
	        return response.json();
	      } else {
	        return { error: response.statusText };
	      }
	    });
	  }
	};

	document.registerElement('quixpanel-app', function (_Component) {
	  _inherits(_class, _Component);

	  function _class() {
	    _classCallCheck(this, _class);

	    return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
	  }

	  _createClass(_class, [{
	    key: 'start',
	    value: function start() {}
	  }, {
	    key: 'executeQuery',
	    value: function executeQuery() {
	      var _this2 = this;

	      API.get('segmentation', {
	        event: this.state.event,
	        type: this.state.type,
	        limit: '150',
	        on: this.state.on,
	        where: this.state.where,
	        from_date: this.state.from_date,
	        to_date: this.state.to_date,
	        unit: this.state.unit
	      }, this.state.apiSecret).then(function (response) {
	        console.log(JSON.stringify(response));
	        var COLORS = ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a'];
	        var vals = response.data.values;
	        var data = [];
	        var i = 0;
	        for (var segment in vals) {
	          i++;
	          var values = Object.keys(vals[segment]).map(function (key) {
	            return {
	              x: new Date(key),
	              y: vals[segment][key]
	            };
	          });
	          values.sort(function (a, b) {
	            return a.x - b.x;
	          });
	          data.push({
	            values: values,
	            key: segment,
	            color: COLORS[i % COLORS.length]
	          });
	        }
	        console.log(JSON.stringify(data));
	        _this2.renderChart(data);
	      });
	    }
	  }, {
	    key: 'renderChart',
	    value: function renderChart(data) {
	      var _this3 = this;

	      var chart;
	      nv.addGraph(function () {
	        chart = nv.models.lineChart().options({
	          duration: 300,
	          useInteractiveGuideline: true
	        });
	        chart.xAxis.axisLabel("Date").tickFormat(function (d) {
	          return d3.time.format('%b %d')(new Date(d));
	        });
	        chart.yAxis.axisLabel('Event count').tickFormat(function (d) {
	          if (d == null) {
	            return 'N/A';
	          }
	          return d3.format(',.2f')(d);
	        });

	        _this3.chartData = _this3.chartData || d3.select('#chart').append('svg').datum(data);

	        _this3.chartData.datum(data).call(chart);

	        nv.utils.windowResize(chart.update);

	        return chart;
	      });
	    }
	  }, {
	    key: 'config',
	    get: function get() {
	      var _this4 = this;

	      return {
	        defaultState: {
	          apiSecret: '249fc2b7bca76856d10c13d950e14d67',
	          event: 'Viewed report',
	          where: 'defined(user["Platforms integrated updated"])',
	          on: 'defined(user["Current tally"])',
	          from_date: '2012-01-01',
	          to_date: '2016-10-18',
	          unit: 'month',
	          type: 'unique'
	        },

	        helpers: {
	          apiSecretChanged: function apiSecretChanged(e) {
	            _this4.update({ apiSecret: document.querySelector('#apiSecretInput').value });
	            _this4.executeQuery();
	          },
	          eventChanged: function eventChanged(e) {
	            _this4.update({ event: document.querySelector('#eventInput').value });
	            _this4.executeQuery();
	          },
	          filterChanged: function filterChanged(e) {
	            _this4.update({ where: document.querySelector('#filterInput').value });
	            _this4.executeQuery();
	          },
	          segmentChanged: function segmentChanged(e) {
	            _this4.update({ on: document.querySelector('#segmentInput').value });
	            _this4.executeQuery();
	          }
	        },

	        template: _app2.default
	      };
	    }
	  }]);

	  return _class;
	}(_panel.Component));

	var app = document.createElement('quixpanel-app');
	document.body.appendChild(app);
	app.start();

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(3);

	__webpack_require__(59);

	__webpack_require__(55);

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(4);

	__webpack_require__(52);

	__webpack_require__(54);

	__webpack_require__(57);

	__webpack_require__(58);

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _panel = __webpack_require__(5);

	var _registration = __webpack_require__(50);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	'use strict';

	var template = function render(locals) {
	  locals = locals || {};;;var result_of_with = function ($component, $helpers, document) {
	    var h = __webpack_require__(51);function generateLiteralWidget(id, contents) {
	      function LiteralWidget(id, contents) {
	        this.name = 'LiteralWidget';
	        this.id = id;this.contents = contents;
	      }LiteralWidget.prototype.type = 'Widget';
	      LiteralWidget.prototype.init = function () {
	        var wrapper = document.createElement('div');wrapper.innerHTML = this.contents;var root;if (wrapper.childNodes.length === 1) {
	          root = wrapper.firstChild;
	        } else {
	          root = wrapper;
	        }return root;
	      };LiteralWidget.prototype.update = function (previous, domNode) {
	        return domNode;
	      }; // 'render' is called by the vdom-to-html module which is used in the unit tests
	      LiteralWidget.prototype.render = function () {
	        var h = __webpack_require__(51);var host = document.createElement('div');host.appendChild(this.init());
	        return h('text', host.innerHTML);
	      };return new LiteralWidget(id, contents);
	    };return { value: h("div", { "attributes": $helpers.getButtonAttrs(), "className": [].concat('mp-button-container ' + $component.className + '').filter(Boolean).join(' ') }, [h("div", { "className": [].concat('mp-button-text').filter(Boolean).join(' ') }, function () {
	        var __jade_nodes = [];__jade_nodes = __jade_nodes.concat(h("content"));__jade_nodes = __jade_nodes.concat($component.isAttributeEnabled('arrow-next') ? h("div", { "className": [].concat('mp-button-arrow-next').filter(Boolean).join(' ') }, [generateLiteralWidget(0, '<?xml version="1.0" encoding="utf-8"?><!-- Generator: Adobe Illustrator 19.2.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 14 10.5" style="enable-background:new 0 0 14 10.5;" xml:space="preserve"><style type="text/css">	.st0{fill:#D8E0E7;}</style><path class="st0" d="M13,6.2H1c-0.5,0-1-0.4-1-1v0c0-0.5,0.4-1,1-1h12c0.5,0,1,0.4,1,1v0C14,5.8,13.6,6.2,13,6.2z"/><path class="st0" d="M12.3,5.9L8.1,1.7c-0.4-0.4-0.4-1,0-1.4l0,0c0.4-0.4,1-0.4,1.4,0l4.2,4.2c0.4,0.4,0.4,1,0,1.4l0,0	C13.3,6.3,12.7,6.3,12.3,5.9z"/><path class="st0" d="M12.3,4.5L8.1,8.8c-0.4,0.4-0.4,1,0,1.4l0,0c0.4,0.4,1,0.4,1.4,0l4.2-4.2c0.4-0.4,0.4-1,0-1.4l0,0	C13.3,4.1,12.7,4.1,12.3,4.5z"/></svg>')].filter(Boolean)) : undefined);;return __jade_nodes;
	      }.call(this).filter(Boolean))].filter(Boolean)) };
	  }.call(this, "$component" in locals ? locals.$component : typeof $component !== "undefined" ? $component : undefined, "$helpers" in locals ? locals.$helpers : typeof $helpers !== "undefined" ? $helpers : undefined, "document" in locals ? locals.document : typeof document !== "undefined" ? document : undefined);if (result_of_with) return result_of_with.value;
	};var css = 'a {   cursor: pointer;   text-decoration: none; } a, a:visited {   color: #3b99f0; } a:hover {   color: #4ba8ff; } .mp-font-title {   font-family: \'Proxima Nova\', \'proxima-nova\', sans-serif;   font-size: 18px;   font-weight: 700;   line-height: 1.4;   color: #4c6072; } .mp-font-subtitle {   font-family: \'Proxima Nova\', \'proxima-nova\', sans-serif;   font-size: 15px;   font-weight: 600;   line-height: 18px;   color: #4c6072; } .mp-font-list-item {   font-family: \'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif;   font-size: 13px;   line-height: 1.7;   color: #6e859d; } .mp-font-paragraph {   font-family: \'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif;   font-size: 14px;   font-weight: normal;   line-height: 18px;   color: #6e859d; } * {   -webkit-font-smoothing: antialiased; } .mp-button-container {   -webkit-box-align: center;       -ms-flex-align: center;           align-items: center;   border-radius: 4px;   box-sizing: border-box;   cursor: pointer;   display: -webkit-inline-box;   display: -ms-inline-flexbox;   display: inline-flex;   -webkit-box-flex: 1;       -ms-flex: 1;           flex: 1;   font-family: \'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif;   font-size: 13px;   font-weight: 700;   -webkit-box-pack: center;       -ms-flex-pack: center;           justify-content: center;   line-height: 15px;   padding: 12px 25px;   text-align: center;   text-transform: uppercase; /* BEGIN COLOR THEMES */ /* END COLOR THEMES */ /* BEGIN SPECIAL STYLES FOR MODAL BUTTONS */ /* END SPECIAL STYLES FOR MODAL BUTTONS */ } .mp-button-container .mp-button-text {   display: -webkit-inline-box;   display: -ms-inline-flexbox;   display: inline-flex;   -webkit-box-align: center;       -ms-flex-align: center;           align-items: center;   -webkit-box-pack: center;       -ms-flex-pack: center;           justify-content: center; } .mp-button-container .mp-button-text .mp-button-arrow-next {   margin-left: 10px;   width: 15px; } .mp-button-container .mp-button-text .mp-button-arrow-next svg path {   fill: #fff; } .mp-button-container:disabled, .mp-button-container[disabled] {   cursor: default; } .mp-button-container:disabled .mp-button-text, .mp-button-container[disabled] .mp-button-text {   opacity: 0.6; } .mp-button-container.mp-button-primary, .mp-button-container.mp-button-blue {   background: #4ba8ff -webkit-linear-gradient(top, #50aeff, #46a2ff);   background: #4ba8ff linear-gradient(to bottom, #50aeff, #46a2ff);   border: 1px solid #3391e9;   box-shadow: 0px 1px 1px 0px rgba(0,0,0,0.2);   color: #fff; } .mp-button-container.mp-button-primary:hover:not([disabled]):not(:disabled), .mp-button-container.mp-button-blue:hover:not([disabled]):not(:disabled) {   background-image: -webkit-linear-gradient(bottom, #2f95fd, #4aabfe), -webkit-linear-gradient(#6e859d, #6e859d);   background-image: linear-gradient(to top, #2f95fd, #4aabfe), linear-gradient(#6e859d, #6e859d);   box-shadow: 0 1px 1px 0 rgba(0,0,0,0.13); } .mp-button-container.mp-button-primary:active:not([disabled]):not(:disabled), .mp-button-container.mp-button-blue:active:not([disabled]):not(:disabled) {   background-image: -webkit-linear-gradient(bottom, #2f95fd, #4aabfe), -webkit-linear-gradient(#50aaff, #50aaff);   background-image: linear-gradient(to top, #2f95fd, #4aabfe), linear-gradient(#50aaff, #50aaff);   box-shadow: inset 0 1px 1px 0 rgba(0,0,0,0.31);   color: rgba(255,255,255,0.6); } .mp-button-container.mp-button-primary.mp-button-on-blue, .mp-button-container.mp-button-blue.mp-button-on-blue {   background: #4ba8ff -webkit-linear-gradient(top, #7fc1ff, #6fb9ff);   background: #4ba8ff linear-gradient(to bottom, #7fc1ff, #6fb9ff);   box-shadow: 0px 1px 1px 0px rgba(0,0,0,0.06); } .mp-button-container.mp-button-primary.mp-button-on-blue:hover:not([disabled]):not(:disabled), .mp-button-container.mp-button-blue.mp-button-on-blue:hover:not([disabled]):not(:disabled) {   background-image: -webkit-linear-gradient(top, #89c5ff, #68b5ff), -webkit-linear-gradient(#80c1ff, #80c1ff);   background-image: linear-gradient(to bottom, #89c5ff, #68b5ff), linear-gradient(#80c1ff, #80c1ff);   border: solid 1px #1d85e7; } .mp-button-container.mp-button-primary.mp-button-on-blue:active:not([disabled]):not(:disabled), .mp-button-container.mp-button-blue.mp-button-on-blue:active:not([disabled]):not(:disabled) {   background-image: -webkit-linear-gradient(top, #89c5ff, #68b5ff), -webkit-linear-gradient(#8bc7ff, #8bc7ff);   background-image: linear-gradient(to bottom, #89c5ff, #68b5ff), linear-gradient(#8bc7ff, #8bc7ff);   border: solid 1px #1d85e7;   box-shadow: inset 0 1px 2px 0 rgba(0,0,0,0.2); } .mp-button-container.mp-button-secondary, .mp-button-container.mp-button-grey {   background-color: #fff;   border: 1px solid #d8e0e7;   box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.05), inset 0px 0px 0px 2px rgba(255,255,255,0.17);   color: #6e859d; } .mp-button-container.mp-button-secondary:hover, .mp-button-container.mp-button-grey:hover {   border: 1px solid #c1ccd6;   box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.1), inset 0px 0px 0px 2px rgba(255,255,255,0.17); } .mp-button-container.mp-button-secondary:active, .mp-button-container.mp-button-grey:active {   border-color: #c1ccd6;   box-shadow: 0 1px 0 0 #e3eaf0, inset 0 2px 3px 0 #dfe5eb; } .mp-button-container.mp-button-secondary.mp-button-on-blue, .mp-button-container.mp-button-grey.mp-button-on-blue {   background-color: #4ba8ff;   border-color: #3391e9;   box-shadow: 0px 1px 1px 0px rgba(0,0,0,0.06);   color: #fff; } .mp-button-container.mp-button-secondary.mp-button-on-blue:hover, .mp-button-container.mp-button-grey.mp-button-on-blue:hover {   border-color: #2788e3; } .mp-button-container.mp-button-secondary.mp-button-on-blue:active, .mp-button-container.mp-button-grey.mp-button-on-blue:active {   border-color: #2583dd;   box-shadow: 0 1px 1px 0 rgba(0,0,0,0.06), inset 0 1px 2px 0 rgba(0,0,0,0.2); } .mp-button-container.mp-button-red {   background: #e4567b -webkit-linear-gradient(#ea8499, #e4687d);   background: #e4567b linear-gradient(#ea8499, #e4687d);   border: 1px solid #ff5400;   border-image-source: linear-gradient(to top, #d15269, #e46d83);   border-image-slice: 1;   color: #fff; } .mp-button-container.mp-button-red:hover:not([disabled]):not(:disabled) {   background: #e4567b -webkit-linear-gradient(top, #ed92a4, #ea8499);   background: #e4567b linear-gradient(to bottom, #ed92a4, #ea8499); } .mp-button-container.mp-button-purple {   background: #9271e2;   border: 1px solid #7858b8;   color: #fff; } .mp-button-container.mp-button-purple:hover:not([disabled]):not(:disabled) {   background: #a081ea;   border: 1px solid #9270e2; } .mp-button-container.mp-button-modal {   background-image: none;   border-radius: 0 0 6px 6px;   border: none;   color: #fff;   font-size: 15px;   font-weight: bold;   height: 60px;   letter-spacing: 0.7px;   padding: 0;   display: -webkit-box;   display: -ms-flexbox;   display: flex;   text-transform: none;   -webkit-transition: background 200ms;   transition: background 200ms; } .mp-button-container.mp-button-modal:hover:not([disabled]):not(:disabled) {   border: none; } .mp-button-container.mp-button-modal.mp-button-primary, .mp-button-container.mp-button-modal.mp-button-blue {   background: #4ba8ff;   box-shadow: inset 0 1px 0 0 #3b99f0; } .mp-button-container.mp-button-modal.mp-button-primary:hover:not([disabled]):not(:disabled), .mp-button-container.mp-button-modal.mp-button-blue:hover:not([disabled]):not(:disabled) {   background: #6cb8ff; } .mp-button-container.mp-button-modal.mp-button-purple {   box-shadow: inset 0 1px 0 0 #7858b8; } ';


	(0, _registration.registerMPComponent)('mp-button', function (_Component) {
	  _inherits(_class, _Component);

	  function _class() {
	    _classCallCheck(this, _class);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(_class).apply(this, arguments));
	  }

	  _createClass(_class, [{
	    key: 'attachedCallback',
	    value: function attachedCallback() {
	      var _this2 = this;

	      _get(Object.getPrototypeOf(_class.prototype), 'attachedCallback', this).apply(this, arguments);
	      this._clickHandler = function (e) {
	        if (_this2.isAttributeEnabled('disabled')) {
	          e.stopImmediatePropagation();
	        }
	      };
	      this.el.addEventListener('click', this._clickHandler);
	    }
	  }, {
	    key: 'detachedCallback',
	    value: function detachedCallback() {
	      _get(Object.getPrototypeOf(_class.prototype), 'detachedCallback', this).apply(this, arguments);
	      this.el.removeEventListener('click', this._clickHandler);
	      this._clickHandler = null;
	    }
	  }, {
	    key: 'attributeChangedCallback',
	    value: function attributeChangedCallback(attr, oldVal, newVal) {
	      _get(Object.getPrototypeOf(_class.prototype), 'attributeChangedCallback', this).apply(this, arguments);
	      // handle boolean attributes a bit better than HTML does by default: https://www.w3.org/TR/html5/infrastructure.html#boolean-attribute
	      // if it's set to "false" just remove the attribute
	      if (newVal === 'false') {
	        this.removeAttribute(attr);
	      }
	    }
	  }, {
	    key: 'config',
	    get: function get() {
	      var _this3 = this;

	      return {
	        css: css,
	        helpers: {
	          getButtonAttrs: function getButtonAttrs() {
	            var attrs = {};
	            if (_this3.isAttributeEnabled('disabled')) {
	              attrs.disabled = true;
	            }
	            return attrs;
	          }
	        },
	        template: template,
	        useShadowDom: true
	      };
	    }
	  }, {
	    key: 'disabled',
	    get: function get() {
	      return this.getAttribute('disabled');
	    },
	    set: function set(disabled) {
	      this.setAttribute('disabled', disabled);
	    }
	  }]);

	  return _class;
	}(_panel.Component));

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.h = exports.Component = undefined;

	var _component = __webpack_require__(6);

	var _component2 = _interopRequireDefault(_component);

	var _virtualHyperscript = __webpack_require__(38);

	var _virtualHyperscript2 = _interopRequireDefault(_virtualHyperscript);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.Component = _component2.default;
	exports.h = _virtualHyperscript2.default;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _mainLoop = __webpack_require__(7);

	var _mainLoop2 = _interopRequireDefault(_mainLoop);

	var _createElement = __webpack_require__(15);

	var _createElement2 = _interopRequireDefault(_createElement);

	var _diff = __webpack_require__(28);

	var _diff2 = _interopRequireDefault(_diff);

	var _patch = __webpack_require__(33);

	var _patch2 = _interopRequireDefault(_patch);

	var _virtualHyperscript = __webpack_require__(38);

	var _virtualHyperscript2 = _interopRequireDefault(_virtualHyperscript);

	var _webcomponent = __webpack_require__(48);

	var _webcomponent2 = _interopRequireDefault(_webcomponent);

	var _router = __webpack_require__(49);

	var _router2 = _interopRequireDefault(_router);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var panelID = 1;
	var DOCUMENT_FRAGMENT_NODE = 11;
	var EMPTY_DIV = (0, _virtualHyperscript2.default)('div');

	var Component = function (_WebComponent) {
	  _inherits(Component, _WebComponent);

	  function Component() {
	    _classCallCheck(this, Component);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Component).apply(this, arguments));
	  }

	  _createClass(Component, [{
	    key: 'createdCallback',
	    value: function createdCallback() {
	      this.panelID = panelID++;
	      this._config = Object.assign({}, {
	        css: '',
	        helpers: {},
	        routes: {},
	        template: function template() {
	          throw Error('No template provided by Component subclass');
	        },
	        useShadowDom: false
	      }, this.config);
	      this.state = {};
	      if (this.getConfig('useShadowDom')) {
	        this.el = this.createShadowRoot();
	        this.styleTag = document.createElement('style');
	        this.styleTag.innerHTML = this.getConfig('css');
	        this.el.appendChild(this.styleTag);
	      } else if (this.getConfig('css')) {
	        throw Error('"useShadowDom" config option must be set in order to use "css" config.');
	      } else {
	        this.el = this;
	      }
	    }
	  }, {
	    key: 'attachedCallback',
	    value: function attachedCallback() {
	      this.$panelChildren = new Set();

	      var parentID = Number(this.getAttribute('panel-parent'));
	      if (parentID) {
	        this.isPanelChild = true;
	        // find $panelParent
	        for (var node = this.parentNode; node && !this.$panelParent; node = node.parentNode) {
	          if (node.nodeType === DOCUMENT_FRAGMENT_NODE) {
	            // handle shadow-root
	            node = node.host;
	          }
	          if (node.panelID === parentID) {
	            this.$panelParent = node;
	            this.$panelRoot = node.$panelRoot;
	          }
	        }
	        if (!this.$panelParent) {
	          throw 'panel-parent ' + parentID + ' not found';
	        }
	        this.$panelParent.$panelChildren.add(this);
	        this.state = this.$panelRoot.state;
	      } else {
	        this.isPanelRoot = true;
	        this.$panelRoot = this;
	      }
	      this.app = this.$panelRoot;

	      var newState = Object.assign({}, this.getConfig('defaultState'), this.state, this.getJSONAttribute('data-state'), this._stateFromAttributes());
	      Object.assign(this.state, newState);

	      this.loop = (0, _mainLoop2.default)(this.state, this._render.bind(this), { create: _createElement2.default, diff: _diff2.default, patch: _patch2.default });
	      this.el.appendChild(this.loop.target);
	      this.initialized = true;

	      if (Object.keys(this.getConfig('routes')).length) {
	        this.router = new _router2.default(this, { historyMethod: this.historyMethod });
	        this.navigate(window.location.hash);
	      }
	    }
	  }, {
	    key: 'detachedCallback',
	    value: function detachedCallback() {
	      this.$panelParent && this.$panelParent.$panelChildren.delete(this);
	    }
	  }, {
	    key: 'attributeChangedCallback',
	    value: function attributeChangedCallback(attr, oldVal, newVal) {
	      if (attr === 'style-override') {
	        this._applyStyles(newVal);
	      }
	      if (this.isPanelRoot && this.initialized) {
	        this.update();
	      }
	    }
	  }, {
	    key: '_applyStyles',
	    value: function _applyStyles(styleOverride) {
	      if (this.getConfig('useShadowDom')) {
	        this.styleTag.innerHTML = this.getConfig('css') + (styleOverride || '');
	      }
	    }
	  }, {
	    key: 'child',
	    value: function child(tagName) {
	      var attrs = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	      attrs = Object.assign({}, attrs);
	      attrs.attributes = Object.assign({}, attrs.attributes, { 'panel-parent': this.panelID });
	      return (0, _virtualHyperscript2.default)(tagName, attrs);
	    }
	  }, {
	    key: 'getConfig',
	    value: function getConfig(item) {
	      return this._config[item];
	    }
	  }, {
	    key: 'logError',
	    value: function logError() {
	      var _console;

	      (_console = console).error.apply(_console, arguments);
	    }
	  }, {
	    key: 'navigate',
	    value: function navigate() {
	      var _$panelRoot$router;

	      (_$panelRoot$router = this.$panelRoot.router).navigate.apply(_$panelRoot$router, arguments);
	    }
	  }, {
	    key: 'setConfig',
	    value: function setConfig(item, val) {
	      this._config[item] = val;
	    }

	    // override to provide conditional logic
	    // for whether a component's loop should receive
	    // state updates

	  }, {
	    key: 'shouldUpdate',
	    value: function shouldUpdate(state) {
	      return true;
	    }
	  }, {
	    key: 'toString',
	    value: function toString() {
	      try {
	        return this.tagName + '#' + this.panelID;
	      } catch (e) {
	        return 'UNKNOWN COMPONENT';
	      }
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      var stateUpdate = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	      if (!this.initialized) {
	        Object.assign(this.state, stateUpdate);
	      } else if (this.isPanelRoot) {
	        var updateHash = '$fragment' in stateUpdate && stateUpdate.$fragment !== this.state.$fragment;

	        Object.assign(this.state, stateUpdate);
	        this.updateSelfAndChildren(this.state);

	        if (updateHash) {
	          this.router.replaceHash(this.state.$fragment);
	        }
	      } else {
	        this.$panelRoot.update(stateUpdate);
	      }
	    }
	  }, {
	    key: 'updateSelfAndChildren',
	    value: function updateSelfAndChildren(state) {
	      if (this.initialized && this.shouldUpdate(state)) {
	        this.loop.update(state);
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	          for (var _iterator = this.$panelChildren[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var child = _step.value;

	            child.updateSelfAndChildren(state);
	          }
	        } catch (err) {
	          _didIteratorError = true;
	          _iteratorError = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion && _iterator.return) {
	              _iterator.return();
	            }
	          } finally {
	            if (_didIteratorError) {
	              throw _iteratorError;
	            }
	          }
	        }
	      }
	    }
	  }, {
	    key: '_render',
	    value: function _render(state) {
	      if (this.shouldUpdate(state)) {
	        try {
	          this._rendered = this.getConfig('template')(Object.assign({}, state, {
	            $component: this,
	            $helpers: this.getConfig('helpers')
	          }));
	        } catch (e) {
	          this.logError('Error while rendering ' + this.toString(), this, e);
	        }
	      }
	      return this._rendered || EMPTY_DIV;
	    }
	  }, {
	    key: '_stateFromAttributes',
	    value: function _stateFromAttributes() {
	      var state = {};

	      // this.attributes is a NamedNodeMap, without normal iterators
	      for (var ai = 0; ai < this.attributes.length; ai++) {
	        var attr = this.attributes[ai];
	        var attrMatch = attr.name.match(/^state-(.+)/);
	        if (attrMatch) {
	          var num = Number(attr.value);
	          state[attrMatch[1]] = isNaN(num) ? attr.value : num;
	        }
	      }

	      return state;
	    }
	  }]);

	  return Component;
	}(_webcomponent2.default);

	exports.default = Component;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var raf = __webpack_require__(8)
	var TypedError = __webpack_require__(11)

	var InvalidUpdateInRender = TypedError({
	    type: "main-loop.invalid.update.in-render",
	    message: "main-loop: Unexpected update occurred in loop.\n" +
	        "We are currently rendering a view, " +
	            "you can't change state right now.\n" +
	        "The diff is: {stringDiff}.\n" +
	        "SUGGESTED FIX: find the state mutation in your view " +
	            "or rendering function and remove it.\n" +
	        "The view should not have any side effects.\n",
	    diff: null,
	    stringDiff: null
	})

	module.exports = main

	function main(initialState, view, opts) {
	    opts = opts || {}

	    var currentState = initialState
	    var create = opts.create
	    var diff = opts.diff
	    var patch = opts.patch
	    var redrawScheduled = false

	    var tree = opts.initialTree || view(currentState)
	    var target = opts.target || create(tree, opts)
	    var inRenderingTransaction = false

	    currentState = null

	    var loop = {
	        state: initialState,
	        target: target,
	        update: update
	    }
	    return loop

	    function update(state) {
	        if (inRenderingTransaction) {
	            throw InvalidUpdateInRender({
	                diff: state._diff,
	                stringDiff: JSON.stringify(state._diff)
	            })
	        }

	        if (currentState === null && !redrawScheduled) {
	            redrawScheduled = true
	            raf(redraw)
	        }

	        currentState = state
	        loop.state = state
	    }

	    function redraw() {
	        redrawScheduled = false
	        if (currentState === null) {
	            return
	        }

	        inRenderingTransaction = true
	        var newTree = view(currentState)

	        if (opts.createOnly) {
	            inRenderingTransaction = false
	            create(newTree, opts)
	        } else {
	            var patches = diff(tree, newTree, opts)
	            inRenderingTransaction = false
	            target = patch(target, patches, opts)
	        }

	        tree = newTree
	        currentState = null
	    }
	}


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var now = __webpack_require__(9)
	  , global = typeof window === 'undefined' ? {} : window
	  , vendors = ['moz', 'webkit']
	  , suffix = 'AnimationFrame'
	  , raf = global['request' + suffix]
	  , caf = global['cancel' + suffix] || global['cancelRequest' + suffix]
	  , isNative = true

	for(var i = 0; i < vendors.length && !raf; i++) {
	  raf = global[vendors[i] + 'Request' + suffix]
	  caf = global[vendors[i] + 'Cancel' + suffix]
	      || global[vendors[i] + 'CancelRequest' + suffix]
	}

	// Some versions of FF have rAF but not cAF
	if(!raf || !caf) {
	  isNative = false

	  var last = 0
	    , id = 0
	    , queue = []
	    , frameDuration = 1000 / 60

	  raf = function(callback) {
	    if(queue.length === 0) {
	      var _now = now()
	        , next = Math.max(0, frameDuration - (_now - last))
	      last = next + _now
	      setTimeout(function() {
	        var cp = queue.slice(0)
	        // Clear queue here to prevent
	        // callbacks from appending listeners
	        // to the current frame's queue
	        queue.length = 0
	        for(var i = 0; i < cp.length; i++) {
	          if(!cp[i].cancelled) {
	            try{
	              cp[i].callback(last)
	            } catch(e) {
	              setTimeout(function() { throw e }, 0)
	            }
	          }
	        }
	      }, Math.round(next))
	    }
	    queue.push({
	      handle: ++id,
	      callback: callback,
	      cancelled: false
	    })
	    return id
	  }

	  caf = function(handle) {
	    for(var i = 0; i < queue.length; i++) {
	      if(queue[i].handle === handle) {
	        queue[i].cancelled = true
	      }
	    }
	  }
	}

	module.exports = function(fn) {
	  // Wrap in a new function to prevent
	  // `cancel` potentially being assigned
	  // to the native rAF function
	  if(!isNative) {
	    return raf.call(global, fn)
	  }
	  return raf.call(global, function() {
	    try{
	      fn.apply(this, arguments)
	    } catch(e) {
	      setTimeout(function() { throw e }, 0)
	    }
	  })
	}
	module.exports.cancel = function() {
	  caf.apply(global, arguments)
	}


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Generated by CoffeeScript 1.6.3
	(function() {
	  var getNanoSeconds, hrtime, loadTime;

	  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
	    module.exports = function() {
	      return performance.now();
	    };
	  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
	    module.exports = function() {
	      return (getNanoSeconds() - loadTime) / 1e6;
	    };
	    hrtime = process.hrtime;
	    getNanoSeconds = function() {
	      var hr;
	      hr = hrtime();
	      return hr[0] * 1e9 + hr[1];
	    };
	    loadTime = getNanoSeconds();
	  } else if (Date.now) {
	    module.exports = function() {
	      return Date.now() - loadTime;
	    };
	    loadTime = Date.now();
	  } else {
	    module.exports = function() {
	      return new Date().getTime() - loadTime;
	    };
	    loadTime = new Date().getTime();
	  }

	}).call(this);

	/*
	//@ sourceMappingURL=performance-now.map
	*/

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ },
/* 10 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var camelize = __webpack_require__(12)
	var template = __webpack_require__(13)
	var extend = __webpack_require__(14)

	module.exports = TypedError

	function TypedError(args) {
	    if (!args) {
	        throw new Error("args is required");
	    }
	    if (!args.type) {
	        throw new Error("args.type is required");
	    }
	    if (!args.message) {
	        throw new Error("args.message is required");
	    }

	    var message = args.message

	    if (args.type && !args.name) {
	        var errorName = camelize(args.type) + "Error"
	        args.name = errorName[0].toUpperCase() + errorName.substr(1)
	    }

	    extend(createError, args);
	    createError._name = args.name;

	    return createError;

	    function createError(opts) {
	        var result = new Error()

	        Object.defineProperty(result, "type", {
	            value: result.type,
	            enumerable: true,
	            writable: true,
	            configurable: true
	        })

	        var options = extend({}, args, opts)

	        extend(result, options)
	        result.message = template(message, options)

	        return result
	    }
	}



/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = function(obj) {
	    if (typeof obj === 'string') return camelCase(obj);
	    return walk(obj);
	};

	function walk (obj) {
	    if (!obj || typeof obj !== 'object') return obj;
	    if (isDate(obj) || isRegex(obj)) return obj;
	    if (isArray(obj)) return map(obj, walk);
	    return reduce(objectKeys(obj), function (acc, key) {
	        var camel = camelCase(key);
	        acc[camel] = walk(obj[key]);
	        return acc;
	    }, {});
	}

	function camelCase(str) {
	    return str.replace(/[_.-](\w|$)/g, function (_,x) {
	        return x.toUpperCase();
	    });
	}

	var isArray = Array.isArray || function (obj) {
	    return Object.prototype.toString.call(obj) === '[object Array]';
	};

	var isDate = function (obj) {
	    return Object.prototype.toString.call(obj) === '[object Date]';
	};

	var isRegex = function (obj) {
	    return Object.prototype.toString.call(obj) === '[object RegExp]';
	};

	var has = Object.prototype.hasOwnProperty;
	var objectKeys = Object.keys || function (obj) {
	    var keys = [];
	    for (var key in obj) {
	        if (has.call(obj, key)) keys.push(key);
	    }
	    return keys;
	};

	function map (xs, f) {
	    if (xs.map) return xs.map(f);
	    var res = [];
	    for (var i = 0; i < xs.length; i++) {
	        res.push(f(xs[i], i));
	    }
	    return res;
	}

	function reduce (xs, f, acc) {
	    if (xs.reduce) return xs.reduce(f, acc);
	    for (var i = 0; i < xs.length; i++) {
	        acc = f(acc, xs[i], i);
	    }
	    return acc;
	}


/***/ },
/* 13 */
/***/ function(module, exports) {

	var nargs = /\{([0-9a-zA-Z]+)\}/g
	var slice = Array.prototype.slice

	module.exports = template

	function template(string) {
	    var args

	    if (arguments.length === 2 && typeof arguments[1] === "object") {
	        args = arguments[1]
	    } else {
	        args = slice.call(arguments, 1)
	    }

	    if (!args || !args.hasOwnProperty) {
	        args = {}
	    }

	    return string.replace(nargs, function replaceArg(match, i, index) {
	        var result

	        if (string[index - 1] === "{" &&
	            string[index + match.length] === "}") {
	            return i
	        } else {
	            result = args.hasOwnProperty(i) ? args[i] : null
	            if (result === null || result === undefined) {
	                return ""
	            }

	            return result
	        }
	    })
	}


/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = extend

	var hasOwnProperty = Object.prototype.hasOwnProperty;

	function extend(target) {
	    for (var i = 1; i < arguments.length; i++) {
	        var source = arguments[i]

	        for (var key in source) {
	            if (hasOwnProperty.call(source, key)) {
	                target[key] = source[key]
	            }
	        }
	    }

	    return target
	}


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var createElement = __webpack_require__(16)

	module.exports = createElement


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var document = __webpack_require__(17)

	var applyProperties = __webpack_require__(19)

	var isVNode = __webpack_require__(22)
	var isVText = __webpack_require__(24)
	var isWidget = __webpack_require__(25)
	var handleThunk = __webpack_require__(26)

	module.exports = createElement

	function createElement(vnode, opts) {
	    var doc = opts ? opts.document || document : document
	    var warn = opts ? opts.warn : null

	    vnode = handleThunk(vnode).a

	    if (isWidget(vnode)) {
	        return vnode.init()
	    } else if (isVText(vnode)) {
	        return doc.createTextNode(vnode.text)
	    } else if (!isVNode(vnode)) {
	        if (warn) {
	            warn("Item is not a valid virtual dom node", vnode)
	        }
	        return null
	    }

	    var node = (vnode.namespace === null) ?
	        doc.createElement(vnode.tagName) :
	        doc.createElementNS(vnode.namespace, vnode.tagName)

	    var props = vnode.properties
	    applyProperties(node, props)

	    var children = vnode.children

	    for (var i = 0; i < children.length; i++) {
	        var childNode = createElement(children[i], opts)
	        if (childNode) {
	            node.appendChild(childNode)
	        }
	    }

	    return node
	}


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var topLevel = typeof global !== 'undefined' ? global :
	    typeof window !== 'undefined' ? window : {}
	var minDoc = __webpack_require__(18);

	if (typeof document !== 'undefined') {
	    module.exports = document;
	} else {
	    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

	    if (!doccy) {
	        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
	    }

	    module.exports = doccy;
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 18 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(20)
	var isHook = __webpack_require__(21)

	module.exports = applyProperties

	function applyProperties(node, props, previous) {
	    for (var propName in props) {
	        var propValue = props[propName]

	        if (propValue === undefined) {
	            removeProperty(node, propName, propValue, previous);
	        } else if (isHook(propValue)) {
	            removeProperty(node, propName, propValue, previous)
	            if (propValue.hook) {
	                propValue.hook(node,
	                    propName,
	                    previous ? previous[propName] : undefined)
	            }
	        } else {
	            if (isObject(propValue)) {
	                patchObject(node, props, previous, propName, propValue);
	            } else {
	                node[propName] = propValue
	            }
	        }
	    }
	}

	function removeProperty(node, propName, propValue, previous) {
	    if (previous) {
	        var previousValue = previous[propName]

	        if (!isHook(previousValue)) {
	            if (propName === "attributes") {
	                for (var attrName in previousValue) {
	                    node.removeAttribute(attrName)
	                }
	            } else if (propName === "style") {
	                for (var i in previousValue) {
	                    node.style[i] = ""
	                }
	            } else if (typeof previousValue === "string") {
	                node[propName] = ""
	            } else {
	                node[propName] = null
	            }
	        } else if (previousValue.unhook) {
	            previousValue.unhook(node, propName, propValue)
	        }
	    }
	}

	function patchObject(node, props, previous, propName, propValue) {
	    var previousValue = previous ? previous[propName] : undefined

	    // Set attributes
	    if (propName === "attributes") {
	        for (var attrName in propValue) {
	            var attrValue = propValue[attrName]

	            if (attrValue === undefined) {
	                node.removeAttribute(attrName)
	            } else {
	                node.setAttribute(attrName, attrValue)
	            }
	        }

	        return
	    }

	    if(previousValue && isObject(previousValue) &&
	        getPrototype(previousValue) !== getPrototype(propValue)) {
	        node[propName] = propValue
	        return
	    }

	    if (!isObject(node[propName])) {
	        node[propName] = {}
	    }

	    var replacer = propName === "style" ? "" : undefined

	    for (var k in propValue) {
	        var value = propValue[k]
	        node[propName][k] = (value === undefined) ? replacer : value
	    }
	}

	function getPrototype(value) {
	    if (Object.getPrototypeOf) {
	        return Object.getPrototypeOf(value)
	    } else if (value.__proto__) {
	        return value.__proto__
	    } else if (value.constructor) {
	        return value.constructor.prototype
	    }
	}


/***/ },
/* 20 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function isObject(x) {
		return typeof x === "object" && x !== null;
	};


/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = isHook

	function isHook(hook) {
	    return hook &&
	      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
	       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
	}


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var version = __webpack_require__(23)

	module.exports = isVirtualNode

	function isVirtualNode(x) {
	    return x && x.type === "VirtualNode" && x.version === version
	}


/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = "2"


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var version = __webpack_require__(23)

	module.exports = isVirtualText

	function isVirtualText(x) {
	    return x && x.type === "VirtualText" && x.version === version
	}


/***/ },
/* 25 */
/***/ function(module, exports) {

	module.exports = isWidget

	function isWidget(w) {
	    return w && w.type === "Widget"
	}


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var isVNode = __webpack_require__(22)
	var isVText = __webpack_require__(24)
	var isWidget = __webpack_require__(25)
	var isThunk = __webpack_require__(27)

	module.exports = handleThunk

	function handleThunk(a, b) {
	    var renderedA = a
	    var renderedB = b

	    if (isThunk(b)) {
	        renderedB = renderThunk(b, a)
	    }

	    if (isThunk(a)) {
	        renderedA = renderThunk(a, null)
	    }

	    return {
	        a: renderedA,
	        b: renderedB
	    }
	}

	function renderThunk(thunk, previous) {
	    var renderedThunk = thunk.vnode

	    if (!renderedThunk) {
	        renderedThunk = thunk.vnode = thunk.render(previous)
	    }

	    if (!(isVNode(renderedThunk) ||
	            isVText(renderedThunk) ||
	            isWidget(renderedThunk))) {
	        throw new Error("thunk did not return a valid node");
	    }

	    return renderedThunk
	}


/***/ },
/* 27 */
/***/ function(module, exports) {

	module.exports = isThunk

	function isThunk(t) {
	    return t && t.type === "Thunk"
	}


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var diff = __webpack_require__(29)

	module.exports = diff


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var isArray = __webpack_require__(30)

	var VPatch = __webpack_require__(31)
	var isVNode = __webpack_require__(22)
	var isVText = __webpack_require__(24)
	var isWidget = __webpack_require__(25)
	var isThunk = __webpack_require__(27)
	var handleThunk = __webpack_require__(26)

	var diffProps = __webpack_require__(32)

	module.exports = diff

	function diff(a, b) {
	    var patch = { a: a }
	    walk(a, b, patch, 0)
	    return patch
	}

	function walk(a, b, patch, index) {
	    if (a === b) {
	        return
	    }

	    var apply = patch[index]
	    var applyClear = false

	    if (isThunk(a) || isThunk(b)) {
	        thunks(a, b, patch, index)
	    } else if (b == null) {

	        // If a is a widget we will add a remove patch for it
	        // Otherwise any child widgets/hooks must be destroyed.
	        // This prevents adding two remove patches for a widget.
	        if (!isWidget(a)) {
	            clearState(a, patch, index)
	            apply = patch[index]
	        }

	        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
	    } else if (isVNode(b)) {
	        if (isVNode(a)) {
	            if (a.tagName === b.tagName &&
	                a.namespace === b.namespace &&
	                a.key === b.key) {
	                var propsPatch = diffProps(a.properties, b.properties)
	                if (propsPatch) {
	                    apply = appendPatch(apply,
	                        new VPatch(VPatch.PROPS, a, propsPatch))
	                }
	                apply = diffChildren(a, b, patch, apply, index)
	            } else {
	                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
	                applyClear = true
	            }
	        } else {
	            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
	            applyClear = true
	        }
	    } else if (isVText(b)) {
	        if (!isVText(a)) {
	            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
	            applyClear = true
	        } else if (a.text !== b.text) {
	            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
	        }
	    } else if (isWidget(b)) {
	        if (!isWidget(a)) {
	            applyClear = true
	        }

	        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
	    }

	    if (apply) {
	        patch[index] = apply
	    }

	    if (applyClear) {
	        clearState(a, patch, index)
	    }
	}

	function diffChildren(a, b, patch, apply, index) {
	    var aChildren = a.children
	    var orderedSet = reorder(aChildren, b.children)
	    var bChildren = orderedSet.children

	    var aLen = aChildren.length
	    var bLen = bChildren.length
	    var len = aLen > bLen ? aLen : bLen

	    for (var i = 0; i < len; i++) {
	        var leftNode = aChildren[i]
	        var rightNode = bChildren[i]
	        index += 1

	        if (!leftNode) {
	            if (rightNode) {
	                // Excess nodes in b need to be added
	                apply = appendPatch(apply,
	                    new VPatch(VPatch.INSERT, null, rightNode))
	            }
	        } else {
	            walk(leftNode, rightNode, patch, index)
	        }

	        if (isVNode(leftNode) && leftNode.count) {
	            index += leftNode.count
	        }
	    }

	    if (orderedSet.moves) {
	        // Reorder nodes last
	        apply = appendPatch(apply, new VPatch(
	            VPatch.ORDER,
	            a,
	            orderedSet.moves
	        ))
	    }

	    return apply
	}

	function clearState(vNode, patch, index) {
	    // TODO: Make this a single walk, not two
	    unhook(vNode, patch, index)
	    destroyWidgets(vNode, patch, index)
	}

	// Patch records for all destroyed widgets must be added because we need
	// a DOM node reference for the destroy function
	function destroyWidgets(vNode, patch, index) {
	    if (isWidget(vNode)) {
	        if (typeof vNode.destroy === "function") {
	            patch[index] = appendPatch(
	                patch[index],
	                new VPatch(VPatch.REMOVE, vNode, null)
	            )
	        }
	    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
	        var children = vNode.children
	        var len = children.length
	        for (var i = 0; i < len; i++) {
	            var child = children[i]
	            index += 1

	            destroyWidgets(child, patch, index)

	            if (isVNode(child) && child.count) {
	                index += child.count
	            }
	        }
	    } else if (isThunk(vNode)) {
	        thunks(vNode, null, patch, index)
	    }
	}

	// Create a sub-patch for thunks
	function thunks(a, b, patch, index) {
	    var nodes = handleThunk(a, b)
	    var thunkPatch = diff(nodes.a, nodes.b)
	    if (hasPatches(thunkPatch)) {
	        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
	    }
	}

	function hasPatches(patch) {
	    for (var index in patch) {
	        if (index !== "a") {
	            return true
	        }
	    }

	    return false
	}

	// Execute hooks when two nodes are identical
	function unhook(vNode, patch, index) {
	    if (isVNode(vNode)) {
	        if (vNode.hooks) {
	            patch[index] = appendPatch(
	                patch[index],
	                new VPatch(
	                    VPatch.PROPS,
	                    vNode,
	                    undefinedKeys(vNode.hooks)
	                )
	            )
	        }

	        if (vNode.descendantHooks || vNode.hasThunks) {
	            var children = vNode.children
	            var len = children.length
	            for (var i = 0; i < len; i++) {
	                var child = children[i]
	                index += 1

	                unhook(child, patch, index)

	                if (isVNode(child) && child.count) {
	                    index += child.count
	                }
	            }
	        }
	    } else if (isThunk(vNode)) {
	        thunks(vNode, null, patch, index)
	    }
	}

	function undefinedKeys(obj) {
	    var result = {}

	    for (var key in obj) {
	        result[key] = undefined
	    }

	    return result
	}

	// List diff, naive left to right reordering
	function reorder(aChildren, bChildren) {
	    // O(M) time, O(M) memory
	    var bChildIndex = keyIndex(bChildren)
	    var bKeys = bChildIndex.keys
	    var bFree = bChildIndex.free

	    if (bFree.length === bChildren.length) {
	        return {
	            children: bChildren,
	            moves: null
	        }
	    }

	    // O(N) time, O(N) memory
	    var aChildIndex = keyIndex(aChildren)
	    var aKeys = aChildIndex.keys
	    var aFree = aChildIndex.free

	    if (aFree.length === aChildren.length) {
	        return {
	            children: bChildren,
	            moves: null
	        }
	    }

	    // O(MAX(N, M)) memory
	    var newChildren = []

	    var freeIndex = 0
	    var freeCount = bFree.length
	    var deletedItems = 0

	    // Iterate through a and match a node in b
	    // O(N) time,
	    for (var i = 0 ; i < aChildren.length; i++) {
	        var aItem = aChildren[i]
	        var itemIndex

	        if (aItem.key) {
	            if (bKeys.hasOwnProperty(aItem.key)) {
	                // Match up the old keys
	                itemIndex = bKeys[aItem.key]
	                newChildren.push(bChildren[itemIndex])

	            } else {
	                // Remove old keyed items
	                itemIndex = i - deletedItems++
	                newChildren.push(null)
	            }
	        } else {
	            // Match the item in a with the next free item in b
	            if (freeIndex < freeCount) {
	                itemIndex = bFree[freeIndex++]
	                newChildren.push(bChildren[itemIndex])
	            } else {
	                // There are no free items in b to match with
	                // the free items in a, so the extra free nodes
	                // are deleted.
	                itemIndex = i - deletedItems++
	                newChildren.push(null)
	            }
	        }
	    }

	    var lastFreeIndex = freeIndex >= bFree.length ?
	        bChildren.length :
	        bFree[freeIndex]

	    // Iterate through b and append any new keys
	    // O(M) time
	    for (var j = 0; j < bChildren.length; j++) {
	        var newItem = bChildren[j]

	        if (newItem.key) {
	            if (!aKeys.hasOwnProperty(newItem.key)) {
	                // Add any new keyed items
	                // We are adding new items to the end and then sorting them
	                // in place. In future we should insert new items in place.
	                newChildren.push(newItem)
	            }
	        } else if (j >= lastFreeIndex) {
	            // Add any leftover non-keyed items
	            newChildren.push(newItem)
	        }
	    }

	    var simulate = newChildren.slice()
	    var simulateIndex = 0
	    var removes = []
	    var inserts = []
	    var simulateItem

	    for (var k = 0; k < bChildren.length;) {
	        var wantedItem = bChildren[k]
	        simulateItem = simulate[simulateIndex]

	        // remove items
	        while (simulateItem === null && simulate.length) {
	            removes.push(remove(simulate, simulateIndex, null))
	            simulateItem = simulate[simulateIndex]
	        }

	        if (!simulateItem || simulateItem.key !== wantedItem.key) {
	            // if we need a key in this position...
	            if (wantedItem.key) {
	                if (simulateItem && simulateItem.key) {
	                    // if an insert doesn't put this key in place, it needs to move
	                    if (bKeys[simulateItem.key] !== k + 1) {
	                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
	                        simulateItem = simulate[simulateIndex]
	                        // if the remove didn't put the wanted item in place, we need to insert it
	                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
	                            inserts.push({key: wantedItem.key, to: k})
	                        }
	                        // items are matching, so skip ahead
	                        else {
	                            simulateIndex++
	                        }
	                    }
	                    else {
	                        inserts.push({key: wantedItem.key, to: k})
	                    }
	                }
	                else {
	                    inserts.push({key: wantedItem.key, to: k})
	                }
	                k++
	            }
	            // a key in simulate has no matching wanted key, remove it
	            else if (simulateItem && simulateItem.key) {
	                removes.push(remove(simulate, simulateIndex, simulateItem.key))
	            }
	        }
	        else {
	            simulateIndex++
	            k++
	        }
	    }

	    // remove all the remaining nodes from simulate
	    while(simulateIndex < simulate.length) {
	        simulateItem = simulate[simulateIndex]
	        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
	    }

	    // If the only moves we have are deletes then we can just
	    // let the delete patch remove these items.
	    if (removes.length === deletedItems && !inserts.length) {
	        return {
	            children: newChildren,
	            moves: null
	        }
	    }

	    return {
	        children: newChildren,
	        moves: {
	            removes: removes,
	            inserts: inserts
	        }
	    }
	}

	function remove(arr, index, key) {
	    arr.splice(index, 1)

	    return {
	        from: index,
	        key: key
	    }
	}

	function keyIndex(children) {
	    var keys = {}
	    var free = []
	    var length = children.length

	    for (var i = 0; i < length; i++) {
	        var child = children[i]

	        if (child.key) {
	            keys[child.key] = i
	        } else {
	            free.push(i)
	        }
	    }

	    return {
	        keys: keys,     // A hash of key name to index
	        free: free      // An array of unkeyed item indices
	    }
	}

	function appendPatch(apply, patch) {
	    if (apply) {
	        if (isArray(apply)) {
	            apply.push(patch)
	        } else {
	            apply = [apply, patch]
	        }

	        return apply
	    } else {
	        return patch
	    }
	}


/***/ },
/* 30 */
/***/ function(module, exports) {

	var nativeIsArray = Array.isArray
	var toString = Object.prototype.toString

	module.exports = nativeIsArray || isArray

	function isArray(obj) {
	    return toString.call(obj) === "[object Array]"
	}


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var version = __webpack_require__(23)

	VirtualPatch.NONE = 0
	VirtualPatch.VTEXT = 1
	VirtualPatch.VNODE = 2
	VirtualPatch.WIDGET = 3
	VirtualPatch.PROPS = 4
	VirtualPatch.ORDER = 5
	VirtualPatch.INSERT = 6
	VirtualPatch.REMOVE = 7
	VirtualPatch.THUNK = 8

	module.exports = VirtualPatch

	function VirtualPatch(type, vNode, patch) {
	    this.type = Number(type)
	    this.vNode = vNode
	    this.patch = patch
	}

	VirtualPatch.prototype.version = version
	VirtualPatch.prototype.type = "VirtualPatch"


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(20)
	var isHook = __webpack_require__(21)

	module.exports = diffProps

	function diffProps(a, b) {
	    var diff

	    for (var aKey in a) {
	        if (!(aKey in b)) {
	            diff = diff || {}
	            diff[aKey] = undefined
	        }

	        var aValue = a[aKey]
	        var bValue = b[aKey]

	        if (aValue === bValue) {
	            continue
	        } else if (isObject(aValue) && isObject(bValue)) {
	            if (getPrototype(bValue) !== getPrototype(aValue)) {
	                diff = diff || {}
	                diff[aKey] = bValue
	            } else if (isHook(bValue)) {
	                 diff = diff || {}
	                 diff[aKey] = bValue
	            } else {
	                var objectDiff = diffProps(aValue, bValue)
	                if (objectDiff) {
	                    diff = diff || {}
	                    diff[aKey] = objectDiff
	                }
	            }
	        } else {
	            diff = diff || {}
	            diff[aKey] = bValue
	        }
	    }

	    for (var bKey in b) {
	        if (!(bKey in a)) {
	            diff = diff || {}
	            diff[bKey] = b[bKey]
	        }
	    }

	    return diff
	}

	function getPrototype(value) {
	  if (Object.getPrototypeOf) {
	    return Object.getPrototypeOf(value)
	  } else if (value.__proto__) {
	    return value.__proto__
	  } else if (value.constructor) {
	    return value.constructor.prototype
	  }
	}


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var patch = __webpack_require__(34)

	module.exports = patch


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var document = __webpack_require__(17)
	var isArray = __webpack_require__(30)

	var render = __webpack_require__(16)
	var domIndex = __webpack_require__(35)
	var patchOp = __webpack_require__(36)
	module.exports = patch

	function patch(rootNode, patches, renderOptions) {
	    renderOptions = renderOptions || {}
	    renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch
	        ? renderOptions.patch
	        : patchRecursive
	    renderOptions.render = renderOptions.render || render

	    return renderOptions.patch(rootNode, patches, renderOptions)
	}

	function patchRecursive(rootNode, patches, renderOptions) {
	    var indices = patchIndices(patches)

	    if (indices.length === 0) {
	        return rootNode
	    }

	    var index = domIndex(rootNode, patches.a, indices)
	    var ownerDocument = rootNode.ownerDocument

	    if (!renderOptions.document && ownerDocument !== document) {
	        renderOptions.document = ownerDocument
	    }

	    for (var i = 0; i < indices.length; i++) {
	        var nodeIndex = indices[i]
	        rootNode = applyPatch(rootNode,
	            index[nodeIndex],
	            patches[nodeIndex],
	            renderOptions)
	    }

	    return rootNode
	}

	function applyPatch(rootNode, domNode, patchList, renderOptions) {
	    if (!domNode) {
	        return rootNode
	    }

	    var newNode

	    if (isArray(patchList)) {
	        for (var i = 0; i < patchList.length; i++) {
	            newNode = patchOp(patchList[i], domNode, renderOptions)

	            if (domNode === rootNode) {
	                rootNode = newNode
	            }
	        }
	    } else {
	        newNode = patchOp(patchList, domNode, renderOptions)

	        if (domNode === rootNode) {
	            rootNode = newNode
	        }
	    }

	    return rootNode
	}

	function patchIndices(patches) {
	    var indices = []

	    for (var key in patches) {
	        if (key !== "a") {
	            indices.push(Number(key))
	        }
	    }

	    return indices
	}


/***/ },
/* 35 */
/***/ function(module, exports) {

	// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
	// We don't want to read all of the DOM nodes in the tree so we use
	// the in-order tree indexing to eliminate recursion down certain branches.
	// We only recurse into a DOM node if we know that it contains a child of
	// interest.

	var noChild = {}

	module.exports = domIndex

	function domIndex(rootNode, tree, indices, nodes) {
	    if (!indices || indices.length === 0) {
	        return {}
	    } else {
	        indices.sort(ascending)
	        return recurse(rootNode, tree, indices, nodes, 0)
	    }
	}

	function recurse(rootNode, tree, indices, nodes, rootIndex) {
	    nodes = nodes || {}


	    if (rootNode) {
	        if (indexInRange(indices, rootIndex, rootIndex)) {
	            nodes[rootIndex] = rootNode
	        }

	        var vChildren = tree.children

	        if (vChildren) {

	            var childNodes = rootNode.childNodes

	            for (var i = 0; i < tree.children.length; i++) {
	                rootIndex += 1

	                var vChild = vChildren[i] || noChild
	                var nextIndex = rootIndex + (vChild.count || 0)

	                // skip recursion down the tree if there are no nodes down here
	                if (indexInRange(indices, rootIndex, nextIndex)) {
	                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
	                }

	                rootIndex = nextIndex
	            }
	        }
	    }

	    return nodes
	}

	// Binary search for an index in the interval [left, right]
	function indexInRange(indices, left, right) {
	    if (indices.length === 0) {
	        return false
	    }

	    var minIndex = 0
	    var maxIndex = indices.length - 1
	    var currentIndex
	    var currentItem

	    while (minIndex <= maxIndex) {
	        currentIndex = ((maxIndex + minIndex) / 2) >> 0
	        currentItem = indices[currentIndex]

	        if (minIndex === maxIndex) {
	            return currentItem >= left && currentItem <= right
	        } else if (currentItem < left) {
	            minIndex = currentIndex + 1
	        } else  if (currentItem > right) {
	            maxIndex = currentIndex - 1
	        } else {
	            return true
	        }
	    }

	    return false;
	}

	function ascending(a, b) {
	    return a > b ? 1 : -1
	}


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var applyProperties = __webpack_require__(19)

	var isWidget = __webpack_require__(25)
	var VPatch = __webpack_require__(31)

	var updateWidget = __webpack_require__(37)

	module.exports = applyPatch

	function applyPatch(vpatch, domNode, renderOptions) {
	    var type = vpatch.type
	    var vNode = vpatch.vNode
	    var patch = vpatch.patch

	    switch (type) {
	        case VPatch.REMOVE:
	            return removeNode(domNode, vNode)
	        case VPatch.INSERT:
	            return insertNode(domNode, patch, renderOptions)
	        case VPatch.VTEXT:
	            return stringPatch(domNode, vNode, patch, renderOptions)
	        case VPatch.WIDGET:
	            return widgetPatch(domNode, vNode, patch, renderOptions)
	        case VPatch.VNODE:
	            return vNodePatch(domNode, vNode, patch, renderOptions)
	        case VPatch.ORDER:
	            reorderChildren(domNode, patch)
	            return domNode
	        case VPatch.PROPS:
	            applyProperties(domNode, patch, vNode.properties)
	            return domNode
	        case VPatch.THUNK:
	            return replaceRoot(domNode,
	                renderOptions.patch(domNode, patch, renderOptions))
	        default:
	            return domNode
	    }
	}

	function removeNode(domNode, vNode) {
	    var parentNode = domNode.parentNode

	    if (parentNode) {
	        parentNode.removeChild(domNode)
	    }

	    destroyWidget(domNode, vNode);

	    return null
	}

	function insertNode(parentNode, vNode, renderOptions) {
	    var newNode = renderOptions.render(vNode, renderOptions)

	    if (parentNode) {
	        parentNode.appendChild(newNode)
	    }

	    return parentNode
	}

	function stringPatch(domNode, leftVNode, vText, renderOptions) {
	    var newNode

	    if (domNode.nodeType === 3) {
	        domNode.replaceData(0, domNode.length, vText.text)
	        newNode = domNode
	    } else {
	        var parentNode = domNode.parentNode
	        newNode = renderOptions.render(vText, renderOptions)

	        if (parentNode && newNode !== domNode) {
	            parentNode.replaceChild(newNode, domNode)
	        }
	    }

	    return newNode
	}

	function widgetPatch(domNode, leftVNode, widget, renderOptions) {
	    var updating = updateWidget(leftVNode, widget)
	    var newNode

	    if (updating) {
	        newNode = widget.update(leftVNode, domNode) || domNode
	    } else {
	        newNode = renderOptions.render(widget, renderOptions)
	    }

	    var parentNode = domNode.parentNode

	    if (parentNode && newNode !== domNode) {
	        parentNode.replaceChild(newNode, domNode)
	    }

	    if (!updating) {
	        destroyWidget(domNode, leftVNode)
	    }

	    return newNode
	}

	function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
	    var parentNode = domNode.parentNode
	    var newNode = renderOptions.render(vNode, renderOptions)

	    if (parentNode && newNode !== domNode) {
	        parentNode.replaceChild(newNode, domNode)
	    }

	    return newNode
	}

	function destroyWidget(domNode, w) {
	    if (typeof w.destroy === "function" && isWidget(w)) {
	        w.destroy(domNode)
	    }
	}

	function reorderChildren(domNode, moves) {
	    var childNodes = domNode.childNodes
	    var keyMap = {}
	    var node
	    var remove
	    var insert

	    for (var i = 0; i < moves.removes.length; i++) {
	        remove = moves.removes[i]
	        node = childNodes[remove.from]
	        if (remove.key) {
	            keyMap[remove.key] = node
	        }
	        domNode.removeChild(node)
	    }

	    var length = childNodes.length
	    for (var j = 0; j < moves.inserts.length; j++) {
	        insert = moves.inserts[j]
	        node = keyMap[insert.key]
	        // this is the weirdest bug i've ever seen in webkit
	        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
	    }
	}

	function replaceRoot(oldRoot, newRoot) {
	    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
	        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
	    }

	    return newRoot;
	}


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var isWidget = __webpack_require__(25)

	module.exports = updateWidget

	function updateWidget(a, b) {
	    if (isWidget(a) && isWidget(b)) {
	        if ("name" in a && "name" in b) {
	            return a.id === b.id
	        } else {
	            return a.init === b.init
	        }
	    }

	    return false
	}


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isArray = __webpack_require__(30);

	var VNode = __webpack_require__(39);
	var VText = __webpack_require__(40);
	var isVNode = __webpack_require__(22);
	var isVText = __webpack_require__(24);
	var isWidget = __webpack_require__(25);
	var isHook = __webpack_require__(21);
	var isVThunk = __webpack_require__(27);

	var parseTag = __webpack_require__(41);
	var softSetHook = __webpack_require__(43);
	var evHook = __webpack_require__(44);

	module.exports = h;

	function h(tagName, properties, children) {
	    var childNodes = [];
	    var tag, props, key, namespace;

	    if (!children && isChildren(properties)) {
	        children = properties;
	        props = {};
	    }

	    props = props || properties || {};
	    tag = parseTag(tagName, props);

	    // support keys
	    if (props.hasOwnProperty('key')) {
	        key = props.key;
	        props.key = undefined;
	    }

	    // support namespace
	    if (props.hasOwnProperty('namespace')) {
	        namespace = props.namespace;
	        props.namespace = undefined;
	    }

	    // fix cursor bug
	    if (tag === 'INPUT' &&
	        !namespace &&
	        props.hasOwnProperty('value') &&
	        props.value !== undefined &&
	        !isHook(props.value)
	    ) {
	        props.value = softSetHook(props.value);
	    }

	    transformProperties(props);

	    if (children !== undefined && children !== null) {
	        addChild(children, childNodes, tag, props);
	    }


	    return new VNode(tag, props, childNodes, key, namespace);
	}

	function addChild(c, childNodes, tag, props) {
	    if (typeof c === 'string') {
	        childNodes.push(new VText(c));
	    } else if (typeof c === 'number') {
	        childNodes.push(new VText(String(c)));
	    } else if (isChild(c)) {
	        childNodes.push(c);
	    } else if (isArray(c)) {
	        for (var i = 0; i < c.length; i++) {
	            addChild(c[i], childNodes, tag, props);
	        }
	    } else if (c === null || c === undefined) {
	        return;
	    } else {
	        throw UnexpectedVirtualElement({
	            foreignObject: c,
	            parentVnode: {
	                tagName: tag,
	                properties: props
	            }
	        });
	    }
	}

	function transformProperties(props) {
	    for (var propName in props) {
	        if (props.hasOwnProperty(propName)) {
	            var value = props[propName];

	            if (isHook(value)) {
	                continue;
	            }

	            if (propName.substr(0, 3) === 'ev-') {
	                // add ev-foo support
	                props[propName] = evHook(value);
	            }
	        }
	    }
	}

	function isChild(x) {
	    return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
	}

	function isChildren(x) {
	    return typeof x === 'string' || isArray(x) || isChild(x);
	}

	function UnexpectedVirtualElement(data) {
	    var err = new Error();

	    err.type = 'virtual-hyperscript.unexpected.virtual-element';
	    err.message = 'Unexpected virtual child passed to h().\n' +
	        'Expected a VNode / Vthunk / VWidget / string but:\n' +
	        'got:\n' +
	        errorString(data.foreignObject) +
	        '.\n' +
	        'The parent vnode is:\n' +
	        errorString(data.parentVnode)
	        '\n' +
	        'Suggested fix: change your `h(..., [ ... ])` callsite.';
	    err.foreignObject = data.foreignObject;
	    err.parentVnode = data.parentVnode;

	    return err;
	}

	function errorString(obj) {
	    try {
	        return JSON.stringify(obj, null, '    ');
	    } catch (e) {
	        return String(obj);
	    }
	}


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var version = __webpack_require__(23)
	var isVNode = __webpack_require__(22)
	var isWidget = __webpack_require__(25)
	var isThunk = __webpack_require__(27)
	var isVHook = __webpack_require__(21)

	module.exports = VirtualNode

	var noProperties = {}
	var noChildren = []

	function VirtualNode(tagName, properties, children, key, namespace) {
	    this.tagName = tagName
	    this.properties = properties || noProperties
	    this.children = children || noChildren
	    this.key = key != null ? String(key) : undefined
	    this.namespace = (typeof namespace === "string") ? namespace : null

	    var count = (children && children.length) || 0
	    var descendants = 0
	    var hasWidgets = false
	    var hasThunks = false
	    var descendantHooks = false
	    var hooks

	    for (var propName in properties) {
	        if (properties.hasOwnProperty(propName)) {
	            var property = properties[propName]
	            if (isVHook(property) && property.unhook) {
	                if (!hooks) {
	                    hooks = {}
	                }

	                hooks[propName] = property
	            }
	        }
	    }

	    for (var i = 0; i < count; i++) {
	        var child = children[i]
	        if (isVNode(child)) {
	            descendants += child.count || 0

	            if (!hasWidgets && child.hasWidgets) {
	                hasWidgets = true
	            }

	            if (!hasThunks && child.hasThunks) {
	                hasThunks = true
	            }

	            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
	                descendantHooks = true
	            }
	        } else if (!hasWidgets && isWidget(child)) {
	            if (typeof child.destroy === "function") {
	                hasWidgets = true
	            }
	        } else if (!hasThunks && isThunk(child)) {
	            hasThunks = true;
	        }
	    }

	    this.count = count + descendants
	    this.hasWidgets = hasWidgets
	    this.hasThunks = hasThunks
	    this.hooks = hooks
	    this.descendantHooks = descendantHooks
	}

	VirtualNode.prototype.version = version
	VirtualNode.prototype.type = "VirtualNode"


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var version = __webpack_require__(23)

	module.exports = VirtualText

	function VirtualText(text) {
	    this.text = String(text)
	}

	VirtualText.prototype.version = version
	VirtualText.prototype.type = "VirtualText"


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var split = __webpack_require__(42);

	var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
	var notClassId = /^\.|#/;

	module.exports = parseTag;

	function parseTag(tag, props) {
	    if (!tag) {
	        return 'DIV';
	    }

	    var noId = !(props.hasOwnProperty('id'));

	    var tagParts = split(tag, classIdSplit);
	    var tagName = null;

	    if (notClassId.test(tagParts[1])) {
	        tagName = 'DIV';
	    }

	    var classes, part, type, i;

	    for (i = 0; i < tagParts.length; i++) {
	        part = tagParts[i];

	        if (!part) {
	            continue;
	        }

	        type = part.charAt(0);

	        if (!tagName) {
	            tagName = part;
	        } else if (type === '.') {
	            classes = classes || [];
	            classes.push(part.substring(1, part.length));
	        } else if (type === '#' && noId) {
	            props.id = part.substring(1, part.length);
	        }
	    }

	    if (classes) {
	        if (props.className) {
	            classes.push(props.className);
	        }

	        props.className = classes.join(' ');
	    }

	    return props.namespace ? tagName : tagName.toUpperCase();
	}


/***/ },
/* 42 */
/***/ function(module, exports) {

	/*!
	 * Cross-Browser Split 1.1.1
	 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
	 * Available under the MIT License
	 * ECMAScript compliant, uniform cross-browser split method
	 */

	/**
	 * Splits a string into an array of strings using a regex or string separator. Matches of the
	 * separator are not included in the result array. However, if `separator` is a regex that contains
	 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
	 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
	 * cross-browser.
	 * @param {String} str String to split.
	 * @param {RegExp|String} separator Regex or string to use for separating the string.
	 * @param {Number} [limit] Maximum number of items to include in the result array.
	 * @returns {Array} Array of substrings.
	 * @example
	 *
	 * // Basic use
	 * split('a b c d', ' ');
	 * // -> ['a', 'b', 'c', 'd']
	 *
	 * // With limit
	 * split('a b c d', ' ', 2);
	 * // -> ['a', 'b']
	 *
	 * // Backreferences in result array
	 * split('..word1 word2..', /([a-z]+)(\d+)/i);
	 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
	 */
	module.exports = (function split(undef) {

	  var nativeSplit = String.prototype.split,
	    compliantExecNpcg = /()??/.exec("")[1] === undef,
	    // NPCG: nonparticipating capturing group
	    self;

	  self = function(str, separator, limit) {
	    // If `separator` is not a regex, use `nativeSplit`
	    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
	      return nativeSplit.call(str, separator, limit);
	    }
	    var output = [],
	      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
	      (separator.sticky ? "y" : ""),
	      // Firefox 3+
	      lastLastIndex = 0,
	      // Make `global` and avoid `lastIndex` issues by working with a copy
	      separator = new RegExp(separator.source, flags + "g"),
	      separator2, match, lastIndex, lastLength;
	    str += ""; // Type-convert
	    if (!compliantExecNpcg) {
	      // Doesn't need flags gy, but they don't hurt
	      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
	    }
	    /* Values for `limit`, per the spec:
	     * If undefined: 4294967295 // Math.pow(2, 32) - 1
	     * If 0, Infinity, or NaN: 0
	     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
	     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
	     * If other: Type-convert, then use the above rules
	     */
	    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
	    limit >>> 0; // ToUint32(limit)
	    while (match = separator.exec(str)) {
	      // `separator.lastIndex` is not reliable cross-browser
	      lastIndex = match.index + match[0].length;
	      if (lastIndex > lastLastIndex) {
	        output.push(str.slice(lastLastIndex, match.index));
	        // Fix browsers whose `exec` methods don't consistently return `undefined` for
	        // nonparticipating capturing groups
	        if (!compliantExecNpcg && match.length > 1) {
	          match[0].replace(separator2, function() {
	            for (var i = 1; i < arguments.length - 2; i++) {
	              if (arguments[i] === undef) {
	                match[i] = undef;
	              }
	            }
	          });
	        }
	        if (match.length > 1 && match.index < str.length) {
	          Array.prototype.push.apply(output, match.slice(1));
	        }
	        lastLength = match[0].length;
	        lastLastIndex = lastIndex;
	        if (output.length >= limit) {
	          break;
	        }
	      }
	      if (separator.lastIndex === match.index) {
	        separator.lastIndex++; // Avoid an infinite loop
	      }
	    }
	    if (lastLastIndex === str.length) {
	      if (lastLength || !separator.test("")) {
	        output.push("");
	      }
	    } else {
	      output.push(str.slice(lastLastIndex));
	    }
	    return output.length > limit ? output.slice(0, limit) : output;
	  };

	  return self;
	})();


/***/ },
/* 43 */
/***/ function(module, exports) {

	'use strict';

	module.exports = SoftSetHook;

	function SoftSetHook(value) {
	    if (!(this instanceof SoftSetHook)) {
	        return new SoftSetHook(value);
	    }

	    this.value = value;
	}

	SoftSetHook.prototype.hook = function (node, propertyName) {
	    if (node[propertyName] !== this.value) {
	        node[propertyName] = this.value;
	    }
	};


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var EvStore = __webpack_require__(45);

	module.exports = EvHook;

	function EvHook(value) {
	    if (!(this instanceof EvHook)) {
	        return new EvHook(value);
	    }

	    this.value = value;
	}

	EvHook.prototype.hook = function (node, propertyName) {
	    var es = EvStore(node);
	    var propName = propertyName.substr(3);

	    es[propName] = this.value;
	};

	EvHook.prototype.unhook = function(node, propertyName) {
	    var es = EvStore(node);
	    var propName = propertyName.substr(3);

	    es[propName] = undefined;
	};


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var OneVersionConstraint = __webpack_require__(46);

	var MY_VERSION = '7';
	OneVersionConstraint('ev-store', MY_VERSION);

	var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

	module.exports = EvStore;

	function EvStore(elem) {
	    var hash = elem[hashKey];

	    if (!hash) {
	        hash = elem[hashKey] = {};
	    }

	    return hash;
	}


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Individual = __webpack_require__(47);

	module.exports = OneVersion;

	function OneVersion(moduleName, version, defaultValue) {
	    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
	    var enforceKey = key + '_ENFORCE_SINGLETON';

	    var versionValue = Individual(enforceKey, version);

	    if (versionValue !== version) {
	        throw new Error('Can only have one copy of ' +
	            moduleName + '.\n' +
	            'You already have version ' + versionValue +
	            ' installed.\n' +
	            'This means you cannot install version ' + version);
	    }

	    return Individual(key, defaultValue);
	}


/***/ },
/* 47 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	/*global window, global*/

	var root = typeof window !== 'undefined' ?
	    window : typeof global !== 'undefined' ?
	    global : {};

	module.exports = Individual;

	function Individual(key, value) {
	    if (key in root) {
	        return root[key];
	    }

	    root[key] = value;

	    return value;
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 48 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	// shim HTMLElement if necessary
	// Safari breaks when attempting to inherit from HTMLElement
	// Babel marked as wontfix because, well, it's not really
	// a language issue: https://phabricator.babeljs.io/T1548
	if (typeof HTMLElement !== 'function') {
	  var _HTMLElement = function _HTMLElement() {};
	  _HTMLElement.prototype = HTMLElement.prototype;
	  HTMLElement = _HTMLElement;
	}

	// thin wrapper around HTMLElement with convenience methods

	var WebComponent = function (_HTMLElement2) {
	  _inherits(WebComponent, _HTMLElement2);

	  function WebComponent() {
	    _classCallCheck(this, WebComponent);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(WebComponent).apply(this, arguments));
	  }

	  _createClass(WebComponent, [{
	    key: 'getJSONAttribute',


	    // parse an attribute which has been serialized as JSON
	    // pass an optional errorHandler in case JSON.parse() fails
	    value: function getJSONAttribute(attrName) {
	      var errorHandler = arguments.length <= 1 || arguments[1] === undefined ? function () {
	        return null;
	      } : arguments[1];

	      try {
	        return JSON.parse(this.getAttribute(attrName));
	      } catch (e) {
	        return errorHandler(attrName, e);
	      }
	    }

	    // check whether a boolean attribute is 'enabled' in an element instance
	    // taking into account usages such as:
	    // <my-element myattr="true">    -> enabled
	    // <my-element myattr>           -> enabled
	    // <my-element myattr="myattr">  -> enabled
	    // <my-element myattr="false">   -> disabled
	    // <my-element>                  -> disabled

	  }, {
	    key: 'isAttributeEnabled',
	    value: function isAttributeEnabled(attrName) {
	      var attrVal = this.getAttribute(attrName);
	      return typeof attrVal === 'string' && ['', 'true', attrName.toLowerCase()].indexOf(attrVal.toLowerCase()) !== -1;
	    }
	  }]);

	  return WebComponent;
	}(HTMLElement);

	exports.default = WebComponent;

/***/ },
/* 49 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// just the necessary bits of Backbone router+history

	var Router = function () {
	  function Router(app) {
	    var _this = this;

	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    _classCallCheck(this, Router);

	    // allow injecting window dep
	    var routerWindow = this.window = options.window || window;

	    this.app = app;
	    var routeDefs = this.app.getConfig('routes');

	    // https://github.com/jashkenas/backbone/blob/d682061a/backbone.js#L1476-L1479
	    // Cached regular expressions for matching named param parts and splatted
	    // parts of route strings.
	    var optionalParam = /\((.*?)\)/g;
	    var namedParam = /(\(\?)?:\w+/g;
	    var splatParam = /\*\w+/g;
	    var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
	    this.compiledRoutes = Object.keys(routeDefs).map(function (routeExpr) {
	      // https://github.com/jashkenas/backbone/blob/d682061a/backbone.js#L1537-L1547
	      var expr = routeExpr.replace(escapeRegExp, '\\$&').replace(optionalParam, '(?:$1)?').replace(namedParam, function (match, optional) {
	        return optional ? match : '([^/?]+)';
	      }).replace(splatParam, '([^?]*?)');
	      expr = new RegExp('^' + expr + '(?:\\?([\\s\\S]*))?$');

	      // hook up route handler function
	      var handler = routeDefs[routeExpr];
	      if (typeof handler === 'string') {
	        // reference to another handler rather than its own function
	        handler = routeDefs[handler];
	      }

	      return { expr: expr, handler: handler };
	    });

	    var navigateToHash = function navigateToHash() {
	      return _this.navigate(routerWindow.location.hash);
	    };
	    routerWindow.addEventListener('popstate', function () {
	      return navigateToHash();
	    });

	    this.historyMethod = options.historyMethod || 'pushState';
	    var origChangeState = routerWindow.history[this.historyMethod];
	    routerWindow.history[this.historyMethod] = function () {
	      origChangeState.apply(routerWindow.history, arguments);
	      navigateToHash();
	    };
	  }

	  _createClass(Router, [{
	    key: 'navigate',
	    value: function navigate(fragment) {
	      var _this2 = this;

	      var stateUpdate = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	      fragment = stripHash(fragment);
	      if (fragment === this.app.state.$fragment && !Object.keys(stateUpdate).length) {
	        return;
	      }

	      stateUpdate.$fragment = fragment;
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = this.compiledRoutes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var route = _step.value;

	          var matches = route.expr.exec(fragment);
	          if (matches) {
	            var _ret = function () {
	              // extract params
	              // https://github.com/jashkenas/backbone/blob/d682061a/backbone.js#L1553-L1558
	              var params = matches.slice(1);
	              params = params.map(function (param, i) {
	                // Don't decode the search params.
	                if (i === params.length - 1) {
	                  return param || null;
	                }
	                return param ? decodeURIComponent(param) : null;
	              });

	              var routeHandler = route.handler;
	              if (!routeHandler) {
	                throw 'No route handler defined for #' + fragment;
	              }
	              var routeStateUpdate = routeHandler.call.apply(routeHandler, [_this2.app, stateUpdate].concat(_toConsumableArray(params)));
	              if (routeStateUpdate) {
	                // don't update if route handler returned a falsey result
	                _this2.app.update(Object.assign({}, stateUpdate, routeStateUpdate));
	              }
	              return {
	                v: void 0
	              };
	            }();

	            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	          }
	        }

	        // no route matched
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }

	      console.error('No route found matching #' + fragment);
	    }
	  }, {
	    key: 'replaceHash',
	    value: function replaceHash(fragment) {
	      fragment = stripHash(fragment);
	      if (fragment !== stripHash(this.window.location.hash)) {
	        this.window.history[this.historyMethod](null, null, '#' + fragment);
	      }
	    }
	  }]);

	  return Router;
	}();

	exports.default = Router;


	function stripHash(fragment) {
	  return fragment.replace(/^#*/, '');
	}

/***/ },
/* 50 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.registerMPComponent = registerMPComponent;
	/**
	 * Supports registering MP web components safely even when multiple
	 * copies of this library are loaded separately on the same page
	 * (e.g., autotrack editor on a page which already has these components).
	 */
	function registerMPComponent(tagName, componentClass) {
	  var registry = window['mp-common-registered-components'];
	  if (!registry) {
	    window['mp-common-registered-components'] = registry = {};
	  }

	  if (!registry[tagName]) {
	    registry[tagName] = document.registerElement(tagName, componentClass);
	  }
	}

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var h = __webpack_require__(38)

	module.exports = h


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _panel = __webpack_require__(5);

	var _registration = __webpack_require__(50);

	var _utils = __webpack_require__(53);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	'use strict';

	var template = function render(locals) {
	  locals = locals || {};;;var result_of_with = function ($component, $helpers, Object, alertIcon, document, visibility) {
	    var h = __webpack_require__(51);function generateLiteralWidget(id, contents) {
	      function LiteralWidget(id, contents) {
	        this.name = 'LiteralWidget';this.id = id;

	        this.contents = contents;
	      }LiteralWidget.prototype.type = 'Widget';LiteralWidget.prototype.init = function () {
	        var wrapper = document.createElement('div');wrapper.innerHTML = this.contents;var root;if (wrapper.childNodes.length === 1) {
	          root = wrapper.firstChild;
	        } else {
	          root = wrapper;
	        }return root;
	      };LiteralWidget.prototype.update = function (previous, domNode) {
	        return domNode;
	      }; // 'render' is called by the vdom-to-html module which is used in the unit tests
	      LiteralWidget.prototype.render = function () {
	        var h = __webpack_require__(51);var host = document.createElement('div');host.appendChild(this.init());return h('text', host.innerHTML);
	      };return new LiteralWidget(id, contents);
	    };var __objToAttrs = function __objToAttrs(o) {
	      return Object.keys(o).map(function (k) {
	        return o[k] ? k : false;
	      });
	    };return { value: h("div", { "className": [].concat('mp-modal-stage').concat(__objToAttrs({ 'mp-modal-alert': $component.isAttributeEnabled('alert'), 'mp-modal-absolute': $component.isAttributeEnabled('not-fullscreen'), 'mp-modal-closed': visibility === 'closed' })).filter(Boolean).join(' ') }, function () {
	        var __jade_nodes = [];__jade_nodes = __jade_nodes.concat($helpers.getType() === 'modal' ? h("div", { "onclick": $helpers.backdropClicked, "className": [].concat('mp-modal-backdrop').concat('mp-modal-' + visibility + '').filter(Boolean).join(' ') }) : undefined);__jade_nodes = __jade_nodes.concat(h("div", { "className": [].concat('mp-modal-wrapper').filter(Boolean).join(' ')
	        }, [h("div", {

	          "style": $helpers.getModalStyles(), "className": [].concat('mp-modal-main').concat('mp-modal-' + visibility + '').filter(Boolean).join(' ') }, function () {
	          var __jade_nodes = [];__jade_nodes = __jade_nodes.concat($component.isAttributeEnabled('closeable') ? h("div", { "onclick": $helpers.closeClicked, "className": [].concat('mp-modal-close-btn').filter(Boolean).join(' ') }, [h("div", { "className": [].concat('mp-modal-close-icon').filter(Boolean).join(' ') }, [generateLiteralWidget(1, '<?xml version="1.0" encoding="utf-8"?><!-- Generator: Adobe Illustrator 19.2.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 10.6 10.5" style="enable-background:new 0 0 10.6 10.5;" xml:space="preserve"><style type="text/css">	.x{fill-rule:evenodd;clip-rule:evenodd;fill:#D8E0E7;}</style><path class="x" d="M8.6,0L5.3,3.3L2,0L0,2l3.3,3.3L0,8.5l2,2l3.2-3.2l3.2,3.2l2-2L7.3,5.3L10.6,2L8.6,0z"/></svg>')].filter(Boolean))].filter(Boolean)) : undefined);
	          __jade_nodes = __jade_nodes.concat(h("div", { "className": [].concat('mp-modal-top-container').concat(__objToAttrs({ 'mp-modal-alert': $component.isAttributeEnabled('alert') })).filter(Boolean).join(' ') }, function () {
	            var __jade_nodes = [];__jade_nodes = __jade_nodes.concat($component.isAttributeEnabled('alert') ? h("div", { "className": [].concat('mp-modal-content-row').filter(Boolean).join(' ') }, [h("div", { "className": [].concat('mp-modal-alert-icon').filter(Boolean).join(' ') }, [generateLiteralWidget(2, '<?xml version="1.0" encoding="utf-8"?><!-- Generator: Adobe Illustrator 19.2.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 33 30" style="enable-background:new 0 0 33 30;" xml:space="preserve"><style type="text/css">	.mp-modal-alert-icon-fill{fill:#D8E0E7;}</style><path class="mp-modal-alert-icon-fill" d="M32.2,24L20,2.5c-1.9-3.3-5-3.3-6.9,0L0.8,23.6C-1.1,26.9,0.5,30,4.2,30h24.5C32.5,30,34.1,27.3,32.2,24z	 M16.6,26c-1.2,0-2.1-0.9-2.1-2.1c0-1.2,0.9-2.1,2.1-2.1c1.2,0,2.1,0.9,2.1,2.1C18.7,25.1,17.8,26,16.6,26z M18.1,20.4h-3l-1-12.3h5	L18.1,20.4z"/></svg>')].filter(Boolean)), h("content", { "select": '[slot-body]' })].filter(Boolean)) : h("content", { "select": '[slot-body]' }));;return __jade_nodes;
	          }.call(this).filter(Boolean)));__jade_nodes = __jade_nodes.concat(!alertIcon ? h("div", { "className": [].concat('mp-modal-button-container').filter(Boolean).join(' ') }, [h("content", { "select": '[slot-button]' })].filter(Boolean)) : undefined);;return __jade_nodes;
	        }.call(this).filter(Boolean))].filter(Boolean)));;return __jade_nodes;
	      }.call(this).filter(Boolean)) };
	  }.call(this, "$component" in locals ? locals.$component : typeof $component !== "undefined" ? $component : undefined, "$helpers" in locals ? locals.$helpers : typeof $helpers !== "undefined" ? $helpers : undefined, "Object" in locals ? locals.Object : typeof Object !== "undefined" ? Object : undefined, "alertIcon" in locals ? locals.alertIcon : typeof alertIcon !== "undefined" ? alertIcon : undefined, "document" in locals ? locals.document : typeof document !== "undefined" ? document : undefined, "visibility" in locals ? locals.visibility : typeof visibility !== "undefined" ? visibility : undefined);if (result_of_with) return result_of_with.value;
	};var css = 'a {   cursor: pointer;   text-decoration: none; } a, a:visited {   color: #3b99f0; } a:hover {   color: #4ba8ff; } .mp-font-title {   font-family: \'Proxima Nova\', \'proxima-nova\', sans-serif;   font-size: 18px;   font-weight: 700;   line-height: 1.4;   color: #4c6072; } .mp-font-subtitle {   font-family: \'Proxima Nova\', \'proxima-nova\', sans-serif;   font-size: 15px;   font-weight: 600;   line-height: 18px;   color: #4c6072; } .mp-font-list-item {   font-family: \'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif;   font-size: 13px;   line-height: 1.7;   color: #6e859d; } .mp-font-paragraph {   font-family: \'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif;   font-size: 14px;   font-weight: normal;   line-height: 18px;   color: #6e859d; } * {   -webkit-font-smoothing: antialiased; } .mp-modal-stage {   bottom: 0;   box-sizing: border-box;   left: 0;   pointer-events: none;   position: fixed;   right: 0;   top: 0;   z-index: 10; } .mp-modal-stage.mp-modal-closed {   display: none; } .mp-modal-stage.mp-modal-absolute, .mp-modal-stage.mp-modal-absolute .mp-modal-backdrop, .mp-modal-stage.mp-modal-absolute .mp-modal-wrapper {   position: absolute; } .mp-modal-stage .mp-modal-backdrop {   background: #45566d;   height: 100%;   position: fixed;   pointer-events: auto;   width: 100%;   z-index: 1; } .mp-modal-stage .mp-modal-backdrop.mp-modal-opening {   -webkit-animation: fadeOverlayIn 300ms forwards;           animation: fadeOverlayIn 300ms forwards;   opacity: 0; } .mp-modal-stage .mp-modal-backdrop.mp-modal-open {   opacity: 0.9; } .mp-modal-stage .mp-modal-backdrop.mp-modal-closing {   -webkit-animation: fadeOverlayOut 300ms forwards;           animation: fadeOverlayOut 300ms forwards; } .mp-modal-stage .mp-modal-backdrop.mp-modal-closed {   opacity: 0; } .mp-modal-stage .mp-modal-wrapper {   display: -webkit-box;   display: -ms-flexbox;   display: flex;   height: 100%;   -webkit-box-pack: center;       -ms-flex-pack: center;           justify-content: center;   -webkit-box-align: center;       -ms-flex-align: center;           align-items: center;   pointer-events: none;   position: fixed;   width: 100%;   z-index: 2; } .mp-modal-stage .mp-modal-wrapper .mp-modal-main {   border-radius: 6px;   box-shadow: 0 1px 3px 0 rgba(1,1,1,0.28);   max-width: 530px;   pointer-events: auto;   position: relative;   z-index: 2; } .mp-modal-stage .mp-modal-wrapper .mp-modal-main.mp-modal-opening {   -webkit-animation: fadeModalIn 300ms forwards 100ms;           animation: fadeModalIn 300ms forwards 100ms;   opacity: 0; } .mp-modal-stage .mp-modal-wrapper .mp-modal-main.mp-modal-open {   opacity: 1; } .mp-modal-stage .mp-modal-wrapper .mp-modal-main.mp-modal-closing {   -webkit-animation: fadeModalOut 200ms forwards;           animation: fadeModalOut 200ms forwards; } .mp-modal-stage .mp-modal-wrapper .mp-modal-main.mp-modal-closed {   opacity: 0; } .mp-modal-stage .mp-modal-wrapper .mp-modal-main .mp-modal-close-btn {   cursor: pointer;   float: right;   height: 10px;   position: absolute;   right: 15px;   top: 15px; } .mp-modal-stage .mp-modal-wrapper .mp-modal-main .mp-modal-close-btn .mp-modal-close-icon svg {   width: 10px; } .mp-modal-stage .mp-modal-wrapper .mp-modal-main .mp-modal-close-btn .mp-modal-close-icon svg path {   fill: #d8e0e7; } .mp-modal-stage .mp-modal-wrapper .mp-modal-main .mp-modal-close-btn:hover .mp-modal-close-icon svg path {   fill: #c1ccd6; } .mp-modal-stage .mp-modal-top-container {   background: #fff;   border-radius: 6px 6px 0 0;   padding: 30px 60px;   text-align: center; } .mp-modal-stage .mp-modal-top-container.mp-modal-alert {   border-radius: 6px;   padding: 20px 40px 30px; } .mp-modal-stage .mp-modal-title {   font-family: \'Proxima Nova\', \'proxima-nova\', sans-serif;   font-size: 18px;   font-weight: 700;   line-height: 1.4;   color: #4c6072;   font-weight: 600; } .mp-modal-stage .mp-modal-subtitle {   font-family: \'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif;   font-size: 14px;   font-weight: normal;   line-height: 18px;   color: #6e859d;   color: #6e859d;   margin: 12px 0; } .mp-modal-stage .mp-modal-alert-title {   font-family: \'Proxima Nova\', \'proxima-nova\', sans-serif;   font-size: 18px;   font-weight: 700;   line-height: 1.4;   color: #4c6072;   text-align: left; } .mp-modal-stage .mp-modal-alert-subtitle {   font-family: \'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif;   font-size: 14px;   font-weight: normal;   line-height: 18px;   color: #6e859d;   font-weight: normal;   text-align: left;   white-space: pre-wrap; } .mp-modal-stage content::content .mp-modal-title {   font-family: \'Proxima Nova\', \'proxima-nova\', sans-serif;   font-size: 18px;   font-weight: 700;   line-height: 1.4;   color: #4c6072;   font-weight: 600; } .mp-modal-stage content::content .mp-modal-subtitle {   font-family: \'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif;   font-size: 14px;   font-weight: normal;   line-height: 18px;   color: #6e859d;   color: #6e859d;   margin: 12px 0; } .mp-modal-stage content::content .mp-modal-alert-title {   font-family: \'Proxima Nova\', \'proxima-nova\', sans-serif;   font-size: 18px;   font-weight: 700;   line-height: 1.4;   color: #4c6072;   text-align: left; } .mp-modal-stage content::content .mp-modal-alert-subtitle {   font-family: \'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif;   font-size: 14px;   font-weight: normal;   line-height: 18px;   color: #6e859d;   font-weight: normal;   text-align: left;   white-space: pre-wrap; } .mp-modal-stage .mp-modal-content-row {   -webkit-box-align: start;       -ms-flex-align: start;           align-items: flex-start;   display: -webkit-box;   display: -ms-flexbox;   display: flex;   white-space: nowrap;   width: 340px; } .mp-modal-stage .mp-modal-content-row .mp-modal-alert-icon {   height: 30px;   margin-top: 10px;   margin-right: 15px;   white-space: normal;   width: 33px; } .mp-modal-stage .mp-modal-content-row .mp-modal-alert-icon svg {   height: 29px; } .mp-modal-stage .mp-modal-content-row .mp-modal-alert-icon svg .mp-modal-alert-icon-fill {   fill: #e4567b; } @-webkit-keyframes fadeOverlayIn {   from {     opacity: 0;   }   to {     opacity: 0.9;   } } @keyframes fadeOverlayIn {   from {     opacity: 0;   }   to {     opacity: 0.9;   } } @-webkit-keyframes fadeOverlayOut {   from {     opacity: 0.9;   }   to {     opacity: 0;   } } @keyframes fadeOverlayOut {   from {     opacity: 0.9;   }   to {     opacity: 0;   } } @-webkit-keyframes fadeModalIn {   from {     -webkit-transform: scale(1.1, 1.1);             transform: scale(1.1, 1.1);     opacity: 0;   }   to {     -webkit-transform: scale(1, 1);             transform: scale(1, 1);     opacity: 1;   } } @keyframes fadeModalIn {   from {     -webkit-transform: scale(1.1, 1.1);             transform: scale(1.1, 1.1);     opacity: 0;   }   to {     -webkit-transform: scale(1, 1);             transform: scale(1, 1);     opacity: 1;   } } @-webkit-keyframes fadeModalOut {   from {     -webkit-transform: scale(1, 1);             transform: scale(1, 1);     opacity: 1;   }   to {     -webkit-transform: scale(1.1, 1.1);             transform: scale(1.1, 1.1);     opacity: 0;   } } @keyframes fadeModalOut {   from {     -webkit-transform: scale(1, 1);             transform: scale(1, 1);     opacity: 1;   }   to {     -webkit-transform: scale(1.1, 1.1);             transform: scale(1.1, 1.1);     opacity: 0;   } } ';


	var VISIBILITY_OPEN = 'open';
	var VISIBILITY_OPENING = 'opening';
	var VISIBILITY_CLOSED = 'closed';
	var VISIBILITY_CLOSING = 'closing';(0, _registration.registerMPComponent)('mp-modal', function (_Component) {
	  _inherits(_class, _Component);

	  function _class() {
	    _classCallCheck(this, _class);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(_class).apply(this, arguments));
	  }

	  _createClass(_class, [{
	    key: 'close',
	    value: function close() {
	      switch (this.state.visibility) {
	        case VISIBILITY_CLOSED:
	        case VISIBILITY_CLOSING:
	          break;
	        case VISIBILITY_OPENING:
	          this.update({ visibility: VISIBILITY_CLOSED });
	          break;
	        case VISIBILITY_OPEN:
	          this._pendingAnimations = ['fadeModalOut'];
	          if (this.config.helpers.getType() === 'modal') {
	            this._pendingAnimations.push('fadeOverlayOut');
	          }
	          this.update({ visibility: VISIBILITY_CLOSING });
	          break;
	      }
	    }
	  }, {
	    key: 'open',
	    value: function open() {
	      switch (this.state.visibility) {
	        case VISIBILITY_OPEN:
	        case VISIBILITY_OPENING:
	          break;
	        case VISIBILITY_CLOSING:
	          this.update({ visibility: VISIBILITY_OPEN });
	          break;
	        case VISIBILITY_CLOSED:
	          this._pendingAnimations = ['fadeModalIn'];
	          if (this.config.helpers.getType() === 'modal') {
	            this._pendingAnimations.push('fadeOverlayIn');
	          }
	          this.update({ visibility: VISIBILITY_OPENING });
	          break;}
	    }
	  }, {
	    key: 'attachedCallback',
	    value: function attachedCallback() {
	      var _this2 = this;

	      _get(Object.getPrototypeOf(_class.prototype), 'attachedCallback', this).apply(this, arguments);

	      // listen for escape keypress
	      this.maybeCloseOnEscape = function (e) {
	        if (_this2.isAttributeEnabled('closeable') && e.keyCode === 27) {
	          _this2.close();
	        }
	      };
	      document.body.addEventListener('keydown', this.maybeCloseOnEscape);

	      // transition between states after animations complete
	      this._onAnimationEnd = function (e) {
	        if (_this2._pendingAnimations.length === 0) {
	          return;
	        }
	        _this2._pendingAnimations = _this2._pendingAnimations.filter(function (anim) {
	          return anim !== e.animationName;
	        });
	        if (_this2._pendingAnimations.length > 0) {
	          return;
	        }
	        switch (_this2.state.visibility) {
	          case VISIBILITY_OPENING:
	            _this2.update({ visibility: VISIBILITY_OPEN });
	            _this2.dispatchEvent(new CustomEvent('change', { detail: { state: VISIBILITY_OPEN } }));
	            break;
	          case VISIBILITY_CLOSING:
	            _this2.update({ visibility: VISIBILITY_CLOSED });
	            _this2.dispatchEvent(new CustomEvent('change', { detail: { state: VISIBILITY_CLOSED } }));break;
	        }
	      };
	      (0, _utils.onAnimationEnd)(this.el, this._onAnimationEnd);

	      if (!this.isAttributeEnabled('closed')) {
	        // open the modal if it's not explicitly closed
	        this.open();
	      }
	    }
	  }, {
	    key: 'detachedCallback',
	    value: function detachedCallback() {
	      _get(Object.getPrototypeOf(_class.prototype), 'detachedCallback', this).apply(this, arguments);
	      document.body.removeEventListener('keydown', this.maybeCloseOnEscape);
	      (0, _utils.offAnimationEnd)(this.el, this._onAnimationEnd);
	    }
	  }, {
	    key: 'attributeChangedCallback',
	    value: function attributeChangedCallback(name) {
	      _get(Object.getPrototypeOf(_class.prototype), 'attributeChangedCallback', this).apply(this, arguments);
	      if (this.initialized && name === 'closed') {
	        if (this.isAttributeEnabled('closed')) {
	          this.close();
	        } else {
	          this.open();
	        }
	      }
	    }
	  }, {
	    key: 'config',
	    get: function get() {
	      var _this3 = this;

	      return {
	        css: css,
	        template: template,
	        useShadowDom: true,
	        defaultState: {
	          visibility: VISIBILITY_CLOSED
	        },
	        helpers: {
	          backdropClicked: function backdropClicked() {
	            if (_this3.isAttributeEnabled('closeable')) {
	              _this3.close();
	            }
	          },
	          closeClicked: function closeClicked() {
	            _this3.close();
	          }, getModalStyles: function getModalStyles() {
	            var style = {};
	            if (_this3.getAttribute('width')) {
	              style.width = _this3.getAttribute('width');
	            }
	            return style;
	          },
	          getType: function getType() {
	            return _this3.getAttribute('modal-type') || 'modal';
	          }
	        }
	      };
	    }
	  }]);

	  return _class;
	}(_panel.Component));

/***/ },
/* 53 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var ANIMATION_END_EVENTS = exports.ANIMATION_END_EVENTS = ['webkitAnimationEnd', 'animationend', 'oAnimationEnd', 'MSAnimationEnd'];

	var onAnimationEnd = exports.onAnimationEnd = function onAnimationEnd(el, callback) {
	  ANIMATION_END_EVENTS.forEach(function (e) {
	    return el.addEventListener(e, callback);
	  });
	};

	var offAnimationEnd = exports.offAnimationEnd = function offAnimationEnd(el, callback) {
	  ANIMATION_END_EVENTS.forEach(function (e) {
	    return el.removeEventListener(e, callback);
	  });
	};

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.SVG_ICONS = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _webcomponent = __webpack_require__(48);

	var _webcomponent2 = _interopRequireDefault(_webcomponent);

	var _registration = __webpack_require__(50);

	var _util = __webpack_require__(55);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _iconMap_alert = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M9.51 4.888l-5.223 9.031c-0.774 1.338 0.109 3.081 1.562 3.081h10.332c1.429 0 2.298-1.714 1.537-3.031l-5.252-9.081c-0.685-1.184-2.271-1.184-2.956 0zM10 7.5h2l-0.5 5h-1l-0.5-5zM12 14.5c0 0.552-0.448 1-1 1s-1-0.448-1-1c0-0.552 0.448-1 1-1s1 0.448 1 1z"></path>\n</svg>\n';
	var _iconMap_analysisCumulative = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M4.001 16c-0.347 0-0.685-0.181-0.869-0.504-0.274-0.479-0.108-1.090 0.372-1.364l14-8c0.478-0.275 1.090-0.108 1.364 0.372s0.108 1.090-0.372 1.364l-14 8c-0.156 0.090-0.327 0.132-0.495 0.132z"></path>\n</svg>\n';
	var _iconMap_analysisLinear = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M18 12h-14c-0.552 0-1-0.448-1-1s0.448-1 1-1h14c0.553 0 1 0.448 1 1s-0.447 1-1 1z"></path>\n</svg>\n';
	var _iconMap_analysisLogarithmic = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M18 4c-0.303 0-7.452 0.038-10.707 3.293-3.19 3.19-4.236 9.285-4.279 9.543-0.091 0.544 0.277 1.059 0.821 1.15 0.056 0.009 0.111 0.014 0.166 0.014 0.48 0 0.903-0.347 0.985-0.835 0.010-0.057 0.987-5.724 3.721-8.458 2.669-2.669 9.228-2.707 9.294-2.707 0.552 0 0.999-0.449 0.999-1-0.001-0.553-0.448-1-1-1z"></path>\n</svg>\n';
	var _iconMap_analysisRolling = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M19.707 10.293c-0.234-0.235-2.36-2.293-4.707-2.293s-4.473 2.058-4.706 2.292c-0.479 0.475-2.004 1.708-3.294 1.708s-2.815-1.233-3.294-1.708c-0.391-0.389-1.025-0.387-1.414 0.003-0.389 0.391-0.389 1.022 0.001 1.412 0.234 0.235 2.36 2.293 4.707 2.293s4.473-2.058 4.706-2.291c0.479-0.476 2.004-1.709 3.294-1.709s2.815 1.233 3.294 1.709c0.391 0.387 1.023 0.388 1.414-0.004 0.389-0.391 0.389-1.022-0.001-1.412z"></path>\n</svg>\n';
	var _iconMap_arrowDown = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M15.853 11.853l-0.707-0.707c-0.195-0.195-0.512-0.195-0.707 0l-2.44 2.439v-8.085c0-0.277-0.223-0.5-0.5-0.5h-1c-0.276 0-0.5 0.223-0.5 0.5v8.085l-2.439-2.439c-0.195-0.195-0.512-0.195-0.707 0l-0.707 0.707c-0.195 0.195-0.195 0.512 0 0.707l4.146 4.147c0.391 0.39 1.024 0.39 1.415 0l4.146-4.147c0.195-0.195 0.195-0.512 0-0.707z"></path>\n</svg>\n';
	var _iconMap_arrowLeft = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M16.5 10h-8.086l2.439-2.439c0.196-0.196 0.196-0.512 0-0.707l-0.706-0.707c-0.196-0.196-0.512-0.196-0.708 0l-4.146 4.146c-0.391 0.39-0.391 1.024 0 1.414l4.146 4.147c0.196 0.195 0.512 0.195 0.708 0l0.706-0.707c0.196-0.196 0.196-0.512 0-0.708l-2.439-2.439h8.086c0.276 0 0.5-0.224 0.5-0.5v-1c0-0.276-0.224-0.5-0.5-0.5z"></path>\n</svg>\n';
	var _iconMap_arrowRight = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M16.707 10.293l-4.146-4.146c-0.196-0.196-0.512-0.196-0.708 0l-0.707 0.706c-0.195 0.196-0.195 0.512 0 0.708l2.44 2.439h-8.086c-0.276 0-0.5 0.224-0.5 0.5v1c0 0.276 0.224 0.5 0.5 0.5h8.086l-2.44 2.439c-0.195 0.196-0.195 0.512 0 0.708l0.707 0.706c0.196 0.196 0.512 0.196 0.708 0l4.146-4.146c0.39-0.39 0.39-1.024 0-1.414z"></path>\n</svg>\n';
	var _iconMap_arrowUp = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M15.853 9.439l-4.146-4.146c-0.391-0.391-1.024-0.391-1.415 0l-4.146 4.146c-0.195 0.195-0.195 0.512 0 0.707l0.707 0.707c0.195 0.195 0.512 0.195 0.707 0l2.439-2.439v8.086c0 0.276 0.224 0.5 0.5 0.5h1c0.277 0 0.5-0.224 0.5-0.5v-8.086l2.44 2.439c0.195 0.195 0.512 0.195 0.707 0l0.707-0.707c0.195-0.195 0.195-0.512 0-0.707z"></path>\n</svg>\n';
	var _iconMap_autotrack = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M5 11.056c0-3.34 2.717-6.057 6.057-6.057 2.932 0 5.439 2.091 5.959 4.972l1.968-0.355c-0.692-3.834-4.026-6.617-7.927-6.617-4.443 0-8.057 3.615-8.057 8.057 0 3.901 2.782 7.235 6.616 7.927l0.356-1.968c-2.881-0.52-4.972-3.026-4.972-5.959z"></path>\n<path fill="#000" d="M11.024 9c0.98 0 1.817 0.699 1.991 1.661l1.969-0.355c-0.346-1.916-2.012-3.306-3.96-3.306-2.219 0-4.024 1.805-4.024 4.024 0 1.949 1.39 3.614 3.305 3.96l0.356-1.968c-0.963-0.174-1.661-1.011-1.661-1.992 0-1.116 0.908-2.024 2.024-2.024z"></path>\n<path fill="#000" d="M18.853 16.732l-2.298-2.298c-0.098-0.098-0.098-0.256 0-0.354l1.223-1.223c0.148-0.148 0.059-0.402-0.149-0.425l-5.226-0.581c-0.318-0.035-0.587 0.234-0.552 0.552l0.581 5.226c0.023 0.209 0.277 0.298 0.425 0.149l1.223-1.223c0.098-0.097 0.256-0.097 0.354 0l2.298 2.298c0.195 0.196 0.512 0.196 0.707 0l1.414-1.414c0.195-0.195 0.195-0.512 0-0.707z"></path>\n</svg>\n';
	var _iconMap_barGraph = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M18.5 4h-3c-0.276 0-0.5 0.224-0.5 0.5v13c0 0.276 0.224 0.5 0.5 0.5h3c0.276 0 0.5-0.224 0.5-0.5v-13c0-0.276-0.224-0.5-0.5-0.5z"></path>\n<path fill="#000" d="M12.5 8h-3c-0.276 0-0.5 0.224-0.5 0.5v9c0 0.276 0.224 0.5 0.5 0.5h3c0.276 0 0.5-0.224 0.5-0.5v-9c0-0.276-0.224-0.5-0.5-0.5z"></path>\n<path fill="#000" d="M6.5 12h-3c-0.276 0-0.5 0.224-0.5 0.5v5c0 0.276 0.224 0.5 0.5 0.5h3c0.276 0 0.5-0.224 0.5-0.5v-5c0-0.276-0.224-0.5-0.5-0.5z"></path>\n</svg>\n';
	var _iconMap_barStacked = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M4 7h4c0.552 0 1-0.448 1-1v-1c0-0.552-0.448-1-1-1h-4c-0.552 0-1 0.448-1 1v1c0 0.552 0.448 1 1 1z"></path>\n<path fill="#000" d="M11 7h3c0.552 0 1-0.448 1-1v-1c0-0.552-0.448-1-1-1h-3c-0.552 0-1 0.448-1 1v1c0 0.552 0.448 1 1 1z"></path>\n<path fill="#000" d="M18 4h-1c-0.552 0-1 0.448-1 1v1c0 0.552 0.448 1 1 1h1c0.552 0 1-0.448 1-1v-1c0-0.552-0.448-1-1-1z"></path>\n<path fill="#000" d="M11 9h-7c-0.552 0-1 0.448-1 1v1c0 0.552 0.448 1 1 1h7c0.552 0 1-0.448 1-1v-1c0-0.552-0.448-1-1-1z"></path>\n<path fill="#000" d="M15 9h-1c-0.552 0-1 0.448-1 1v1c0 0.552 0.448 1 1 1h1c0.552 0 1-0.448 1-1v-1c0-0.552-0.448-1-1-1z"></path>\n<path fill="#000" d="M7 14h-3c-0.552 0-1 0.448-1 1v1c0 0.552 0.448 1 1 1h3c0.552 0 1-0.448 1-1v-1c0-0.552-0.448-1-1-1z"></path>\n<path fill="#000" d="M10 14c-0.552 0-1 0.448-1 1v1c0 0.552 0.448 1 1 1s1-0.448 1-1v-1c0-0.552-0.448-1-1-1z"></path>\n</svg>\n';
	var _iconMap_bar = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M18 4h-14c-0.552 0-1 0.448-1 1v1c0 0.552 0.448 1 1 1h14c0.552 0 1-0.448 1-1v-1c0-0.552-0.448-1-1-1z"></path>\n<path fill="#000" d="M14 9h-10c-0.552 0-1 0.448-1 1v1c0 0.552 0.448 1 1 1h10c0.552 0 1-0.448 1-1v-1c0-0.552-0.448-1-1-1z"></path>\n<path fill="#000" d="M9 14h-5c-0.552 0-1 0.448-1 1v1c0 0.552 0.448 1 1 1h5c0.552 0 1-0.448 1-1v-1c0-0.552-0.448-1-1-1z"></path>\n</svg>\n';
	var _iconMap_bookmarks = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M14.36 17.766l-3.36-3.633-3.36 3.633c-0.651 0.543-1.64 0.080-1.64-0.768v-11.998c0-0.553 0.448-1 1-1h8c0.552 0 1 0.447 1 1v11.998c0 0.848-0.989 1.311-1.64 0.768z"></path>\n</svg>\n';
	var _iconMap_calendar = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path d="M9.5 10v0c0.276 0 0.5 0.224 0.5 0.5v2c0 0.276-0.224 0.5-0.5 0.5h-2c-0.276 0-0.5-0.224-0.5-0.5v-2c0-0.276 0.224-0.5 0.5-0.5h2zM5 17v-9h12v9h-12zM16.5 6h-3c-0.276 0-0.5-0.224-0.5-0.5v-1c0-0.276-0.224-0.5-0.5-0.5h-3c-0.276 0-0.5 0.224-0.5 0.5v1c0 0.276-0.224 0.5-0.5 0.5h-3c-0.276 0-0.5-0.224-0.5-0.5v-1c0-0.276-0.224-0.5-0.5-0.5h-0.5c-0.552 0-1 0.448-1 1v13c0 0.552 0.448 1 1 1h14c0.552 0 1-0.448 1-1v-13c0-0.552-0.448-1-1-1h-0.5c-0.276 0-0.5 0.224-0.5 0.5v1c0 0.276-0.224 0.5-0.5 0.5v0zM16 4.5v-1c0-0.276-0.224-0.5-0.5-0.5h-1c-0.276 0-0.5 0.224-0.5 0.5v1c0 0.276 0.224 0.5 0.5 0.5h1c0.276 0 0.5-0.224 0.5-0.5v0zM8 4.5v-1c0-0.276-0.224-0.5-0.5-0.5h-1c-0.276 0-0.5 0.224-0.5 0.5v1c0 0.276 0.224 0.5 0.5 0.5h1c0.276 0 0.5-0.224 0.5-0.5v0z"></path>\n</svg>';
	var _iconMap_caretDown = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M10.293 13.707l-4-4c-0.391-0.391-0.391-1.023 0-1.414s1.023-0.391 1.414 0l3.293 3.293 3.293-3.293c0.391-0.391 1.023-0.391 1.414 0 0.195 0.195 0.293 0.451 0.293 0.707s-0.098 0.512-0.293 0.707l-4 4c-0.391 0.391-1.023 0.391-1.414 0z"></path>\n</svg>\n';
	var _iconMap_caretLeft = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M8.293 10.293l4-4c0.391-0.391 1.023-0.391 1.414 0s0.391 1.023 0 1.414l-3.293 3.293 3.293 3.293c0.391 0.391 0.391 1.023 0 1.414-0.195 0.195-0.451 0.293-0.707 0.293s-0.512-0.098-0.707-0.293l-4-4c-0.391-0.391-0.391-1.023 0-1.414z"></path>\n</svg>\n';
	var _iconMap_caretRight = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M13.707 10.293l-4-4c-0.391-0.391-1.023-0.391-1.414 0s-0.391 1.023 0 1.414l3.293 3.293-3.293 3.293c-0.391 0.391-0.391 1.023 0 1.414 0.195 0.195 0.451 0.293 0.707 0.293s0.512-0.098 0.707-0.293l4-4c0.391-0.391 0.391-1.023 0-1.414z"></path>\n</svg>\n';
	var _iconMap_caretUp = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M11.707 8.293l4 4c0.391 0.391 0.391 1.023 0 1.414s-1.023 0.391-1.414 0l-3.293-3.293-3.293 3.293c-0.391 0.391-1.023 0.391-1.414 0-0.195-0.195-0.293-0.451-0.293-0.707s0.098-0.512 0.293-0.707l4-4c0.391-0.391 1.023-0.391 1.414 0z"></path>\n</svg>\n';
	var _iconMap_customEvents = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M6 7c-0.551 0-1-0.449-1-1s0.449-1 1-1c0.551 0 1 0.449 1 1s-0.449 1-1 1v0zM6 3c-1.657 0-3 1.343-3 3s1.343 3 3 3c1.657 0 3-1.343 3-3s-1.343-3-3-3v0z"></path>\n<path fill="#000" d="M6 17c-0.551 0-1-0.449-1-1s0.449-1 1-1c0.551 0 1 0.449 1 1s-0.449 1-1 1zM6 13c-1.657 0-3 1.343-3 3s1.343 3 3 3c1.657 0 3-1.343 3-3s-1.343-3-3-3z"></path>\n<path fill="#000" d="M16 12c-0.551 0-1-0.449-1-1s0.449-1 1-1c0.551 0 1 0.449 1 1s-0.449 1-1 1zM16 8c-1.657 0-3 1.343-3 3s1.343 3 3 3c1.657 0 3-1.343 3-3s-1.343-3-3-3z"></path>\n<path fill="#000" d="M5 12h2v-2h-2z"></path>\n<path fill="#000" d="M10 9h2v-2h-2z"></path>\n<path fill="#000" d="M10 16h2v-2h-2z"></path>\n</svg>\n';
	var _iconMap_dash = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M5 12h12v-2h-12z"></path>\n</svg>\n';
	var _iconMap_dashboardAddTo = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M15.023 13v2h-2.004v-8h2.004v6zM10.013 15v-6h2.004v6h-2.004zM7.008 15v-8h2.004v8h-2.004zM17.027 15h2.004v-10c0-1.103-0.899-2-2.004-2h-12.024c-1.105 0-2.004 0.897-2.004 2v12c0 1.103 0.899 2 2.004 2h10.020v-2h2.004v-2z"></path>\n<path fill="#000" d="M21.499 18.037h-1.54v-1.537c0-0.276-0.225-0.5-0.501-0.5h-0.928c-0.276 0-0.501 0.224-0.501 0.5v1.537h-1.54c-0.277 0-0.501 0.224-0.501 0.5v0.925c0 0.277 0.224 0.5 0.501 0.5h1.54v1.538c0 0.276 0.225 0.5 0.501 0.5h0.928c0.276 0 0.501-0.224 0.501-0.5v-1.538h1.54c0.277 0 0.501-0.223 0.501-0.5v-0.925c0-0.276-0.224-0.5-0.501-0.5z"></path>\n</svg>\n';
	var _iconMap_dashboardConfirm = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M13 15v-8h2v8h-2zM10 15v-6h2v6h-2zM7 15v-8h2v8h-2zM17.178 17.66l0.407 0.408 0.069-0.069 0.346-0.345 1-1v-11.655c0-1.103-0.897-2-2-2h-12c-1.103 0-2 0.897-2 2v12c0 1.103 0.897 2 2 2h9.019c0.067-0.255 0.195-0.491 0.386-0.682l0.653-0.655c0.587-0.581 1.537-0.583 2.12-0.002v0z"></path>\n<path fill="#000" d="M21.854 17.231l-0.654-0.654c-0.196-0.196-0.512-0.196-0.707 0l-2.907 2.907-1.113-1.113c-0.195-0.195-0.512-0.195-0.707 0l-0.655 0.654c-0.195 0.195-0.195 0.512 0 0.707l1.464 1.464c0.001 0.001 0.001 0.002 0.002 0.003l0.654 0.655c0.098 0.097 0.226 0.146 0.355 0.146s0.256-0.049 0.354-0.146l0.654-0.655c0.001-0.001 0.002-0.002 0.003-0.004l3.257-3.257c0.195-0.195 0.195-0.512 0-0.707z"></path>\n</svg>\n';
	var _iconMap_dashboard = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M15 10c-0.552 0-1-0.448-1-1s0.448-1 1-1c0.552 0 1 0.448 1 1s-0.448 1-1 1zM11 16c-1.657 0-3-1.343-3-3 0-1.304 0.837-2.403 2-2.816v-1.184c0-0.552 0.448-1 1-1s1 0.448 1 1v1.184c1.163 0.413 2 1.512 2 2.816 0 1.657-1.343 3-3 3zM7 10c-0.552 0-1-0.448-1-1s0.448-1 1-1c0.552 0 1 0.448 1 1s-0.448 1-1 1zM11 5c0.552 0 1 0.448 1 1s-0.448 1-1 1c-0.552 0-1-0.448-1-1s0.448-1 1-1zM11 3c-4.418 0-8 3.582-8 8s3.582 8 8 8c4.418 0 8-3.582 8-8s-3.582-8-8-8z"></path>\n<path fill="#000" d="M11 12c-0.552 0-1 0.448-1 1s0.448 1 1 1c0.552 0 1-0.448 1-1s-0.448-1-1-1z"></path>\n</svg>\n';
	var _iconMap_edit2 = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M4 4v14h14v-8l-2 1v5.001h-10v-10h5l1-2.001z"></path>\n<path fill="#000" d="M17.293 6.828l-2.121-2.121-5.657 5.657 2.121 2.121z"></path>\n<path fill="#000" d="M18.707 4l-0.707-0.707c-0.391-0.391-1.024-0.391-1.414 0l-0.707 0.707 2.121 2.121 0.707-0.707c0.391-0.39 0.391-1.023 0-1.414z"></path>\n<path fill="#000" d="M7.747 14.253l3.182-1.061-2.121-2.121z"></path>\n</svg>\n';
	var _iconMap_edit = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M5.554 13.894l2.121 2.121 8.384-8.384-2.121-2.121z"></path>\n<path fill="#000" d="M18.276 4l-0.707-0.707c-0.391-0.391-1.024-0.391-1.414 0l-1.511 1.51 2.122 2.122 1.51-1.511c0.391-0.39 0.391-1.023 0-1.414z"></path>\n<path fill="#000" d="M3.013 18.24c-0.065 0.195 0.121 0.381 0.316 0.316l3.639-1.833-2.122-2.122-1.833 3.639z"></path>\n</svg>\n';
	var _iconMap_email = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M4 5l7 6.999 7-6.999z"></path>\n<path fill="#000" d="M3 16l5-5-5-5z"></path>\n<path fill="#000" d="M14 11l5 5v-9.999z"></path>\n<path fill="#000" d="M11 14l-2-2.001-5 5.001h14l-5-5.001z"></path>\n</svg>\n';
	var _iconMap_event = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M15.75 14.5c0-0.414 0.336-0.75 0.75-0.75 0.232 0 0.431 0.111 0.568 0.276 0.109 0.13 0.182 0.291 0.182 0.474 0 0.414-0.336 0.75-0.75 0.75-0.232 0-0.431-0.111-0.568-0.276-0.109-0.13-0.182-0.291-0.182-0.474zM12.25 8.5c0 0.183-0.073 0.344-0.182 0.474-0.137 0.165-0.336 0.276-0.568 0.276s-0.431-0.111-0.568-0.276c-0.109-0.13-0.182-0.291-0.182-0.474s0.073-0.344 0.182-0.474c0.137-0.165 0.336-0.276 0.568-0.276s0.431 0.111 0.568 0.276c0.109 0.13 0.182 0.291 0.182 0.474zM5.75 14.5c0-0.183 0.073-0.344 0.182-0.474 0.137-0.165 0.336-0.276 0.568-0.276 0.414 0 0.75 0.336 0.75 0.75 0 0.183-0.073 0.344-0.182 0.474-0.137 0.165-0.336 0.276-0.568 0.276-0.414 0-0.75-0.336-0.75-0.75zM16.5 12c-0.241 0-0.47 0.045-0.69 0.109l-2.082-2.498c0.168-0.336 0.272-0.71 0.272-1.111 0-1.379-1.122-2.5-2.5-2.5s-2.5 1.121-2.5 2.5c0 0.401 0.104 0.775 0.272 1.111l-2.081 2.498c-0.221-0.064-0.45-0.109-0.691-0.109-1.378 0-2.5 1.121-2.5 2.5s1.122 2.5 2.5 2.5 2.5-1.122 2.5-2.5c0-0.401-0.104-0.775-0.272-1.111l2.081-2.498c0.221 0.064 0.45 0.109 0.691 0.109s0.47-0.045 0.691-0.109l2.081 2.498c-0.168 0.336-0.272 0.71-0.272 1.111 0 1.378 1.122 2.5 2.5 2.5s2.5-1.122 2.5-2.5c0-1.379-1.122-2.5-2.5-2.5z"></path>\n</svg>\n';
	var _iconMap_exportOutline = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M6 17v-12h6v3c0 0.552 0.447 1 1 1h3v8h-10zM17.988 7.939c-0.006-0.090-0.023-0.175-0.052-0.26-0.011-0.032-0.019-0.062-0.033-0.093-0.049-0.106-0.11-0.207-0.196-0.293l-4-4c-0.086-0.086-0.186-0.147-0.292-0.196-0.032-0.014-0.063-0.022-0.096-0.034-0.082-0.027-0.166-0.044-0.253-0.050-0.023-0.001-0.043-0.013-0.066-0.013h-8c-0.553 0-1 0.448-1 1v14c0 0.552 0.447 1 1 1h12c0.553 0 1-0.448 1-1v-10c0-0.021-0.011-0.040-0.012-0.061v0z"></path>\n<path fill="#000" d="M12.75 12h-1.75v-2.5c0-0.276-0.223-0.5-0.5-0.5h-1c-0.276 0-0.5 0.224-0.5 0.5v2.5h-1.749c-0.206 0-0.324 0.235-0.2 0.4l2.749 3.5c0.1 0.133 0.3 0.133 0.4 0l2.75-3.5c0.124-0.165 0.006-0.4-0.2-0.4z"></path>\n</svg>\n';
	var _iconMap__export = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M14.5 7v0h3.24c0.28 0 0.34-0.16 0.15-0.35l-3.54-3.54c-0.19-0.19-0.35-0.13-0.35 0.15v3.24c0 0.276 0.224 0.5 0.5 0.5z"></path>\n<path fill="#000" d="M13.91 12.5l-2.59 3.33c-0.115 0.175-0.35 0.224-0.525 0.109-0.047-0.031-0.086-0.071-0.115-0.119l-2.59-3.32c-0.18-0.24-0.080-0.5 0.21-0.5h1.7v-2.5c0-0.276 0.224-0.5 0.5-0.5h1c0.276 0 0.5 0.224 0.5 0.5v2.5h1.7c0.29 0 0.39 0.26 0.21 0.5zM17.5 8h-4c-0.276 0-0.5-0.224-0.5-0.5v-4c0-0.276-0.224-0.5-0.5-0.5h-7.5c-0.552 0-1 0.448-1 1v14c0 0.552 0.448 1 1 1h12c0.552 0 1-0.448 1-1v-9.5c0-0.276-0.224-0.5-0.5-0.5z"></path>\n</svg>\n';
	var _iconMap_eyeOn = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M11 15c-2.209 0-4-1.791-4-4s1.791-4 4-4c2.209 0 4 1.791 4 4s-1.791 4-4 4zM11 5c-6 0-9 6-9 6s3 6 9 6c6.016 0 9-6 9-6s-3-6-9-6z"></path>\n<path fill="#000" d="M11 9c-1.105 0-2 0.895-2 2s0.895 2 2 2c1.105 0 2-0.895 2-2s-0.895-2-2-2z"></path>\n</svg>\n';
	var _iconMap_flag = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M17 8h-2v2h2v2h-2v-2h-2v2h-2v-2h-2v2h-2v-2h-2v-2h2v-2h2v2h2v-2h2v2h2v-2h2v2zM18 4h-13c0-0.552-0.447-1-1-1s-1 0.448-1 1v14c0 0.552 0.447 1 1 1s1-0.448 1-1v-4h13c0.553 0 1-0.448 1-1v-8c0-0.552-0.447-1-1-1v0z"></path>\n<path fill="#000" d="M7 10h2v-2h-2z"></path>\n<path fill="#000" d="M11 10h2.001v-2h-2.001z"></path>\n</svg>\n';
	var _iconMap_infoOutline = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M11 17c-3.309 0-6-2.691-6-6s2.691-6 6-6c3.309 0 6 2.691 6 6s-2.691 6-6 6zM11 3c-4.411 0-8 3.589-8 8s3.589 8 8 8c4.411 0 8-3.589 8-8s-3.589-8-8-8z"></path>\n<path fill="#000" d="M11 10c-0.552 0-1 0.448-1 1v3c0 0.553 0.448 1 1 1s1-0.447 1-1v-3c0-0.552-0.448-1-1-1z"></path>\n<path fill="#000" d="M11.71 7.29c-0.050-0.040-0.1-0.090-0.15-0.12-0.060-0.040-0.12-0.070-0.18-0.090-0.060-0.030-0.12-0.050-0.18-0.060-0.33-0.070-0.67 0.040-0.91 0.27-0.18 0.19-0.29 0.45-0.29 0.71s0.11 0.52 0.29 0.71c0.19 0.18 0.45 0.29 0.71 0.29 0.060 0 0.13-0.010 0.2-0.020 0.060-0.010 0.12-0.030 0.18-0.060 0.060-0.020 0.12-0.050 0.18-0.090 0.050-0.040 0.1-0.080 0.15-0.12 0.090-0.1 0.16-0.21 0.21-0.33 0.060-0.12 0.080-0.25 0.080-0.38s-0.020-0.26-0.080-0.38c-0.050-0.12-0.12-0.23-0.21-0.33z"></path>\n</svg>\n';
	var _iconMap_input = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M11 13h-6v-4h6v-2h-7c-0.553 0-1 0.448-1 1v6c0 0.552 0.447 1 1 1h7v-2z"></path>\n<path fill="#000" d="M18 7h-4v2h3v4h-3v2h4c0.553 0 1-0.448 1-1v-6c0-0.552-0.447-1-1-1z"></path>\n<path fill="#000" d="M12 17h1v-12h-1z"></path>\n<path fill="#000" d="M9 5h3v-1h-3z"></path>\n<path fill="#000" d="M13 5h3v-1h-3z"></path>\n<path fill="#000" d="M9 18h3v-1h-3z"></path>\n<path fill="#000" d="M13 18h3v-1h-3z"></path>\n</svg>\n';
	var _iconMap_lightingBolt = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M11 19c4.419 0 8-3.582 8-8s-3.582-8-8-8c-4.419 0-8 3.582-8 8s3.582 8 8 8zM10.427 11.454c0.021-0.063 0.013-0.128-0.024-0.177s-0.098-0.077-0.169-0.077h-1.854c-0.030 0-0.044-0.008-0.046-0.011s-0.001-0.019 0.017-0.043l4.73-5.382c0.14-0.159 0.199-0.133 0.124 0.079l-1.525 4.324c-0.025 0.062-0.020 0.127 0.015 0.177s0.096 0.078 0.167 0.078h1.752c0.030 0 0.046 0.008 0.051 0.016s0.004 0.025-0.011 0.050l-4.454 5.741c-0.132 0.171-0.19 0.139-0.129-0.074l1.357-4.7z"></path>\n</svg>\n';
	var _iconMap_lightningBolt = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n    <!-- Generator: sketchtool 39.1 (31720) - http://www.bohemiancoding.com/sketch -->\n    <title>4CA9E2B0-52BF-4F9C-83FE-2CE1152A5884</title>\n    <desc>Created with sketchtool.</desc>\n    <defs></defs>\n    <g id="Pricing-Upgrade-" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n        <g id="Date-History-Calendar" transform="translate(-335.000000, -684.000000)">\n            <g id="icon_upgrade_calenadr" transform="translate(335.000000, 684.000000)">\n                <g id="Group-4-Copy" fill="#7858B8">\n                    <g id="icon_upgrade_nav-copy">\n                        <ellipse id="Oval-3" cx="8" cy="8" rx="8" ry="8"></ellipse>\n                    </g>\n                </g>\n                <g id="Page-1" transform="translate(5.333333, 2.666667)" fill="#FFFFFF">\n                    <path d="M2.09392825,5.67432548 C2.11523012,5.62738084 2.10670937,5.57818736 2.06978614,5.54136252 C2.0331211,5.50453768 1.97128114,5.48345476 1.90040401,5.48345476 L0.0464960296,5.48345476 C0.0168025173,5.48345476 0.00260127232,5.47764524 0.000664738909,5.47502159 C-0.0012717945,5.47230423 0.00014833,5.46040409 0.0169316196,5.44260074 L4.76028909,1.39434212 C4.89304498,1.28104048 4.94560996,1.30629262 4.87082311,1.46536346 L3.34596165,4.70872762 C3.32091582,4.75520375 3.32595081,4.80430354 3.36080841,4.84131578 C3.39553691,4.87823432 3.45660226,4.89950465 3.52799579,4.89950465 L5.28030033,4.89950465 C5.31076845,4.89950465 5.32664803,4.90587637 5.3309084,4.91131108 C5.33529787,4.91674579 5.33491057,4.92995776 5.31967651,4.94907294 L0.85266572,9.26701926 C0.727644144,9.38786886 0.675124946,9.35902101 0.74145692,9.18675391 L2.09392825,5.67432548 Z" id="Fill-1"></path>\n                </g>\n            </g>\n        </g>\n    </g>\n</svg>';
	var _iconMap_lineStacked = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M20.707 9.293c-0.391-0.391-1.023-0.391-1.414 0l-4.564 4.562-5.413-1.803c-0.321-0.109-0.676-0.045-0.941 0.167l-5 4c-0.431 0.345-0.501 0.974-0.156 1.406 0.197 0.247 0.488 0.375 0.781 0.375 0.22 0 0.44-0.071 0.624-0.219l4.576-3.66 5.484 1.827c0.359 0.122 0.755 0.027 1.023-0.241l5-5c0.391-0.391 0.391-1.023 0-1.414z"></path>\n<path fill="#000" d="M8.2 9.12l5.484 1.828c0.359 0.121 0.757 0.026 1.023-0.242l5-5c0.391-0.39 0.391-1.023 0-1.414-0.39-0.39-1.023-0.39-1.414 0l-4.563 4.563-5.413-1.804c-0.323-0.105-0.676-0.044-0.941 0.168l-5 4c-0.432 0.344-0.502 0.974-0.156 1.405 0.197 0.247 0.487 0.375 0.781 0.375 0.219 0 0.44-0.071 0.624-0.218l4.575-3.661z"></path>\n</svg>\n';
	var _iconMap_line = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M2 12c-1.105 0-2 0.895-2 2s0.895 2 2 2c1.105 0 2-0.895 2-2s-0.895-2-2-2v0z"></path>\n<path fill="#000" d="M8 6c-1.105 0-2 0.895-2 2s0.895 2 2 2c1.105 0 2-0.895 2-2s-0.895-2-2-2z"></path>\n<path fill="#000" d="M14 12c-1.105 0-2 0.895-2 2s0.895 2 2 2c1.105 0 2-0.895 2-2s-0.895-2-2-2z"></path>\n<path fill="#000" d="M20 6c-1.105 0-2 0.895-2 2s0.895 2 2 2c1.105 0 2-0.895 2-2s-0.895-2-2-2z"></path>\n<path fill="#000" d="M4 12h2v-2h-2z"></path>\n<path fill="#000" d="M10 12h2v-2h-2z"></path>\n<path fill="#000" d="M16 12h2v-2h-2z"></path>\n</svg>\n';
	var _iconMap_lockLocked = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M8 10v-2c0-1.654 1.346-3 3-3s3 1.346 3 3v2h-6zM17 10h-1v-2c0-2.757-2.243-5-5-5s-5 2.243-5 5v2h-1c-0.552 0-1 0.448-1 1v7c0 0.552 0.448 1 1 1h12c0.552 0 1-0.448 1-1v-7c0-0.552-0.448-1-1-1v0z"></path>\n</svg>\n';
	var _iconMap_plusLarge = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M17 9h-4v-4c0-0.552-0.448-1-1-1h-2c-0.552 0-1 0.448-1 1v4h-4c-0.552 0-1 0.448-1 1v2c0 0.552 0.448 1 1 1h4v4c0 0.552 0.448 1 1 1h2c0.552 0 1-0.448 1-1v-4h4c0.552 0 1-0.448 1-1v-2c0-0.552-0.448-1-1-1z"></path>\n</svg>\n';
	var _iconMap_plus = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M14 10h-2v-2c0-0.552-0.448-1-1-1s-1 0.448-1 1v2h-2c-0.552 0-1 0.448-1 1s0.448 1 1 1h2v2c0 0.552 0.448 1 1 1s1-0.448 1-1v-2h2c0.552 0 1-0.448 1-1s-0.448-1-1-1z"></path>\n</svg>\n';
	var _iconMap_profileLarge = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M12.981 12.040c0-0.87 0.72-0.58 1.040-2.17 0.13-0.66 0.76-0.010 0.89-1.51 0.042-0.297-0.095-0.592-0.35-0.75 0 0 0.18-0.88 0.24-1.57 0.090-0.84-0.52-3.040-3.8-3.040s-3.89 2.2-3.8 3.040c0.060 0.69 0.24 1.57 0.24 1.57-0.255 0.158-0.393 0.453-0.35 0.75 0.13 1.5 0.76 0.85 0.89 1.51 0.32 1.59 1.040 1.3 1.040 2.17 0 1.44-0.75 2.12-3.111 2.91-2.37 0.81-2.909 1.62-2.909 2.18v0.94c0.022 0.532 0.468 0.946 1 0.93h14c0.532 0.016 0.977-0.398 1-0.93v-0.94c0-0.56-0.541-1.37-2.91-2.18-2.36-0.79-3.11-1.47-3.11-2.91z"></path>\n</svg>\n';
	var _iconMap_profile = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M12.73 11.91c0-0.76 0.63-0.51 0.91-1.9 0.11-0.57 0.67-0.010 0.78-1.32 0.036-0.259-0.086-0.515-0.31-0.65 0 0 0.16-0.78 0.22-1.38 0.070-0.74-0.46-2.66-3.33-2.66s-3.4 1.92-3.33 2.66c0.060 0.6 0.22 1.38 0.22 1.38-0.224 0.135-0.346 0.391-0.31 0.65 0.11 1.31 0.67 0.75 0.78 1.32 0.28 1.39 0.91 1.14 0.91 1.9 0 1.26 0.34 1.85-1.73 2.55s-3.54 1.42-3.54 1.9v0.82c0.013 0.466 0.402 0.834 0.868 0.82h12.251c0.467 0.019 0.861-0.343 0.88-0.809v-0.831c0-0.48-1.47-1.2-3.54-1.9s-1.729-1.29-1.729-2.55z"></path>\n</svg>\n';
	var _iconMap_refresh = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M16.657 5.343c-1.448-1.448-3.448-2.343-5.657-2.343-4.418 0-8 3.582-8 8s3.582 8 8 8c4.079 0 7.438-3.055 7.931-7h-3.032c-0.465 2.279-2.484 4-4.899 4-2.757 0-5-2.243-5-5s2.243-5 5-5c1.379 0 2.629 0.561 3.534 1.466l-2.534 2.534h7v-7l-2.343 2.343z"></path>\n</svg>\n';
	var _iconMap_savedReports = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M14.928 11.279l-1.794 1.843 0.421 2.585c0.034 0.207-0.186 0.362-0.369 0.261l-2.186-1.212-2.187 1.212c-0.183 0.101-0.403-0.054-0.369-0.261l0.421-2.585-1.794-1.843c-0.142-0.147-0.060-0.394 0.142-0.425l2.467-0.377 1.092-2.333c0.091-0.193 0.365-0.193 0.455 0l1.092 2.333 2.467 0.377c0.202 0.031 0.285 0.278 0.142 0.425zM18 5h-5.586c-0.265 0-0.52-0.106-0.707-0.293l-1.414-1.414c-0.188-0.188-0.442-0.293-0.708-0.293h-5.585c-0.553 0-1 0.447-1 1v14c0 0.552 0.447 1 1 1h14c0.552 0 1-0.448 1-1v-12c0-0.553-0.448-1-1-1z"></path>\n</svg>\n';
	var _iconMap_search = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M10 15c-2.757 0-5-2.243-5-5s2.243-5 5-5c2.757 0 5 2.243 5 5s-2.243 5-5 5zM18.707 17.293l-3-3c-0.037-0.037-0.084-0.053-0.124-0.083 0.886-1.172 1.417-2.627 1.417-4.21 0-3.866-3.134-7-7-7s-7 3.134-7 7c0 3.866 3.134 7 7 7 1.583 0 3.038-0.531 4.21-1.417 0.030 0.040 0.046 0.087 0.083 0.124l3 3c0.195 0.195 0.451 0.293 0.707 0.293s0.512-0.098 0.707-0.293c0.391-0.391 0.391-1.023 0-1.414z"></path>\n</svg>\n';
	var _iconMap_sortAlphaAsc = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M11 12h2v-2h-2z"></path>\n<path fill="#000" d="M3.52 6l-3.52 9h2.73l0.46-1h3.69l0.46 1h2.73l-3.51-9h-3.040zM5.040 8l1.18 4h-2.37l1.19-4z"></path>\n<path fill="#000" d="M14.99 6v2h3.98l-3.98 5.099v1.901h7.009v-2h-3.839l3.829-5.099v-1.901z"></path>\n</svg>\n';
	var _iconMap_sortAlphaDesc = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M9.010 12h2v-2h-2z"></path>\n<path fill="#000" d="M0 6v2h3.98l-3.98 5.099v1.901h7.010v-2h-3.84l3.83-5.099v-1.901z"></path>\n<path fill="#000" d="M15.531 6l-3.521 9h2.731l0.46-1h3.69l0.46 1h2.729l-3.51-9h-3.039zM17.049 8l1.181 4h-2.371l1.19-4z"></path>\n</svg>\n';
	var _iconMap_sortValueAsc = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M3 8h5v-2h-5v2zM3 12h10v-2.001h-10v2.001zM3 16h15v-2h-15v2z"></path>\n</svg>\n';
	var _iconMap_sortValueDesc = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M3 8h15v-2h-15v2zM3 12h10v-2.001h-10v2.001zM3 16h5v-2h-5v2z"></path>\n</svg>\n';
	var _iconMap_table = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M6 4h-2c-0.552 0-1 0.448-1 1v1c0 0.552 0.448 1 1 1h2c0.552 0 1-0.448 1-1v-1c0-0.552-0.448-1-1-1z"></path>\n<path fill="#000" d="M12 4h-2c-0.552 0-1 0.448-1 1v1c0 0.552 0.448 1 1 1h2c0.552 0 1-0.448 1-1v-1c0-0.552-0.448-1-1-1z"></path>\n<path fill="#000" d="M18 4h-2c-0.552 0-1 0.448-1 1v1c0 0.552 0.448 1 1 1h2c0.552 0 1-0.448 1-1v-1c0-0.552-0.448-1-1-1z"></path>\n<path fill="#000" d="M6 9h-2c-0.552 0-1 0.448-1 1v1c0 0.552 0.448 1 1 1h2c0.552 0 1-0.448 1-1v-1c0-0.552-0.448-1-1-1z"></path>\n<path fill="#000" d="M12 9h-2c-0.552 0-1 0.448-1 1v1c0 0.552 0.448 1 1 1h2c0.552 0 1-0.448 1-1v-1c0-0.552-0.448-1-1-1z"></path>\n<path fill="#000" d="M18 9h-2c-0.552 0-1 0.448-1 1v1c0 0.552 0.448 1 1 1h2c0.552 0 1-0.448 1-1v-1c0-0.552-0.448-1-1-1z"></path>\n<path fill="#000" d="M6 14h-2c-0.552 0-1 0.448-1 1v1c0 0.552 0.448 1 1 1h2c0.552 0 1-0.448 1-1v-1c0-0.552-0.448-1-1-1z"></path>\n<path fill="#000" d="M12 14h-2c-0.552 0-1 0.448-1 1v1c0 0.552 0.448 1 1 1h2c0.552 0 1-0.448 1-1v-1c0-0.552-0.448-1-1-1z"></path>\n<path fill="#000" d="M18 14h-2c-0.552 0-1 0.448-1 1v1c0 0.552 0.448 1 1 1h2c0.552 0 1-0.448 1-1v-1c0-0.552-0.448-1-1-1z"></path>\n</svg>\n';
	var _iconMap_trashcan = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M16.5 9h-11c-0.276 0-0.5 0.224-0.5 0.5v8.5c0 0.552 0.448 1 1 1h10c0.552 0 1-0.448 1-1v-8.5c0-0.276-0.224-0.5-0.5-0.5z"></path>\n<path fill="#000" d="M10 6v-1h2v1h-2zM17.001 6h-3v-2c0-0.552-0.448-1-1-1h-4c-0.553 0-1 0.448-1 1v2h-3c-0.553 0-1 0.448-1 1s0.447 1 1 1h12c0.552 0 1-0.448 1-1s-0.448-1-1-1v0z"></path>\n</svg>\n';
	var _iconMap_triangleDown = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M7 8l4 6 4-6z"></path>\n</svg>\n';
	var _iconMap_triangleLeft = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M14 7l-6 4.001 6 3.999z"></path>\n</svg>\n';
	var _iconMap_triangleRight = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M8 7v8l6-3.999z"></path>\n</svg>\n';
	var _iconMap_triangleUp = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M11 8l-4 6h8.001z"></path>\n</svg>\n';
	var _iconMap_typeBoolean = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#9cacbb" d="M19 20h-16c-0.552 0-1-0.448-1-1v-16c0-0.552 0.448-1 1-1h16c0.552 0 1 0.448 1 1v16c0 0.552-0.448 1-1 1z"></path>\n<path fill="#fff" d="M10 11c0 1.105-0.895 2-2 2s-2-0.895-2-2c0-1.105 0.895-2 2-2s2 0.895 2 2z"></path>\n<path fill="#4c6072" d="M16 11c0 1.105-0.895 2-2 2s-2-0.895-2-2c0-1.105 0.895-2 2-2s2 0.895 2 2z"></path>\n</svg>\n';
	var _iconMap_typeDate = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#9cacbb" d="M7 6h8v-4h-8z"></path>\n<path fill="#9cacbb" d="M19 2h-3v4h4v-3c0-0.552-0.448-1-1-1z"></path>\n<path fill="#9cacbb" d="M6 2h-3c-0.552 0-1 0.448-1 1v3h4v-4z"></path>\n<path fill="#9cacbb" d="M2 19c0 0.552 0.448 1 1 1h16c0.552 0 1-0.448 1-1v-12h-18v12zM8.505 9.874h5.057v1.219c-0.94 0.94-2.498 3.068-2.509 5.907h-1.809c0.040-2.108 1.289-4.457 2.429-5.687h-3.168v-1.439z"></path>\n</svg>\n';
	var _iconMap_typeList = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#9cacbb" d="M19 2h-16c-0.552 0-1 0.448-1 1v16c0 0.552 0.448 1 1 1h16c0.552 0 1-0.448 1-1v-16c0-0.552-0.448-1-1-1zM17 8.5c0 0.276-0.224 0.5-0.5 0.5h-8c-0.276 0-0.5-0.224-0.5-0.5v-1c0-0.276 0.224-0.5 0.5-0.5h8c0.276 0 0.5 0.224 0.5 0.5v1zM17 11.5c0 0.276-0.224 0.5-0.5 0.5h-8c-0.276 0-0.5-0.224-0.5-0.5v-1c0-0.276 0.224-0.5 0.5-0.5h8c0.276 0 0.5 0.224 0.5 0.5v1zM17 14.5c0 0.276-0.224 0.5-0.5 0.5h-8c-0.276 0-0.5-0.224-0.5-0.5v-1c0-0.276 0.224-0.5 0.5-0.5h8c0.276 0 0.5 0.224 0.5 0.5v1zM7 8.5c0 0.276-0.224 0.5-0.5 0.5h-1c-0.276 0-0.5-0.224-0.5-0.5v-1c0-0.276 0.224-0.5 0.5-0.5h1c0.276 0 0.5 0.224 0.5 0.5v1zM7 11.5c0 0.276-0.224 0.5-0.5 0.5h-1c-0.276 0-0.5-0.224-0.5-0.5v-1c0-0.276 0.224-0.5 0.5-0.5h1c0.276 0 0.5 0.224 0.5 0.5v1zM7 14.5c0 0.276-0.224 0.5-0.5 0.5h-1c-0.276 0-0.5-0.224-0.5-0.5v-1c0-0.276 0.224-0.5 0.5-0.5h1c0.276 0 0.5 0.224 0.5 0.5v1z"></path>\n</svg>\n';
	var _iconMap_typeNumber = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#9cacbb" d="M13.565 15.069h-4.943v-1.37h1.586v-5.080l-1.517 0.103-0.126-1.336 2.671-0.514h0.879v6.827h1.45v1.37zM19 2.001h-16c-0.552 0-1 0.447-1 1v16c0 0.552 0.448 1 1 1h16c0.552 0 1-0.448 1-1v-16c0-0.553-0.448-1-1-1v0z"></path>\n</svg>\n';
	var _iconMap_typeText = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#9cacbb" d="M10.989 10.192l-0.89 1.958h1.804l-0.902-1.958z"></path>\n<path fill="#9cacbb" d="M14.775 15h-1.317c-0.214 0-0.309-0.071-0.415-0.297l-0.428-0.937h-3.229l-0.427 0.949c-0.060 0.142-0.19 0.285-0.428 0.285h-1.306c-0.178 0-0.273-0.154-0.201-0.309l3.715-7.989c0.036-0.071 0.119-0.131 0.202-0.131h0.119c0.083 0 0.166 0.060 0.201 0.131l3.716 7.989c0.071 0.155-0.023 0.309-0.202 0.309zM19 2h-16c-0.553 0-1 0.448-1 1v16c0 0.552 0.447 1 1 1h16c0.552 0 1-0.448 1-1v-16c0-0.552-0.448-1-1-1z"></path>\n</svg>\n';
	var _iconMap_valueAbsolute = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M13 4h2v3h2v1.999h-2v3h2v2.001h-2v3h-2v-3h-3.001v3h-1.999v-3h-2v-2.001h2v-3h-2v-1.999h2v-3h1.999v3h3.001v-3zM9.999 11.999h3.001v-3h-3.001v3z"></path>\n</svg>\n';
	var _iconMap_valueRelative = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M15.784 4.089c-0.225-0.157-0.539-0.102-0.695 0.126l-9 13.001c-0.158 0.227-0.101 0.538 0.126 0.695 0.087 0.061 0.186 0.089 0.284 0.089 0.159 0 0.315-0.075 0.412-0.216l9-12.999c0.157-0.227 0.101-0.539-0.127-0.696z"></path>\n<path fill="#000" d="M14.5 16c-0.827 0-1.5-0.673-1.5-1.5s0.673-1.5 1.5-1.5c0.827 0 1.5 0.673 1.5 1.5s-0.673 1.5-1.5 1.5zM14.5 11c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5c1.93 0 3.5-1.57 3.5-3.5s-1.57-3.5-3.5-3.5z"></path>\n<path fill="#000" d="M6 7.5c0-0.827 0.673-1.5 1.5-1.5s1.5 0.673 1.5 1.5c0 0.827-0.673 1.5-1.5 1.5s-1.5-0.673-1.5-1.5zM11 7.5c0-1.93-1.57-3.5-3.5-3.5s-3.5 1.57-3.5 3.5c0 1.93 1.57 3.5 3.5 3.5s3.5-1.57 3.5-3.5z"></path>\n</svg>\n';
	var _iconMap_x = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated by IcoMoon.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">\n<path fill="#000" d="M14.319 6l-3.319 3.319-3.32-3.319-1.68 1.68 3.319 3.319-3.319 3.319 1.68 1.68 3.32-3.319 3.319 3.319 1.68-1.68-3.319-3.319 3.319-3.319z"></path>\n</svg>\n';
	var iconMap = {
	  alert: _iconMap_alert,
	  analysisCumulative: _iconMap_analysisCumulative,
	  analysisLinear: _iconMap_analysisLinear,
	  analysisLogarithmic: _iconMap_analysisLogarithmic,
	  analysisRolling: _iconMap_analysisRolling,
	  arrowDown: _iconMap_arrowDown,
	  arrowLeft: _iconMap_arrowLeft,
	  arrowRight: _iconMap_arrowRight,
	  arrowUp: _iconMap_arrowUp,
	  autotrack: _iconMap_autotrack,
	  barGraph: _iconMap_barGraph,
	  barStacked: _iconMap_barStacked,
	  bar: _iconMap_bar,
	  bookmarks: _iconMap_bookmarks,
	  calendar: _iconMap_calendar,
	  caretDown: _iconMap_caretDown,
	  caretLeft: _iconMap_caretLeft,
	  caretRight: _iconMap_caretRight,
	  caretUp: _iconMap_caretUp,
	  customEvents: _iconMap_customEvents,
	  dash: _iconMap_dash,
	  dashboardAddTo: _iconMap_dashboardAddTo,
	  dashboardConfirm: _iconMap_dashboardConfirm,
	  dashboard: _iconMap_dashboard,
	  edit2: _iconMap_edit2,
	  edit: _iconMap_edit,
	  email: _iconMap_email,
	  event: _iconMap_event,
	  exportOutline: _iconMap_exportOutline,
	  _export: _iconMap__export,
	  eyeOn: _iconMap_eyeOn,
	  flag: _iconMap_flag,
	  infoOutline: _iconMap_infoOutline,
	  input: _iconMap_input,
	  lightingBolt: _iconMap_lightingBolt,
	  lightningBolt: _iconMap_lightningBolt,
	  lineStacked: _iconMap_lineStacked,
	  line: _iconMap_line,
	  lockLocked: _iconMap_lockLocked,
	  plusLarge: _iconMap_plusLarge,
	  plus: _iconMap_plus,
	  profileLarge: _iconMap_profileLarge,
	  profile: _iconMap_profile,
	  refresh: _iconMap_refresh,
	  savedReports: _iconMap_savedReports,
	  search: _iconMap_search,
	  sortAlphaAsc: _iconMap_sortAlphaAsc,
	  sortAlphaDesc: _iconMap_sortAlphaDesc,
	  sortValueAsc: _iconMap_sortValueAsc,
	  sortValueDesc: _iconMap_sortValueDesc,
	  table: _iconMap_table,
	  trashcan: _iconMap_trashcan,
	  triangleDown: _iconMap_triangleDown,
	  triangleLeft: _iconMap_triangleLeft,
	  triangleRight: _iconMap_triangleRight,
	  triangleUp: _iconMap_triangleUp,
	  typeBoolean: _iconMap_typeBoolean,
	  typeDate: _iconMap_typeDate,
	  typeList: _iconMap_typeList,
	  typeNumber: _iconMap_typeNumber,
	  typeText: _iconMap_typeText,
	  valueAbsolute: _iconMap_valueAbsolute,
	  valueRelative: _iconMap_valueRelative,
	  x: _iconMap_x
	};
	Object.freeze(iconMap);

	var _css = document.createElement('style');

	_css.innerHTML = 'svg-icon {   display: inline-block;   height: 22px;   min-height: 22px;   min-width: 22px;   position: relative;   width: 22px; } svg-icon svg {   left: 0;   position: absolute;   top: 0; } '
	document.head.appendChild(_css)

	// dasherize icon names which were camelized by babel plugin

	var SVG_ICONS = (0, _util.mapKeys)(iconMap, function (k) {
	  return k.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/_/g, '').toLowerCase();
	});

	(0, _registration.registerMPComponent)('svg-icon', function (_WebComponent) {
	  _inherits(_class, _WebComponent);

	  function _class() {
	    _classCallCheck(this, _class);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(_class).apply(this, arguments));
	  }

	  _createClass(_class, [{
	    key: 'attachedCallback',
	    value: function attachedCallback() {
	      this.render();
	      this._initialized = true;
	    }
	  }, {
	    key: 'attributeChangedCallback',
	    value: function attributeChangedCallback() {
	      if (this._initialized) {
	        this.render();
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      if (this.isAttributeEnabled('empty')) {
	        this.innerHTML = '';
	      } else {
	        var icon = this.getAttribute('icon');
	        var markup = SVG_ICONS[icon];
	        if (!markup) {
	          throw new Error('No svg-icon "' + icon + '" found.');
	        }
	        this.innerHTML = markup;
	      }
	    }
	  }]);

	  return _class;
	}(_webcomponent2.default));

	exports.SVG_ICONS = SVG_ICONS;

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _array = __webpack_require__(56);

	Object.keys(_array).forEach(function (key) {
	  if (key === "default") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _array[key];
	    }
	  });
	});
	exports.abbreviateNumber = abbreviateNumber;
	exports.capitalize = capitalize;
	exports.commaizeNumber = commaizeNumber;
	exports.extend = extend;
	exports.htmlEncodeString = htmlEncodeString;
	exports.mapKeys = mapKeys;
	exports.mapValues = mapValues;
	exports.nestedObjectDepth = nestedObjectDepth;
	exports.nestedObjectKeys = nestedObjectKeys;
	exports.objectFromPairs = objectFromPairs;
	exports.objToQueryString = objToQueryString;
	exports.parseUrl = parseUrl;
	exports.pick = pick;
	exports.pluralize = pluralize;
	exports.sum = sum;
	exports.truncateMiddle = truncateMiddle;

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	// generic data-manipulation utils

	function abbreviateNumber(number, precision) {
	  number = parseFloat(number);
	  precision = precision === undefined ? 1 : precision;

	  var large_numbers = [[Math.pow(10, 15), 'Q'], [Math.pow(10, 12), 'T'], [Math.pow(10, 9), 'B'], [Math.pow(10, 6), 'M'], [Math.pow(10, 3), 'K']];
	  var suffix = '';

	  for (var i = 0; i < large_numbers.length; i++) {
	    var bignum = large_numbers[i][0];
	    var letter = large_numbers[i][1];

	    if (Math.abs(number) >= bignum) {
	      number /= bignum;
	      suffix = letter;
	      break;
	    }
	  }

	  var is_negative = number < 0;
	  var fixed = number.toFixed(precision).split('.');
	  var formatted = commaizeNumber(Math.abs(parseInt(fixed[0], 10)));

	  if (fixed[1] && parseInt(fixed[1], 10) !== 0) {
	    formatted += '.' + fixed[1];
	  }

	  return (is_negative ? '-' : '') + formatted + suffix;
	}

	function capitalize(string) {
	  return string && string.charAt(0).toUpperCase() + string.slice(1);
	}

	function commaizeNumber(number, no_conversion) {
	  switch (typeof number === 'undefined' ? 'undefined' : _typeof(number)) {
	    case 'number':
	      if (isNaN(number)) {
	        return number;
	      }
	      number = number.toString();
	      break;
	    case 'string':
	      // noop
	      break;
	    default:
	      return number;
	  }

	  var neg = false;
	  if (number[0] === '-') {
	    neg = true;
	    number = number.slice(1);
	  }

	  // Parse main number
	  var split = number.split('.');
	  var commaized = no_conversion ? split[0] : parseInt(split[0] || 0, 10).toString();

	  if (commaized.length) {
	    commaized = commaized.split('').reverse().join('');
	    commaized = commaized.match(/.{1,3}/g).join(',');
	    commaized = commaized.split('').reverse().join('');
	  }

	  if (split[1]) {
	    // Add decimals, if applicable
	    commaized += '.' + split[1];
	  }

	  if (neg) {
	    commaized = '-' + commaized;
	  }

	  return commaized;
	}

	function extend() {
	  return Object.assign.apply(Object, [{}].concat(_toConsumableArray(Array.prototype.slice.call(arguments))));
	}

	function htmlEncodeString(val) {
	  return String(val).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;').replace(/\r/g, '&#013;').replace(/\n/g, '&#010;');
	}

	// return object with new keys and same values
	function mapKeys(obj, func) {
	  return Object.keys(obj).reduce(function (ret, k) {
	    return Object.assign(ret, _defineProperty({}, func(k, obj[k]), obj[k]));
	  }, {});
	}

	// return object with same keys and new values
	function mapValues(obj, func) {
	  return Object.keys(obj).reduce(function (ret, k) {
	    return Object.assign(ret, _defineProperty({}, k, func(obj[k], k)));
	  }, {});
	}

	function nestedObjectDepth(obj) {
	  return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' ? nestedObjectDepth(obj[Object.keys(obj)[0]]) + 1 : 0;
	}

	function nestedObjectKeys(obj) {
	  var depth = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

	  var keys = new Set();
	  getKeys(obj, depth, keys);
	  return Array.from(keys);
	}

	function getKeys(obj, depth, keySet) {
	  if (nestedObjectDepth(obj) > depth) {
	    Object.values(obj).forEach(function (value) {
	      return getKeys(value, depth, keySet);
	    });
	  } else {
	    Object.keys(obj).forEach(function (key) {
	      return keySet.add(key);
	    });
	  }
	}

	function objectFromPairs(pairs) {
	  var object = {};
	  pairs.forEach(function (pair) {
	    object[pair[0]] = pair[1];
	  });
	  return object;
	}

	function objToQueryString(params) {
	  return Object.keys(params).map(function (k) {
	    return [k, encodeURIComponent(params[k])].join('=');
	  }).join('&');
	}

	function parseUrl(url) {
	  var parser = document.createElement('a');
	  parser.href = url;
	  return {
	    host: parser.host,
	    pathname: parser.pathname,
	    url: parser.url
	  };
	}

	// filter object to include only given keys
	function pick(obj, keys) {
	  return keys.reduce(function (ret, k) {
	    return Object.assign(ret, _defineProperty({}, k, obj[k]));
	  }, {});
	}

	function pluralize(singular, number, plural) {
	  plural = plural || singular + 's';
	  return number === 0 || number > 1 ? plural : singular;
	}

	function sum(arr) {
	  var _sum = 0;
	  for (var i = 0; i < arr.length; i++) {
	    _sum += arr[i];
	  }
	  return _sum;
	}

	function truncateMiddle(string, len) {
	  if (string) {
	    if (len <= 3) {
	      return string.substr(0, len);
	    } else if (string.length <= len) {
	      return string;
	    } else {
	      var start = Math.ceil((len - 3) / 2);
	      var end = -1 * Math.floor((len - 3) / 2);
	      return string.substr(0, start) + '...' + (end ? string.substr(end) : '');
	    }
	  }
	  return string;
	}

/***/ },
/* 56 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.immutableSplice = immutableSplice;
	exports.removeByIndex = removeByIndex;
	exports.removeByValue = removeByValue;
	exports.replaceByIndex = replaceByIndex;
	exports.insertAtIndex = insertAtIndex;
	exports.sorted = sorted;
	exports.unique = unique;
	function immutableSplice(array) {
	  var copy = array.slice(0);

	  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    args[_key - 1] = arguments[_key];
	  }

	  copy.splice.apply(copy, args);
	  return copy;
	}

	function removeByIndex(array, index) {
	  if (index >= array.length || index < -array.length) {
	    throw 'IndexError: array index out of range';
	  }
	  return immutableSplice(array, index, 1);
	}

	function removeByValue(array, value) {
	  var index = array.indexOf(value);
	  if (index === -1) {
	    throw 'ValueError: ' + value + ' is not in array';
	  }
	  return removeByIndex(array, index);
	}

	function replaceByIndex(array, index, value) {
	  if (index >= array.length || index < -array.length) {
	    throw 'IndexError: array index out of range';
	  }
	  return immutableSplice(array, index, 1, value);
	}

	function insertAtIndex(array, index, value) {
	  if (index > array.length || index < -array.length) {
	    throw 'IndexError: array index out of range';
	  }
	  return immutableSplice(array, index, 0, value);
	}

	/**
	 * Sort array without mutating original
	 * @param {Array} arr - array to sort
	 * @param {Object} options - sorting configuration
	 * @param {string} [options.order='asc'] - sort order ('asc' or 'desc')
	 * @param {function} [options.transform] - transforms each element for comparison
	 * when sorting
	 * @example
	 * sorted(['XX', 'A', 'g'], {transform: s => s.toLowerCase()});
	 * // ['A', 'g', 'XX']
	 */
	function sorted(arr) {
	  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	  options.order = options.order || 'asc';
	  return arr.slice().sort(function (a, b) {
	    if (options.transform) {
	      a = options.transform(a);
	      b = options.transform(b);
	    }
	    var cmp = a > b ? 1 : a < b ? -1 : 0;
	    if (options.order === 'desc') {
	      cmp *= -1;
	    }
	    return cmp;
	  });
	}

	function unique(array) {
	  var uniqueArray = [];
	  array.forEach(function (val) {
	    return !uniqueArray.includes(val) && uniqueArray.push(val);
	  });
	  return uniqueArray;
	}

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _panel = __webpack_require__(5);

	var _registration = __webpack_require__(50);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var css = 'a {   cursor: pointer;   text-decoration: none; } a, a:visited {   color: #3b99f0; } a:hover {   color: #4ba8ff; } .mp-font-title {   font-family: \'Proxima Nova\', \'proxima-nova\', sans-serif;   font-size: 18px;   font-weight: 700;   line-height: 1.4;   color: #4c6072; } .mp-font-subtitle {   font-family: \'Proxima Nova\', \'proxima-nova\', sans-serif;   font-size: 15px;   font-weight: 600;   line-height: 18px;   color: #4c6072; } .mp-font-list-item {   font-family: \'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif;   font-size: 13px;   line-height: 1.7;   color: #6e859d; } .mp-font-paragraph {   font-family: \'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif;   font-size: 14px;   font-weight: normal;   line-height: 18px;   color: #6e859d; } * {   -webkit-font-smoothing: antialiased; } input[type=text], textarea {   border: 1px solid #d8e0e7;   border-radius: 4px;   color: #6e859d;   display: inline-block;   font-size: 13px;   font-weight: 500;   -webkit-transition: border-color 150ms ease-out;   transition: border-color 150ms ease-out; } input[type=text] ::-webkit-input-placeholder, textarea ::-webkit-input-placeholder {   color: #9cacbb !important;   font-weight: 400 !important; } input[type=text] ::-moz-placeholder, textarea ::-moz-placeholder {   color: #9cacbb !important;   font-weight: 400 !important; } input[type=text] :-ms-input-placeholder, textarea :-ms-input-placeholder {   color: #9cacbb !important;   font-weight: 400 !important; } input[type=text] ::placeholder, textarea ::placeholder {   color: #9cacbb !important;   font-weight: 400 !important; } input[type=text]:focus, textarea:focus {   border-color: #3391e9;   -webkit-transition: border-color 250ms ease-in;   transition: border-color 250ms ease-in; } *:focus {   outline: 0; } *::-ms-clear {   height: 0;   width: 0; } :host {   display: -webkit-inline-box;   display: -ms-inline-flexbox;   display: inline-flex; } :host {   display: inline-block; } .mp-toggle {   background-color: #eef2f6;   border-radius: 50px;   display: -webkit-box;   display: -ms-flexbox;   display: flex;   padding: 2px; } .mp-toggle .mp-toggle-option {   -webkit-box-align: center;       -ms-flex-align: center;           align-items: center;   background-color: #eef2f6;   border-radius: 50px;   color: #6e859d;   display: -webkit-box;   display: -ms-flexbox;   display: flex;   -webkit-box-flex: 1;       -ms-flex-positive: 1;           flex-grow: 1;   font-size: 11px;   font-weight: bold;   height: 40px;   -webkit-box-pack: center;       -ms-flex-pack: center;           justify-content: center;   text-align: center;   text-transform: uppercase;   -webkit-transition: background-color 0.2s;   transition: background-color 0.2s; } .mp-toggle .mp-toggle-option.mp-toggle-selected {   background-color: #fff; } .mp-toggle .mp-toggle-option:not(.mp-toggle-selected) {   cursor: pointer; } .mp-toggle .mp-toggle-option:not(.mp-toggle-selected):hover {   color: #4ba8ff; } .mp-toggle.mp-toggle-blue {   background-color: #3391e9; } .mp-toggle.mp-toggle-blue .mp-toggle-option {   background-color: #3391e9;   color: #b6dcff; } .mp-toggle.mp-toggle-blue .mp-toggle-option.mp-toggle-selected {   background-color: #6cb8ff;   color: #fff; } .mp-toggle.mp-toggle-blue .mp-toggle-option:not(.mp-toggle-selected):hover {   color: #fff; } ';
	'use strict';

	var template = function render(locals) {
	  locals = locals || {};;;var result_of_with = function ($component, $helpers, Object) {
	    var h = __webpack_require__(51);var __objToAttrs = function __objToAttrs(o) {
	      return Object.keys(o).map(function (k) {
	        return o[k] ? k : false;
	      });
	    };return {

	      value: h("div", { "className": [].concat('mp-toggle').concat($component.className).filter(Boolean).join(' ') }, [$helpers.toggleOptions().map(function (toggleOption, $index) {
	        return h("div", { "onclick": function onclick() {
	            return $helpers.selectOption(toggleOption.value);
	          },
	          "className": [].concat('mp-toggle-option').concat(__objToAttrs({ 'mp-toggle-selected': toggleOption.value === $component.value })).filter(Boolean).join(' ') }, [toggleOption.text]);
	      })].filter(Boolean)) };
	  }.call(this, "$component" in locals ? locals.$component : typeof $component !== "undefined" ? $component : undefined, "$helpers" in locals ? locals.$helpers : typeof $helpers !== "undefined" ? $helpers : undefined, "Object" in locals ? locals.Object : typeof Object !== "undefined" ? Object : undefined);if (result_of_with) return result_of_with.value;
	};

	(0, _registration.registerMPComponent)('mp-toggle', function (_Component) {
	  _inherits(_class, _Component);

	  function _class() {
	    _classCallCheck(this, _class);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(_class).apply(this, arguments));
	  }

	  _createClass(_class, [{
	    key: 'attributeChangedCallback',
	    value: function attributeChangedCallback(attr, oldVal, newVal) {
	      _get(Object.getPrototypeOf(_class.prototype), 'attributeChangedCallback', this).apply(this, arguments);
	      if (attr === 'selected') {
	        this.dispatchEvent(new CustomEvent('change', { detail: { selected: newVal } }));
	      }
	    }
	  }, {
	    key: 'config',
	    get: function get() {
	      var _this2 = this;

	      return {
	        css: css,
	        template: template,
	        useShadowDom: true, helpers: {
	          selectOption: function selectOption(value) {
	            return _this2.value = value;
	          },
	          toggleOptions: function toggleOptions() {
	            return Array.from(_this2.querySelectorAll('mp-toggle-option')).map(function (el) {
	              return {
	                text: el.textContent,
	                value: el.getAttribute('value')
	              };
	            });
	          }
	        } };
	    }
	  }, {
	    key: 'value',
	    get: function get() {
	      return this.getAttribute('selected');
	    },
	    set: function set(value) {
	      this.setAttribute('selected', value);
	    }
	  }]);

	  return _class;
	}(_panel.Component));

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _panel = __webpack_require__(5);

	var _registration = __webpack_require__(50);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	'use strict';

	var template = function render(locals) {
	  locals = locals || {};var h = __webpack_require__(51);return h("div", { "className": [].concat('mp-tooltip-wrapper').concat('mp-tooltip-hidden').filter(Boolean).join(' ') }, [h("div", { "className": [].concat('mp-tooltip-main').filter(Boolean).join(' ') }, [h("content")].filter(Boolean))].filter(Boolean));
	};var css = 'a {   cursor: pointer;   text-decoration: none; } a, a:visited {   color: #3b99f0; } a:hover {   color: #4ba8ff; } .mp-font-title {   font-family: \'Proxima Nova\', \'proxima-nova\', sans-serif;   font-size: 18px;   font-weight: 700;   line-height: 1.4;   color: #4c6072; } .mp-font-subtitle {   font-family: \'Proxima Nova\', \'proxima-nova\', sans-serif;   font-size: 15px;   font-weight: 600;   line-height: 18px;   color: #4c6072; } .mp-font-list-item {   font-family: \'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif;   font-size: 13px;   line-height: 1.7;   color: #6e859d; } .mp-font-paragraph {   font-family: \'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif;   font-size: 14px;   font-weight: normal;   line-height: 18px;   color: #6e859d; } * {   -webkit-font-smoothing: antialiased; } .mp-tooltip-wrapper.mp-tooltip-hidden {   pointer-events: none; } .mp-tooltip-wrapper.mp-tooltip-hidden .mp-tooltip-main {   display: none; } .mp-tooltip-wrapper .mp-tooltip-main {   -webkit-box-align: center;       -ms-flex-align: center;           align-items: center;   background-color: #4c6072;   border-radius: 3px;   color: #fff;   cursor: default;   display: -webkit-box;   display: -ms-flexbox;   display: flex;   font-family: \'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif;   font-size: 12px;   font-weight: bold;   line-height: 9px;   -webkit-box-pack: center;       -ms-flex-pack: center;           justify-content: center;   padding: 8px;   pointer-events: auto;   position: absolute;   text-transform: initial; } .mp-tooltip-wrapper .mp-tooltip-main::after {   border: 5px solid transparent;   border-top-color: #4c6072;   content: "";   height: 0;   left: 50%;   margin-left: -5px;   position: absolute;   top: 100%;   width: 0; } ';


	(0, _registration.registerMPComponent)('mp-tooltip', function (_Component) {
	  _inherits(_class, _Component);

	  function _class() {
	    _classCallCheck(this, _class);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(_class).apply(this, arguments));
	  }

	  _createClass(_class, [{
	    key: 'attachedCallback',
	    value: function attachedCallback() {
	      var _this2 = this;

	      _get(Object.getPrototypeOf(_class.prototype), 'attachedCallback', this).apply(this, arguments);
	      var wrapper = this.el.querySelector('.mp-tooltip-wrapper');
	      var tooltip = this.el.querySelector('.mp-tooltip-main');
	      this.show = function () {
	        wrapper.classList.remove('mp-tooltip-hidden');
	        var leftPos = _this2.parentNode.offsetLeft + _this2.parentNode.offsetWidth / 2 - tooltip.offsetWidth / 2 + 'px';
	        var topPos = _this2.parentNode.offsetTop - tooltip.offsetHeight - 8 + 'px';
	        tooltip.style.left = leftPos;
	        tooltip.style.top = topPos;
	      };
	      this.hide = function () {
	        wrapper.classList.add('mp-tooltip-hidden');
	      };
	      this.stopPropagation = function (e) {
	        e.stopPropagation();
	      };
	      this.parentNode.addEventListener('mouseover', this.show);
	      this.parentNode.addEventListener('mouseleave', this.hide);
	      this.el.addEventListener('click', this.stopPropagation);
	      this.el.addEventListener('mousedown', this.stopPropagation);
	    }
	  }, {
	    key: 'detachedCallback',
	    value: function detachedCallback() {
	      _get(Object.getPrototypeOf(_class.prototype), 'detachedCallback', this).apply(this, arguments);
	      this.parentNode.removeEventListener('mouseover', this.show);
	      this.parentNode.removeEventListener('mouseover', this.hide);
	      this.el.removeEventListener('click', this.stopPropagation);
	      this.el.removeEventListener('mousedown', this.stopPropagation);
	    }
	  }, {
	    key: 'config',
	    get: function get() {
	      return {
	        css: css,
	        template: template,
	        useShadowDom: true
	      };
	    }
	  }]);

	  return _class;
	}(_panel.Component));

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Persistence = exports.MPApp = undefined;

	var _parentFrame = __webpack_require__(60);

	Object.keys(_parentFrame).forEach(function (key) {
	  if (key === "default") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _parentFrame[key];
	    }
	  });
	});

	var _trackingSetup = __webpack_require__(61);

	Object.keys(_trackingSetup).forEach(function (key) {
	  if (key === "default") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _trackingSetup[key];
	    }
	  });
	});

	var _mpApp = __webpack_require__(64);

	var _mpApp2 = _interopRequireDefault(_mpApp);

	var _persistence = __webpack_require__(65);

	var _persistence2 = _interopRequireDefault(_persistence);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.MPApp = _mpApp2.default;
	exports.Persistence = _persistence2.default;

/***/ },
/* 60 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.mirrorLocationHash = mirrorLocationHash;
	function mirrorLocationHash(parentFrame) {
	  // use replaceState in child frame so it doesn't touch browser
	  // history except through communication with parent frame
	  var origReplaceState = window.history.replaceState;
	  window.history.replaceState = function () {
	    origReplaceState.apply(this, arguments);
	    parentFrame.send('hashChange', window.location.hash);
	  };

	  parentFrame.addHandler('hashChange', function (hash) {
	    if (hash !== window.location.hash) {
	      window.history.replaceState(null, null, hash.replace(/^#*/, '#'));
	    }
	  });

	  window.addEventListener('popstate', function () {
	    return parentFrame.send('hashChange', window.location.hash);
	  });
	}

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.initMixpanel = initMixpanel;
	exports.initRollbar = initRollbar;

	var _mixpanelBrowser = __webpack_require__(62);

	var _mixpanelBrowser2 = _interopRequireDefault(_mixpanelBrowser);

	var _rollbarBrowser = __webpack_require__(63);

	var _rollbarBrowser2 = _interopRequireDefault(_rollbarBrowser);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/* global APP_ENV */

	/*
	 * Env-aware tracking initialization utils
	 *
	 * Inject APP_ENV via global var or build tools (Webpack DefinePlugin)
	 *
	 * Recommended usage: create a separate module that initializes
	 * the libs and exports the instances:
	 *
	 * export const mixpanel = initMixpanel('MY MIXPANEL PUBLISHABLE TOKEN');
	 * export const rollbar = initRollbar('MY ROLLBAR PUBLISHABLE TOKEN');
	 *
	 */

	var appEnv = typeof APP_ENV !== 'undefined' ? APP_ENV : 'development';

	function initMixpanel(token, instanceName) {
	  if (appEnv === 'production') {
	    _mixpanelBrowser2.default.init(token, { persistence: 'localStorage' }, instanceName);
	  } else {
	    // Project 132990 Mixpanel Dev
	    _mixpanelBrowser2.default.init('9c4e9a6caf9f429a7e3821141fc769b7', {
	      debug: true,
	      persistence: 'localStorage'
	    }, instanceName);
	  }
	  return _mixpanelBrowser2.default;
	}

	function initRollbar(token) {
	  return _rollbarBrowser2.default.init({
	    accessToken: token,
	    captureUncaught: true,
	    payload: {
	      environment: appEnv
	    }
	  });
	}

/***/ },
/* 62 */
/***/ function(module, exports) {

	'use strict';

	var Config = {
	    DEBUG: false,
	    LIB_VERSION: '2.9.16'
	};

	// since es6 imports are static and we run unit tests from the console, window won't be defined when importing this file
	var win;
	if (typeof(window) === 'undefined') {
	    win = {
	        navigator: {}
	    };
	} else {
	    win = window;
	}



	/*
	 * Saved references to long variable names, so that closure compiler can
	 * minimize file size.
	 */

	var ArrayProto = Array.prototype;
	var FuncProto = Function.prototype;
	var ObjProto = Object.prototype;
	var slice = ArrayProto.slice;
	var toString = ObjProto.toString;
	var hasOwnProperty = ObjProto.hasOwnProperty;
	var windowConsole = win.console;
	var navigator$1 = win.navigator;
	var document$1 = win.document;
	var userAgent = navigator$1.userAgent;
	var nativeBind = FuncProto.bind;
	var nativeForEach = ArrayProto.forEach;
	var nativeIndexOf = ArrayProto.indexOf;
	var nativeIsArray = Array.isArray;
	var breaker = {};
	var _ = {
	    trim: function(str) {
	        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Polyfill
	        return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
	    }
	};

	// Console override
	var console$1 = {
	    /** @type {function(...[*])} */
	    log: function() {
	        if (Config.DEBUG && !_.isUndefined(windowConsole) && windowConsole) {
	            try {
	                windowConsole.log.apply(windowConsole, arguments);
	            } catch (err) {
	                _.each(arguments, function(arg) {
	                    windowConsole.log(arg);
	                });
	            }
	        }
	    },
	    /** @type {function(...[*])} */
	    error: function() {
	        if (Config.DEBUG && !_.isUndefined(windowConsole) && windowConsole) {
	            var args = ['Mixpanel error:'].concat(_.toArray(arguments));
	            try {
	                windowConsole.error.apply(windowConsole, args);
	            } catch (err) {
	                _.each(args, function(arg) {
	                    windowConsole.error(arg);
	                });
	            }
	        }
	    },
	    /** @type {function(...[*])} */
	    critical: function() {
	        if (!_.isUndefined(windowConsole) && windowConsole) {
	            var args = ['Mixpanel error:'].concat(_.toArray(arguments));
	            try {
	                windowConsole.error.apply(windowConsole, args);
	            } catch (err) {
	                _.each(args, function(arg) {
	                    windowConsole.error(arg);
	                });
	            }
	        }
	    }
	};


	// UNDERSCORE
	// Embed part of the Underscore Library
	_.bind = function(func, context) {
	    var args, bound;
	    if (nativeBind && func.bind === nativeBind) {
	        return nativeBind.apply(func, slice.call(arguments, 1));
	    }
	    if (!_.isFunction(func)) {
	        throw new TypeError();
	    }
	    args = slice.call(arguments, 2);
	    bound = function() {
	        if (!(this instanceof bound)) {
	            return func.apply(context, args.concat(slice.call(arguments)));
	        }
	        var ctor = {};
	        ctor.prototype = func.prototype;
	        var self = new ctor();
	        ctor.prototype = null;
	        var result = func.apply(self, args.concat(slice.call(arguments)));
	        if (Object(result) === result) {
	            return result;
	        }
	        return self;
	    };
	    return bound;
	};

	_.bind_instance_methods = function(obj) {
	    for (var func in obj) {
	        if (typeof(obj[func]) === 'function') {
	            obj[func] = _.bind(obj[func], obj);
	        }
	    }
	};

	/**
	 * @param {*=} obj
	 * @param {function(...[*])=} iterator
	 * @param {Object=} context
	 */
	_.each = function(obj, iterator, context) {
	    if (obj === null || obj === undefined) {
	        return;
	    }
	    if (nativeForEach && obj.forEach === nativeForEach) {
	        obj.forEach(iterator, context);
	    } else if (obj.length === +obj.length) {
	        for (var i = 0, l = obj.length; i < l; i++) {
	            if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) {
	                return;
	            }
	        }
	    } else {
	        for (var key in obj) {
	            if (hasOwnProperty.call(obj, key)) {
	                if (iterator.call(context, obj[key], key, obj) === breaker) {
	                    return;
	                }
	            }
	        }
	    }
	};

	_.escapeHTML = function(s) {
	    var escaped = s;
	    if (escaped && _.isString(escaped)) {
	        escaped = escaped
	            .replace(/&/g, '&amp;')
	            .replace(/</g, '&lt;')
	            .replace(/>/g, '&gt;')
	            .replace(/"/g, '&quot;')
	            .replace(/'/g, '&#039;');
	    }
	    return escaped;
	};

	_.extend = function(obj) {
	    _.each(slice.call(arguments, 1), function(source) {
	        for (var prop in source) {
	            if (source[prop] !== void 0) {
	                obj[prop] = source[prop];
	            }
	        }
	    });
	    return obj;
	};

	_.isArray = nativeIsArray || function(obj) {
	    return toString.call(obj) === '[object Array]';
	};

	// from a comment on http://dbj.org/dbj/?p=286
	// fails on only one very rare and deliberate custom object:
	// var bomb = { toString : undefined, valueOf: function(o) { return "function BOMBA!"; }};
	_.isFunction = function(f) {
	    try {
	        return /^\s*\bfunction\b/.test(f);
	    } catch (x) {
	        return false;
	    }
	};

	_.isArguments = function(obj) {
	    return !!(obj && hasOwnProperty.call(obj, 'callee'));
	};

	_.toArray = function(iterable) {
	    if (!iterable) {
	        return [];
	    }
	    if (iterable.toArray) {
	        return iterable.toArray();
	    }
	    if (_.isArray(iterable)) {
	        return slice.call(iterable);
	    }
	    if (_.isArguments(iterable)) {
	        return slice.call(iterable);
	    }
	    return _.values(iterable);
	};

	_.values = function(obj) {
	    var results = [];
	    if (obj === null) {
	        return results;
	    }
	    _.each(obj, function(value) {
	        results[results.length] = value;
	    });
	    return results;
	};

	_.identity = function(value) {
	    return value;
	};

	_.include = function(obj, target) {
	    var found = false;
	    if (obj === null) {
	        return found;
	    }
	    if (nativeIndexOf && obj.indexOf === nativeIndexOf) {
	        return obj.indexOf(target) != -1;
	    }
	    _.each(obj, function(value) {
	        if (found || (found = (value === target))) {
	            return breaker;
	        }
	    });
	    return found;
	};

	_.includes = function(str, needle) {
	    return str.indexOf(needle) !== -1;
	};

	// Underscore Addons
	_.inherit = function(subclass, superclass) {
	    subclass.prototype = new superclass();
	    subclass.prototype.constructor = subclass;
	    subclass.superclass = superclass.prototype;
	    return subclass;
	};

	_.isObject = function(obj) {
	    return (obj === Object(obj) && !_.isArray(obj));
	};

	_.isEmptyObject = function(obj) {
	    if (_.isObject(obj)) {
	        for (var key in obj) {
	            if (hasOwnProperty.call(obj, key)) {
	                return false;
	            }
	        }
	        return true;
	    }
	    return false;
	};

	_.isUndefined = function(obj) {
	    return obj === void 0;
	};

	_.isString = function(obj) {
	    return toString.call(obj) == '[object String]';
	};

	_.isDate = function(obj) {
	    return toString.call(obj) == '[object Date]';
	};

	_.isNumber = function(obj) {
	    return toString.call(obj) == '[object Number]';
	};

	_.isElement = function(obj) {
	    return !!(obj && obj.nodeType === 1);
	};

	_.encodeDates = function(obj) {
	    _.each(obj, function(v, k) {
	        if (_.isDate(v)) {
	            obj[k] = _.formatDate(v);
	        } else if (_.isObject(v)) {
	            obj[k] = _.encodeDates(v); // recurse
	        }
	    });
	    return obj;
	};

	_.timestamp = function() {
	    Date.now = Date.now || function() {
	        return +new Date;
	    };
	    return Date.now();
	};

	_.formatDate = function(d) {
	    // YYYY-MM-DDTHH:MM:SS in UTC
	    function pad(n) {
	        return n < 10 ? '0' + n : n;
	    }
	    return d.getUTCFullYear() + '-' +
	        pad(d.getUTCMonth() + 1) + '-' +
	        pad(d.getUTCDate()) + 'T' +
	        pad(d.getUTCHours()) + ':' +
	        pad(d.getUTCMinutes()) + ':' +
	        pad(d.getUTCSeconds());
	};

	_.safewrap = function(f) {
	    return function() {
	        try {
	            return f.apply(this, arguments);
	        } catch (e) {
	            console$1.critical('Implementation error. Please contact support@mixpanel.com.');
	        }
	    };
	};

	_.safewrap_class = function(klass, functions) {
	    for (var i = 0; i < functions.length; i++) {
	        klass.prototype[functions[i]] = _.safewrap(klass.prototype[functions[i]]);
	    }
	};

	_.safewrap_instance_methods = function(obj) {
	    for (var func in obj) {
	        if (typeof(obj[func]) === 'function') {
	            obj[func] = _.safewrap(obj[func]);
	        }
	    }
	};

	_.strip_empty_properties = function(p) {
	    var ret = {};
	    _.each(p, function(v, k) {
	        if (_.isString(v) && v.length > 0) {
	            ret[k] = v;
	        }
	    });
	    return ret;
	};

	/*
	 * this function returns a copy of object after truncating it.  If
	 * passed an Array or Object it will iterate through obj and
	 * truncate all the values recursively.
	 */
	_.truncate = function(obj, length) {
	    var ret;

	    if (typeof(obj) === 'string') {
	        ret = obj.slice(0, length);
	    } else if (_.isArray(obj)) {
	        ret = [];
	        _.each(obj, function(val) {
	            ret.push(_.truncate(val, length));
	        });
	    } else if (_.isObject(obj)) {
	        ret = {};
	        _.each(obj, function(val, key) {
	            ret[key] = _.truncate(val, length);
	        });
	    } else {
	        ret = obj;
	    }

	    return ret;
	};

	_.JSONEncode = (function() {
	    return function(mixed_val) {
	        var value = mixed_val;
	        var quote = function(string) {
	            var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
	            var meta = { // table of character substitutions
	                '\b': '\\b',
	                '\t': '\\t',
	                '\n': '\\n',
	                '\f': '\\f',
	                '\r': '\\r',
	                '"': '\\"',
	                '\\': '\\\\'
	            };

	            escapable.lastIndex = 0;
	            return escapable.test(string) ?
	                '"' + string.replace(escapable, function(a) {
	                    var c = meta[a];
	                    return typeof c === 'string' ? c :
	                        '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	                }) + '"' :
	                '"' + string + '"';
	        };

	        var str = function(key, holder) {
	            var gap = '';
	            var indent = '    ';
	            var i = 0; // The loop counter.
	            var k = ''; // The member key.
	            var v = ''; // The member value.
	            var length = 0;
	            var mind = gap;
	            var partial = [];
	            var value = holder[key];

	            // If the value has a toJSON method, call it to obtain a replacement value.
	            if (value && typeof value === 'object' &&
	                typeof value.toJSON === 'function') {
	                value = value.toJSON(key);
	            }

	            // What happens next depends on the value's type.
	            switch (typeof value) {
	                case 'string':
	                    return quote(value);

	                case 'number':
	                    // JSON numbers must be finite. Encode non-finite numbers as null.
	                    return isFinite(value) ? String(value) : 'null';

	                case 'boolean':
	                case 'null':
	                    // If the value is a boolean or null, convert it to a string. Note:
	                    // typeof null does not produce 'null'. The case is included here in
	                    // the remote chance that this gets fixed someday.

	                    return String(value);

	                case 'object':
	                    // If the type is 'object', we might be dealing with an object or an array or
	                    // null.
	                    // Due to a specification blunder in ECMAScript, typeof null is 'object',
	                    // so watch out for that case.
	                    if (!value) {
	                        return 'null';
	                    }

	                    // Make an array to hold the partial results of stringifying this object value.
	                    gap += indent;
	                    partial = [];

	                    // Is the value an array?
	                    if (toString.apply(value) === '[object Array]') {
	                        // The value is an array. Stringify every element. Use null as a placeholder
	                        // for non-JSON values.

	                        length = value.length;
	                        for (i = 0; i < length; i += 1) {
	                            partial[i] = str(i, value) || 'null';
	                        }

	                        // Join all of the elements together, separated with commas, and wrap them in
	                        // brackets.
	                        v = partial.length === 0 ? '[]' :
	                            gap ? '[\n' + gap +
	                            partial.join(',\n' + gap) + '\n' +
	                            mind + ']' :
	                            '[' + partial.join(',') + ']';
	                        gap = mind;
	                        return v;
	                    }

	                    // Iterate through all of the keys in the object.
	                    for (k in value) {
	                        if (hasOwnProperty.call(value, k)) {
	                            v = str(k, value);
	                            if (v) {
	                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                            }
	                        }
	                    }

	                    // Join all of the member texts together, separated with commas,
	                    // and wrap them in braces.
	                    v = partial.length === 0 ? '{}' :
	                        gap ? '{' + partial.join(',') + '' +
	                        mind + '}' : '{' + partial.join(',') + '}';
	                    gap = mind;
	                    return v;
	            }
	        };

	        // Make a fake root object containing our value under the key of ''.
	        // Return the result of stringifying the value.
	        return str('', {
	            '': value
	        });
	    };
	})();

	_.JSONDecode = (function() { // https://github.com/douglascrockford/JSON-js/blob/master/json_parse.js
	    var at, // The index of the current character
	        ch, // The current character
	        escapee = {
	            '"': '"',
	            '\\': '\\',
	            '/': '/',
	            'b': '\b',
	            'f': '\f',
	            'n': '\n',
	            'r': '\r',
	            't': '\t'
	        },
	        text,
	        error = function(m) {
	            throw {
	                name: 'SyntaxError',
	                message: m,
	                at: at,
	                text: text
	            };
	        },
	        next = function(c) {
	            // If a c parameter is provided, verify that it matches the current character.
	            if (c && c !== ch) {
	                error('Expected \'' + c + '\' instead of \'' + ch + '\'');
	            }
	            // Get the next character. When there are no more characters,
	            // return the empty string.
	            ch = text.charAt(at);
	            at += 1;
	            return ch;
	        },
	        number = function() {
	            // Parse a number value.
	            var number,
	                string = '';

	            if (ch === '-') {
	                string = '-';
	                next('-');
	            }
	            while (ch >= '0' && ch <= '9') {
	                string += ch;
	                next();
	            }
	            if (ch === '.') {
	                string += '.';
	                while (next() && ch >= '0' && ch <= '9') {
	                    string += ch;
	                }
	            }
	            if (ch === 'e' || ch === 'E') {
	                string += ch;
	                next();
	                if (ch === '-' || ch === '+') {
	                    string += ch;
	                    next();
	                }
	                while (ch >= '0' && ch <= '9') {
	                    string += ch;
	                    next();
	                }
	            }
	            number = +string;
	            if (!isFinite(number)) {
	                error('Bad number');
	            } else {
	                return number;
	            }
	        },

	        string = function() {
	            // Parse a string value.
	            var hex,
	                i,
	                string = '',
	                uffff;
	            // When parsing for string values, we must look for " and \ characters.
	            if (ch === '"') {
	                while (next()) {
	                    if (ch === '"') {
	                        next();
	                        return string;
	                    }
	                    if (ch === '\\') {
	                        next();
	                        if (ch === 'u') {
	                            uffff = 0;
	                            for (i = 0; i < 4; i += 1) {
	                                hex = parseInt(next(), 16);
	                                if (!isFinite(hex)) {
	                                    break;
	                                }
	                                uffff = uffff * 16 + hex;
	                            }
	                            string += String.fromCharCode(uffff);
	                        } else if (typeof escapee[ch] === 'string') {
	                            string += escapee[ch];
	                        } else {
	                            break;
	                        }
	                    } else {
	                        string += ch;
	                    }
	                }
	            }
	            error('Bad string');
	        },
	        white = function() {
	            // Skip whitespace.
	            while (ch && ch <= ' ') {
	                next();
	            }
	        },
	        word = function() {
	            // true, false, or null.
	            switch (ch) {
	                case 't':
	                    next('t');
	                    next('r');
	                    next('u');
	                    next('e');
	                    return true;
	                case 'f':
	                    next('f');
	                    next('a');
	                    next('l');
	                    next('s');
	                    next('e');
	                    return false;
	                case 'n':
	                    next('n');
	                    next('u');
	                    next('l');
	                    next('l');
	                    return null;
	            }
	            error('Unexpected "' + ch + '"');
	        },
	        value, // Placeholder for the value function.
	        array = function() {
	            // Parse an array value.
	            var array = [];

	            if (ch === '[') {
	                next('[');
	                white();
	                if (ch === ']') {
	                    next(']');
	                    return array; // empty array
	                }
	                while (ch) {
	                    array.push(value());
	                    white();
	                    if (ch === ']') {
	                        next(']');
	                        return array;
	                    }
	                    next(',');
	                    white();
	                }
	            }
	            error('Bad array');
	        },
	        object = function() {
	            // Parse an object value.
	            var key,
	                object = {};

	            if (ch === '{') {
	                next('{');
	                white();
	                if (ch === '}') {
	                    next('}');
	                    return object; // empty object
	                }
	                while (ch) {
	                    key = string();
	                    white();
	                    next(':');
	                    if (Object.hasOwnProperty.call(object, key)) {
	                        error('Duplicate key "' + key + '"');
	                    }
	                    object[key] = value();
	                    white();
	                    if (ch === '}') {
	                        next('}');
	                        return object;
	                    }
	                    next(',');
	                    white();
	                }
	            }
	            error('Bad object');
	        };

	    value = function() {
	        // Parse a JSON value. It could be an object, an array, a string,
	        // a number, or a word.
	        white();
	        switch (ch) {
	            case '{':
	                return object();
	            case '[':
	                return array();
	            case '"':
	                return string();
	            case '-':
	                return number();
	            default:
	                return ch >= '0' && ch <= '9' ? number() : word();
	        }
	    };

	    // Return the json_parse function. It will have access to all of the
	    // above functions and variables.
	    return function(source) {
	        var result;

	        text = source;
	        at = 0;
	        ch = ' ';
	        result = value();
	        white();
	        if (ch) {
	            error('Syntax error');
	        }

	        return result;
	    };
	})();

	_.base64Encode = function(data) {
	    var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
	        ac = 0,
	        enc = '',
	        tmp_arr = [];

	    if (!data) {
	        return data;
	    }

	    data = _.utf8Encode(data);

	    do { // pack three octets into four hexets
	        o1 = data.charCodeAt(i++);
	        o2 = data.charCodeAt(i++);
	        o3 = data.charCodeAt(i++);

	        bits = o1 << 16 | o2 << 8 | o3;

	        h1 = bits >> 18 & 0x3f;
	        h2 = bits >> 12 & 0x3f;
	        h3 = bits >> 6 & 0x3f;
	        h4 = bits & 0x3f;

	        // use hexets to index into b64, and append result to encoded string
	        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
	    } while (i < data.length);

	    enc = tmp_arr.join('');

	    switch (data.length % 3) {
	        case 1:
	            enc = enc.slice(0, -2) + '==';
	            break;
	        case 2:
	            enc = enc.slice(0, -1) + '=';
	            break;
	    }

	    return enc;
	};

	_.utf8Encode = function(string) {
	    string = (string + '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

	    var utftext = '',
	        start,
	        end;
	    var stringl = 0,
	        n;

	    start = end = 0;
	    stringl = string.length;

	    for (n = 0; n < stringl; n++) {
	        var c1 = string.charCodeAt(n);
	        var enc = null;

	        if (c1 < 128) {
	            end++;
	        } else if ((c1 > 127) && (c1 < 2048)) {
	            enc = String.fromCharCode((c1 >> 6) | 192, (c1 & 63) | 128);
	        } else {
	            enc = String.fromCharCode((c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128);
	        }
	        if (enc !== null) {
	            if (end > start) {
	                utftext += string.substring(start, end);
	            }
	            utftext += enc;
	            start = end = n + 1;
	        }
	    }

	    if (end > start) {
	        utftext += string.substring(start, string.length);
	    }

	    return utftext;
	};

	_.UUID = (function() {

	    // Time/ticks information
	    // 1*new Date() is a cross browser version of Date.now()
	    var T = function() {
	        var d = 1 * new Date(),
	            i = 0;

	        // this while loop figures how many browser ticks go by
	        // before 1*new Date() returns a new number, ie the amount
	        // of ticks that go by per millisecond
	        while (d == 1 * new Date()) {
	            i++;
	        }

	        return d.toString(16) + i.toString(16);
	    };

	    // Math.Random entropy
	    var R = function() {
	        return Math.random().toString(16).replace('.', '');
	    };

	    // User agent entropy
	    // This function takes the user agent string, and then xors
	    // together each sequence of 8 bytes.  This produces a final
	    // sequence of 8 bytes which it returns as hex.
	    var UA = function() {
	        var ua = userAgent,
	            i, ch, buffer = [],
	            ret = 0;

	        function xor(result, byte_array) {
	            var j, tmp = 0;
	            for (j = 0; j < byte_array.length; j++) {
	                tmp |= (buffer[j] << j * 8);
	            }
	            return result ^ tmp;
	        }

	        for (i = 0; i < ua.length; i++) {
	            ch = ua.charCodeAt(i);
	            buffer.unshift(ch & 0xFF);
	            if (buffer.length >= 4) {
	                ret = xor(ret, buffer);
	                buffer = [];
	            }
	        }

	        if (buffer.length > 0) {
	            ret = xor(ret, buffer);
	        }

	        return ret.toString(16);
	    };

	    return function() {
	        var se = (screen.height * screen.width).toString(16);
	        return (T() + '-' + R() + '-' + UA() + '-' + se + '-' + T());
	    };
	})();

	// _.isBlockedUA()
	// This is to block various web spiders from executing our JS and
	// sending false tracking data
	_.isBlockedUA = function(ua) {
	    if (/(google web preview|baiduspider|yandexbot|bingbot|googlebot|yahoo! slurp)/i.test(ua)) {
	        return true;
	    }
	    return false;
	};

	/**
	 * @param {Object=} formdata
	 * @param {string=} arg_separator
	 */
	_.HTTPBuildQuery = function(formdata, arg_separator) {
	    var use_val, use_key, tmp_arr = [];

	    if (_.isUndefined(arg_separator)) {
	        arg_separator = '&';
	    }

	    _.each(formdata, function(val, key) {
	        use_val = encodeURIComponent(val.toString());
	        use_key = encodeURIComponent(key);
	        tmp_arr[tmp_arr.length] = use_key + '=' + use_val;
	    });

	    return tmp_arr.join(arg_separator);
	};

	_.getQueryParam = function(url, param) {
	    // Expects a raw URL

	    param = param.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
	    var regexS = '[\\?&]' + param + '=([^&#]*)',
	        regex = new RegExp(regexS),
	        results = regex.exec(url);
	    if (results === null || (results && typeof(results[1]) !== 'string' && results[1].length)) {
	        return '';
	    } else {
	        return decodeURIComponent(results[1]).replace(/\+/g, ' ');
	    }
	};

	_.getHashParam = function(hash, param) {
	    var matches = hash.match(new RegExp(param + '=([^&]*)'));
	    return matches ? matches[1] : null;
	};

	// _.cookie
	// Methods partially borrowed from quirksmode.org/js/cookies.html
	_.cookie = {
	    get: function(name) {
	        var nameEQ = name + '=';
	        var ca = document$1.cookie.split(';');
	        for (var i = 0; i < ca.length; i++) {
	            var c = ca[i];
	            while (c.charAt(0) == ' ') {
	                c = c.substring(1, c.length);
	            }
	            if (c.indexOf(nameEQ) === 0) {
	                return decodeURIComponent(c.substring(nameEQ.length, c.length));
	            }
	        }
	        return null;
	    },

	    parse: function(name) {
	        var cookie;
	        try {
	            cookie = _.JSONDecode(_.cookie.get(name)) || {};
	        } catch (err) {
	            // noop
	        }
	        return cookie;
	    },

	    set_seconds: function(name, value, seconds, cross_subdomain, is_secure) {
	        var cdomain = '',
	            expires = '',
	            secure = '';

	        if (cross_subdomain) {
	            var matches = document$1.location.hostname.match(/[a-z0-9][a-z0-9\-]+\.[a-z\.]{2,6}$/i),
	                domain = matches ? matches[0] : '';

	            cdomain = ((domain) ? '; domain=.' + domain : '');
	        }

	        if (seconds) {
	            var date = new Date();
	            date.setTime(date.getTime() + (seconds * 1000));
	            expires = '; expires=' + date.toGMTString();
	        }

	        if (is_secure) {
	            secure = '; secure';
	        }

	        document$1.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/' + cdomain + secure;
	    },

	    set: function(name, value, days, cross_subdomain, is_secure) {
	        var cdomain = '', expires = '', secure = '';

	        if (cross_subdomain) {
	            var matches = document$1.location.hostname.match(/[a-z0-9][a-z0-9\-]+\.[a-z\.]{2,6}$/i),
	                domain = matches ? matches[0] : '';

	            cdomain   = ((domain) ? '; domain=.' + domain : '');
	        }

	        if (days) {
	            var date = new Date();
	            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
	            expires = '; expires=' + date.toGMTString();
	        }

	        if (is_secure) {
	            secure = '; secure';
	        }

	        var new_cookie_val = name + '=' + encodeURIComponent(value) + expires + '; path=/' + cdomain + secure;
	        document$1.cookie = new_cookie_val;
	        return new_cookie_val;
	    },

	    remove: function(name, cross_subdomain) {
	        _.cookie.set(name, '', -1, cross_subdomain);
	    }
	};

	// _.localStorage
	_.localStorage = {
	    error: function(msg) {
	        console$1.error('localStorage error: ' + msg);
	    },

	    get: function(name) {
	        try {
	            return window.localStorage.getItem(name);
	        } catch (err) {
	            _.localStorage.error(err);
	        }
	        return null;
	    },

	    parse: function(name) {
	        try {
	            return _.JSONDecode(_.localStorage.get(name)) || {};
	        } catch (err) {
	            // noop
	        }
	        return null;
	    },

	    set: function(name, value) {
	        try {
	            window.localStorage.setItem(name, value);
	        } catch (err) {
	            _.localStorage.error(err);
	        }
	    },

	    remove: function(name) {
	        try {
	            window.localStorage.removeItem(name);
	        } catch (err) {
	            _.localStorage.error(err);
	        }
	    }
	};

	_.register_event = (function() {
	    // written by Dean Edwards, 2005
	    // with input from Tino Zijdel - crisp@xs4all.nl
	    // with input from Carl Sverre - mail@carlsverre.com
	    // with input from Mixpanel
	    // http://dean.edwards.name/weblog/2005/10/add-event/
	    // https://gist.github.com/1930440

	    /**
	     * @param {Object} element
	     * @param {string} type
	     * @param {function(...[*])} handler
	     * @param {boolean=} oldSchool
	     * @param {boolean=} useCapture
	     */
	    var register_event = function(element, type, handler, oldSchool, useCapture) {
	        if (!element) {
	            console$1.error('No valid element provided to register_event');
	            return;
	        }

	        if (element.addEventListener && !oldSchool) {
	            element.addEventListener(type, handler, !!useCapture);
	        } else {
	            var ontype = 'on' + type;
	            var old_handler = element[ontype]; // can be undefined
	            element[ontype] = makeHandler(element, handler, old_handler);
	        }
	    };

	    function makeHandler(element, new_handler, old_handlers) {
	        var handler = function(event) {
	            event = event || fixEvent(window.event);

	            // this basically happens in firefox whenever another script
	            // overwrites the onload callback and doesn't pass the event
	            // object to previously defined callbacks.  All the browsers
	            // that don't define window.event implement addEventListener
	            // so the dom_loaded handler will still be fired as usual.
	            if (!event) {
	                return undefined;
	            }

	            var ret = true;
	            var old_result, new_result;

	            if (_.isFunction(old_handlers)) {
	                old_result = old_handlers(event);
	            }
	            new_result = new_handler.call(element, event);

	            if ((false === old_result) || (false === new_result)) {
	                ret = false;
	            }

	            return ret;
	        };

	        return handler;
	    }

	    function fixEvent(event) {
	        if (event) {
	            event.preventDefault = fixEvent.preventDefault;
	            event.stopPropagation = fixEvent.stopPropagation;
	        }
	        return event;
	    }
	    fixEvent.preventDefault = function() {
	        this.returnValue = false;
	    };
	    fixEvent.stopPropagation = function() {
	        this.cancelBubble = true;
	    };

	    return register_event;
	})();

	_.dom_query = (function() {
	    /* document.getElementsBySelector(selector)
	    - returns an array of element objects from the current document
	    matching the CSS selector. Selectors can contain element names,
	    class names and ids and can be nested. For example:

	    elements = document.getElementsBySelector('div#main p a.external')

	    Will return an array of all 'a' elements with 'external' in their
	    class attribute that are contained inside 'p' elements that are
	    contained inside the 'div' element which has id="main"

	    New in version 0.4: Support for CSS2 and CSS3 attribute selectors:
	    See http://www.w3.org/TR/css3-selectors/#attribute-selectors

	    Version 0.4 - Simon Willison, March 25th 2003
	    -- Works in Phoenix 0.5, Mozilla 1.3, Opera 7, Internet Explorer 6, Internet Explorer 5 on Windows
	    -- Opera 7 fails

	    Version 0.5 - Carl Sverre, Jan 7th 2013
	    -- Now uses jQuery-esque `hasClass` for testing class name
	    equality.  This fixes a bug related to '-' characters being
	    considered not part of a 'word' in regex.
	    */

	    function getAllChildren(e) {
	        // Returns all children of element. Workaround required for IE5/Windows. Ugh.
	        return e.all ? e.all : e.getElementsByTagName('*');
	    }

	    var bad_whitespace = /[\t\r\n]/g;

	    function hasClass(elem, selector) {
	        var className = ' ' + selector + ' ';
	        return ((' ' + elem.className + ' ').replace(bad_whitespace, ' ').indexOf(className) >= 0);
	    }

	    function getElementsBySelector(selector) {
	        // Attempt to fail gracefully in lesser browsers
	        if (!document$1.getElementsByTagName) {
	            return [];
	        }
	        // Split selector in to tokens
	        var tokens = selector.split(' ');
	        var token, bits, tagName, found, foundCount, i, j, k, elements, currentContextIndex;
	        var currentContext = [document$1];
	        for (i = 0; i < tokens.length; i++) {
	            token = tokens[i].replace(/^\s+/, '').replace(/\s+$/, '');
	            if (token.indexOf('#') > -1) {
	                // Token is an ID selector
	                bits = token.split('#');
	                tagName = bits[0];
	                var id = bits[1];
	                var element = document$1.getElementById(id);
	                if (!element || (tagName && element.nodeName.toLowerCase() != tagName)) {
	                    // element not found or tag with that ID not found, return false
	                    return [];
	                }
	                // Set currentContext to contain just this element
	                currentContext = [element];
	                continue; // Skip to next token
	            }
	            if (token.indexOf('.') > -1) {
	                // Token contains a class selector
	                bits = token.split('.');
	                tagName = bits[0];
	                var className = bits[1];
	                if (!tagName) {
	                    tagName = '*';
	                }
	                // Get elements matching tag, filter them for class selector
	                found = [];
	                foundCount = 0;
	                for (j = 0; j < currentContext.length; j++) {
	                    if (tagName == '*') {
	                        elements = getAllChildren(currentContext[j]);
	                    } else {
	                        elements = currentContext[j].getElementsByTagName(tagName);
	                    }
	                    for (k = 0; k < elements.length; k++) {
	                        found[foundCount++] = elements[k];
	                    }
	                }
	                currentContext = [];
	                currentContextIndex = 0;
	                for (j = 0; j < found.length; j++) {
	                    if (found[j].className &&
	                        _.isString(found[j].className) && // some SVG elements have classNames which are not strings
	                        hasClass(found[j], className)
	                    ) {
	                        currentContext[currentContextIndex++] = found[j];
	                    }
	                }
	                continue; // Skip to next token
	            }
	            // Code to deal with attribute selectors
	            var token_match = token.match(/^(\w*)\[(\w+)([=~\|\^\$\*]?)=?"?([^\]"]*)"?\]$/);
	            if (token_match) {
	                tagName = token_match[1];
	                var attrName = token_match[2];
	                var attrOperator = token_match[3];
	                var attrValue = token_match[4];
	                if (!tagName) {
	                    tagName = '*';
	                }
	                // Grab all of the tagName elements within current context
	                found = [];
	                foundCount = 0;
	                for (j = 0; j < currentContext.length; j++) {
	                    if (tagName == '*') {
	                        elements = getAllChildren(currentContext[j]);
	                    } else {
	                        elements = currentContext[j].getElementsByTagName(tagName);
	                    }
	                    for (k = 0; k < elements.length; k++) {
	                        found[foundCount++] = elements[k];
	                    }
	                }
	                currentContext = [];
	                currentContextIndex = 0;
	                var checkFunction; // This function will be used to filter the elements
	                switch (attrOperator) {
	                    case '=': // Equality
	                        checkFunction = function(e) {
	                            return (e.getAttribute(attrName) == attrValue);
	                        };
	                        break;
	                    case '~': // Match one of space seperated words
	                        checkFunction = function(e) {
	                            return (e.getAttribute(attrName).match(new RegExp('\\b' + attrValue + '\\b')));
	                        };
	                        break;
	                    case '|': // Match start with value followed by optional hyphen
	                        checkFunction = function(e) {
	                            return (e.getAttribute(attrName).match(new RegExp('^' + attrValue + '-?')));
	                        };
	                        break;
	                    case '^': // Match starts with value
	                        checkFunction = function(e) {
	                            return (e.getAttribute(attrName).indexOf(attrValue) === 0);
	                        };
	                        break;
	                    case '$': // Match ends with value - fails with "Warning" in Opera 7
	                        checkFunction = function(e) {
	                            return (e.getAttribute(attrName).lastIndexOf(attrValue) == e.getAttribute(attrName).length - attrValue.length);
	                        };
	                        break;
	                    case '*': // Match ends with value
	                        checkFunction = function(e) {
	                            return (e.getAttribute(attrName).indexOf(attrValue) > -1);
	                        };
	                        break;
	                    default:
	                        // Just test for existence of attribute
	                        checkFunction = function(e) {
	                            return e.getAttribute(attrName);
	                        };
	                }
	                currentContext = [];
	                currentContextIndex = 0;
	                for (j = 0; j < found.length; j++) {
	                    if (checkFunction(found[j])) {
	                        currentContext[currentContextIndex++] = found[j];
	                    }
	                }
	                // alert('Attribute Selector: '+tagName+' '+attrName+' '+attrOperator+' '+attrValue);
	                continue; // Skip to next token
	            }
	            // If we get here, token is JUST an element (not a class or ID selector)
	            tagName = token;
	            found = [];
	            foundCount = 0;
	            for (j = 0; j < currentContext.length; j++) {
	                elements = currentContext[j].getElementsByTagName(tagName);
	                for (k = 0; k < elements.length; k++) {
	                    found[foundCount++] = elements[k];
	                }
	            }
	            currentContext = found;
	        }
	        return currentContext;
	    }

	    return function(query) {
	        if (_.isElement(query)) {
	            return [query];
	        } else if (_.isObject(query) && !_.isUndefined(query.length)) {
	            return query;
	        } else {
	            return getElementsBySelector.call(this, query);
	        }
	    };
	})();

	_.info = {
	    campaignParams: function() {
	        var campaign_keywords = 'utm_source utm_medium utm_campaign utm_content utm_term'.split(' '),
	            kw = '',
	            params = {};
	        _.each(campaign_keywords, function(kwkey) {
	            kw = _.getQueryParam(document$1.URL, kwkey);
	            if (kw.length) {
	                params[kwkey] = kw;
	            }
	        });

	        return params;
	    },

	    searchEngine: function(referrer) {
	        if (referrer.search('https?://(.*)google.([^/?]*)') === 0) {
	            return 'google';
	        } else if (referrer.search('https?://(.*)bing.com') === 0) {
	            return 'bing';
	        } else if (referrer.search('https?://(.*)yahoo.com') === 0) {
	            return 'yahoo';
	        } else if (referrer.search('https?://(.*)duckduckgo.com') === 0) {
	            return 'duckduckgo';
	        } else {
	            return null;
	        }
	    },

	    searchInfo: function(referrer) {
	        var search = _.info.searchEngine(referrer),
	            param = (search != 'yahoo') ? 'q' : 'p',
	            ret = {};

	        if (search !== null) {
	            ret['$search_engine'] = search;

	            var keyword = _.getQueryParam(referrer, param);
	            if (keyword.length) {
	                ret['mp_keyword'] = keyword;
	            }
	        }

	        return ret;
	    },

	    /**
	     * This function detects which browser is running this script.
	     * The order of the checks are important since many user agents
	     * include key words used in later checks.
	     */
	    browser: function(user_agent, vendor, opera) {
	        vendor = vendor || ''; // vendor is undefined for at least IE9
	        if (opera || _.includes(user_agent, ' OPR/')) {
	            if (_.includes(user_agent, 'Mini')) {
	                return 'Opera Mini';
	            }
	            return 'Opera';
	        } else if (/(BlackBerry|PlayBook|BB10)/i.test(user_agent)) {
	            return 'BlackBerry';
	        } else if (_.includes(user_agent, 'IEMobile') || _.includes(user_agent, 'WPDesktop')) {
	            return 'Internet Explorer Mobile';
	        } else if (_.includes(user_agent, 'Edge')) {
	            return 'Microsoft Edge';
	        } else if (_.includes(user_agent, 'FBIOS')) {
	            return 'Facebook Mobile';
	        } else if (_.includes(user_agent, 'Chrome')) {
	            return 'Chrome';
	        } else if (_.includes(user_agent, 'CriOS')) {
	            return 'Chrome iOS';
	        } else if (_.includes(user_agent, 'FxiOS')) {
	            return 'Firefox iOS';
	        } else if (_.includes(vendor, 'Apple')) {
	            if (_.includes(user_agent, 'Mobile')) {
	                return 'Mobile Safari';
	            }
	            return 'Safari';
	        } else if (_.includes(user_agent, 'Android')) {
	            return 'Android Mobile';
	        } else if (_.includes(user_agent, 'Konqueror')) {
	            return 'Konqueror';
	        } else if (_.includes(user_agent, 'Firefox')) {
	            return 'Firefox';
	        } else if (_.includes(user_agent, 'MSIE') || _.includes(user_agent, 'Trident/')) {
	            return 'Internet Explorer';
	        } else if (_.includes(user_agent, 'Gecko')) {
	            return 'Mozilla';
	        } else {
	            return '';
	        }
	    },

	    /**
	     * This function detects which browser version is running this script,
	     * parsing major and minor version (e.g., 42.1). User agent strings from:
	     * http://www.useragentstring.com/pages/useragentstring.php
	     */
	    browserVersion: function(userAgent, vendor, opera) {
	        var browser = _.info.browser(userAgent, vendor, opera);
	        var versionRegexs = {
	            'Internet Explorer Mobile': /rv:(\d+(\.\d+)?)/,
	            'Microsoft Edge': /Edge\/(\d+(\.\d+)?)/,
	            'Chrome': /Chrome\/(\d+(\.\d+)?)/,
	            'Chrome iOS': /CriOS\/(\d+(\.\d+)?)/,
	            'Safari': /Version\/(\d+(\.\d+)?)/,
	            'Mobile Safari': /Version\/(\d+(\.\d+)?)/,
	            'Opera': /(Opera|OPR)\/(\d+(\.\d+)?)/,
	            'Firefox': /Firefox\/(\d+(\.\d+)?)/,
	            'Firefox iOS': /FxiOS\/(\d+(\.\d+)?)/,
	            'Konqueror': /Konqueror:(\d+(\.\d+)?)/,
	            'BlackBerry': /BlackBerry (\d+(\.\d+)?)/,
	            'Android Mobile': /android\s(\d+(\.\d+)?)/,
	            'Internet Explorer': /(rv:|MSIE )(\d+(\.\d+)?)/,
	            'Mozilla': /rv:(\d+(\.\d+)?)/
	        };
	        var regex = versionRegexs[browser];
	        if (regex === undefined) {
	            return null;
	        }
	        var matches = userAgent.match(regex);
	        if (!matches) {
	            return null;
	        }
	        return parseFloat(matches[matches.length - 2]);
	    },

	    os: function() {
	        var a = userAgent;
	        if (/Windows/i.test(a)) {
	            if (/Phone/.test(a) || /WPDesktop/.test(a)) {
	                return 'Windows Phone';
	            }
	            return 'Windows';
	        } else if (/(iPhone|iPad|iPod)/.test(a)) {
	            return 'iOS';
	        } else if (/Android/.test(a)) {
	            return 'Android';
	        } else if (/(BlackBerry|PlayBook|BB10)/i.test(a)) {
	            return 'BlackBerry';
	        } else if (/Mac/i.test(a)) {
	            return 'Mac OS X';
	        } else if (/Linux/.test(a)) {
	            return 'Linux';
	        } else {
	            return '';
	        }
	    },

	    device: function(user_agent) {
	        if (/Windows Phone/i.test(user_agent) || /WPDesktop/.test(user_agent)) {
	            return 'Windows Phone';
	        } else if (/iPad/.test(user_agent)) {
	            return 'iPad';
	        } else if (/iPod/.test(user_agent)) {
	            return 'iPod Touch';
	        } else if (/iPhone/.test(user_agent)) {
	            return 'iPhone';
	        } else if (/(BlackBerry|PlayBook|BB10)/i.test(user_agent)) {
	            return 'BlackBerry';
	        } else if (/Android/.test(user_agent)) {
	            return 'Android';
	        } else {
	            return '';
	        }
	    },

	    referringDomain: function(referrer) {
	        var split = referrer.split('/');
	        if (split.length >= 3) {
	            return split[2];
	        }
	        return '';
	    },

	    properties: function() {
	        return _.extend(_.strip_empty_properties({
	            '$os': _.info.os(),
	            '$browser': _.info.browser(userAgent, navigator$1.vendor, window.opera),
	            '$referrer': document$1.referrer,
	            '$referring_domain': _.info.referringDomain(document$1.referrer),
	            '$device': _.info.device(userAgent)
	        }), {
	            '$current_url': window.location.href,
	            '$browser_version': _.info.browserVersion(userAgent, navigator$1.vendor, window.opera),
	            '$screen_height': screen.height,
	            '$screen_width': screen.width,
	            'mp_lib': 'web',
	            '$lib_version': Config.LIB_VERSION
	        });
	    },

	    people_properties: function() {
	        return _.extend(_.strip_empty_properties({
	            '$os': _.info.os(),
	            '$browser': _.info.browser(userAgent, navigator$1.vendor, window.opera)
	        }), {
	            '$browser_version': _.info.browserVersion(userAgent, navigator$1.vendor, window.opera)
	        });
	    },

	    pageviewInfo: function(page) {
	        return _.strip_empty_properties({
	            'mp_page': page,
	            'mp_referrer': document$1.referrer,
	            'mp_browser': _.info.browser(userAgent, navigator$1.vendor, window.opera),
	            'mp_platform': _.info.os()
	        });
	    }
	};

	// EXPORTS (for closure compiler)
	_['toArray']            = _.toArray;
	_['isObject']           = _.isObject;
	_['JSONEncode']         = _.JSONEncode;
	_['JSONDecode']         = _.JSONDecode;
	_['isBlockedUA']        = _.isBlockedUA;
	_['isEmptyObject']      = _.isEmptyObject;
	_['info']               = _.info;
	_['info']['device']     = _.info.device;
	_['info']['browser']    = _.info.browser;
	_['info']['properties'] = _.info.properties;

	var DISABLE_COOKIE = '__mpced';

	// specifying these locally here since some websites override the global Node var
	// ex: https://www.codingame.com/
	var ELEMENT_NODE = 1;
	var TEXT_NODE = 3;

	var autotrack = {
	    _initializedTokens: [],

	    _previousElementSibling: function(el) {
	        if (el.previousElementSibling) {
	            return el.previousElementSibling;
	        } else {
	            do {
	                el = el.previousSibling;
	            } while (el && el.nodeType !== ELEMENT_NODE);
	            return el;
	        }
	    },

	    _loadScript: function(scriptUrlToLoad, callback) {
	        var scriptTag = document.createElement('script');
	        scriptTag.type = 'text/javascript';
	        scriptTag.src = scriptUrlToLoad;
	        scriptTag.onload = callback;

	        var scripts = document.getElementsByTagName('script');
	        if (scripts.length > 0) {
	            scripts[0].parentNode.insertBefore(scriptTag, scripts[0]);
	        } else {
	            document.body.appendChild(scriptTag);
	        }
	    },

	    _getClassName: function(elem) {
	        switch(typeof elem.className) {
	            case 'string':
	                return elem.className;
	            case 'object': // handle cases where className might be SVGAnimatedString or some other type
	                return elem.className.baseVal || elem.getAttribute('class') || '';
	            default: // future proof
	                return '';
	        }
	    },

	    _getPropertiesFromElement: function(elem) {
	        var props = {
	            'classes': this._getClassName(elem).split(' '),
	            'tag_name': elem.tagName.toLowerCase()
	        };

	        if (_.includes(['input', 'select', 'textarea'], elem.tagName.toLowerCase())) {
	            var formFieldValue = this._getFormFieldValue(elem);
	            if (this._includeProperty(elem, formFieldValue)) {
	                props['value'] = formFieldValue;
	            }
	        }

	        _.each(elem.attributes, function(attr) {
	            props['attr__' + attr.name] = attr.value;
	        });

	        var nthChild = 1;
	        var nthOfType = 1;
	        var currentElem = elem;
	        while (currentElem = this._previousElementSibling(currentElem)) { // eslint-disable-line no-cond-assign
	            nthChild++;
	            if (currentElem.tagName === elem.tagName) {
	                nthOfType++;
	            }
	        }
	        props['nth_child'] = nthChild;
	        props['nth_of_type'] = nthOfType;

	        return props;
	    },

	    /*
	     * Due to potential reference discrepancies (such as the webcomponents.js polyfill)
	     * We want to match tagNames instead of specific reference because something like element === document.body
	     * won't always work because element might not be a native element.
	     */
	    _isTag: function(el, tag) {
	        return el && el.tagName && el.tagName.toLowerCase() === tag.toLowerCase();
	    },

	    _shouldTrackDomEvent: function(element, event) {
	        if (!element || this._isTag(element, 'html') || element.nodeType !== ELEMENT_NODE) {
	            return false;
	        }
	        var tag = element.tagName.toLowerCase();
	        switch (tag) {
	            case 'html':
	                return false;
	            case 'form':
	                return event.type === 'submit';
	            case 'input':
	                if (['button', 'submit'].indexOf(element.getAttribute('type')) === -1) {
	                    return event.type === 'change';
	                } else {
	                    return event.type === 'click';
	                }
	            case 'select':
	            case 'textarea':
	                return event.type === 'change';
	            default:
	                return event.type === 'click';
	        }
	    },

	    _getDefaultProperties: function(eventType) {
	        return {
	            '$event_type': eventType,
	            '$ce_version': 1,
	            '$host': window.location.host,
	            '$pathname': window.location.pathname
	        };
	    },

	    _getInputValue: function(input) {
	        var value = null;
	        var type = input.type.toLowerCase();
	        switch(type) {
	            case 'checkbox':
	                if (input.checked) {
	                    value = [input.value];
	                }
	                break;
	            case 'radio':
	                if (input.checked) {
	                    value = input.value;
	                }
	                break;
	            default:
	                value = input.value;
	                break;
	        }
	        return value;
	    },

	    _getSelectValue: function(select) {
	        var value;
	        if (select.multiple) {
	            var values = [];
	            _.each(select.querySelectorAll('[selected]'), function(option) {
	                values.push(option.value);
	            });
	            value = values;
	        } else {
	            value = select.value;
	        }
	        return value;
	    },

	    _includeProperty: function(input, value) {
	        for (var curEl = input; curEl.parentNode && !this._isTag(curEl, 'body'); curEl = curEl.parentNode) {
	            var classes = this._getClassName(curEl).split(' ');
	            if (_.includes(classes, 'mp-sensitive') || _.includes(classes, 'mp-no-track')) {
	                return false;
	            }
	        }

	        if (_.includes(this._getClassName(input).split(' '), 'mp-include')) {
	            return true;
	        }

	        if (value === null) {
	            return false;
	        }

	        // don't include hidden or password fields
	        var type = input.type || '';
	        switch(type.toLowerCase()) {
	            case 'hidden':
	                return false;
	            case 'password':
	                return false;
	        }

	        // filter out data from fields that look like sensitive fields
	        var name = input.name || input.id || '';
	        var sensitiveNameRegex = /^cc|cardnum|ccnum|creditcard|csc|cvc|cvv|exp|pass|seccode|securitycode|securitynum|socialsec|socsec|ssn/i;
	        if (sensitiveNameRegex.test(name.replace(/[^a-zA-Z0-9]/g, ''))) {
	            return false;
	        }

	        if (typeof value === 'string') {
	            // check to see if input value looks like a credit card number
	            // see: https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9781449327453/ch04s20.html
	            var ccRegex = /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/;
	            if (ccRegex.test((value || '').replace(/[\- ]/g, ''))) {
	                return false;
	            }

	            // check to see if input value looks like a social security number
	            var ssnRegex = /(^\d{3}-?\d{2}-?\d{4}$)/;
	            if (ssnRegex.test(value)) {
	                return false;
	            }
	        }

	        return true;
	    },

	    _getFormFieldValue: function(field) {
	        var val;
	        switch(field.tagName.toLowerCase()) {
	            case 'input':
	                val = this._getInputValue(field);
	                break;
	            case 'select':
	                val = this._getSelectValue(field);
	                break;
	            default:
	                val = field.value || field.textContent;
	                break;
	        }
	        return this._includeProperty(field, val) ? val : null;
	    },

	    _getFormFieldProperties: function(form) {
	        var formFieldProps = {};
	        _.each(form.elements, function(field) {
	            var name = field.getAttribute('name') || field.getAttribute('id');
	            if (name !== null) {
	                name = '$form_field__' + name;
	                var val = this._getFormFieldValue(field);
	                if (this._includeProperty(field, val)) {
	                    var prevFieldVal = formFieldProps[name];
	                    if (prevFieldVal !== undefined) { // combine values for inputs of same name
	                        formFieldProps[name] = [].concat(prevFieldVal, val);
	                    } else {
	                        formFieldProps[name] = val;
	                    }
	                }
	            }
	        }, this);
	        return formFieldProps;
	    },

	    _extractCustomPropertyValue: function(customProperty) {
	        var propValues = [];
	        _.each(document.querySelectorAll(customProperty['css_selector']), function(matchedElem) {
	            if (['input', 'select'].indexOf(matchedElem.tagName.toLowerCase()) > -1) {
	                propValues.push(matchedElem['value']);
	            } else if (matchedElem['textContent']) {
	                propValues.push(matchedElem['textContent']);
	            }
	        });
	        return propValues.join(', ');
	    },

	    _getCustomProperties: function(targetElementList) {
	        var props = {};
	        _.each(this._customProperties, function(customProperty) {
	            _.each(customProperty['event_selectors'], function(eventSelector) {
	                var eventElements = document.querySelectorAll(eventSelector);
	                _.each(eventElements, function(eventElement) {
	                    if (_.includes(targetElementList, eventElement)) {
	                        props[customProperty['name']] = this._extractCustomPropertyValue(customProperty);
	                    }
	                }, this);
	            }, this);
	        }, this);
	        return props;
	    },

	    checkForBackoff: function(resp) {
	        // temporarily stop CE for X seconds if the 'X-MP-CE-Backoff' header says to
	        var secondsToDisable = parseInt(resp.getResponseHeader('X-MP-CE-Backoff'));
	        if (!isNaN(secondsToDisable) && secondsToDisable > 0) {
	            var disableUntil = _.timestamp() + (secondsToDisable * 1000);
	            console.log('disabling CE for ' + secondsToDisable + ' seconds (from ' + _.timestamp() + ' until ' + disableUntil + ')');
	            _.cookie.set_seconds(DISABLE_COOKIE, true, secondsToDisable, true);
	        }
	    },

	    _getEventTarget: function(e) {
	        // https://developer.mozilla.org/en-US/docs/Web/API/Event/target#Compatibility_notes
	        if (typeof e.target === 'undefined') {
	            return e.srcElement;
	        } else {
	            return e.target;
	        }
	    },

	    _trackEvent: function(e, instance) {
	        /*** Don't mess with this code without running IE8 tests on it ***/
	        var target = this._getEventTarget(e);
	        if (target.nodeType === TEXT_NODE) { // defeat Safari bug (see: http://www.quirksmode.org/js/events_properties.html)
	            target = target.parentNode;
	        }

	        if (this._shouldTrackDomEvent(target, e)) {
	            var targetElementList = [target];
	            var curEl = target;
	            while (curEl.parentNode && !this._isTag(curEl, 'body')) {
	                targetElementList.push(curEl.parentNode);
	                curEl = curEl.parentNode;
	            }

	            var elementsJson = [];
	            var href, elementText, form, explicitNoTrack = false;
	            _.each(targetElementList, function(el, idx) {
	                // if the element or a parent element is an anchor tag
	                // include the href as a property
	                if (el.tagName.toLowerCase() === 'a') {
	                    href = el.getAttribute('href');
	                } else if (el.tagName.toLowerCase() === 'form') {
	                    form = el;
	                }
	                // crawl up to max of 5 nodes to populate text content
	                if (!elementText && idx < 5 && el.textContent) {
	                    var textContent = _.trim(el.textContent);
	                    if (textContent) {
	                        elementText = textContent.replace(/[\r\n]/g, ' ').replace(/[ ]+/g, ' ').substring(0, 255);
	                    }
	                }

	                // allow users to programatically prevent tracking of elements by adding class 'mp-no-track'
	                var classes = this._getClassName(el).split(' ');
	                if (_.includes(classes, 'mp-no-track')) {
	                    explicitNoTrack = true;
	                }

	                elementsJson.push(this._getPropertiesFromElement(el));
	            }, this);

	            if (explicitNoTrack) {
	                return false;
	            }

	            var props = _.extend(
	                this._getDefaultProperties(e.type),
	                {
	                    '$elements':  elementsJson,
	                    '$el_attr__href': href,
	                    '$el_text': elementText
	                },
	                this._getCustomProperties(targetElementList)
	            );

	            if (form && (e.type === 'submit' || e.type === 'click')) {
	                _.extend(props, this._getFormFieldProperties(form));
	            }
	            instance.track('$web_event', props);
	            return true;
	        }
	    },

	    // only reason is to stub for unit tests
	    // since you can't override window.location props
	    _navigate: function(href) {
	        window.location.href = href;
	    },

	    _addDomEventHandlers: function(instance) {
	        var handler = _.bind(function(e) {
	            if (_.cookie.parse(DISABLE_COOKIE) !== true) {
	                e = e || window.event;
	                this._trackEvent(e, instance);
	            }
	        }, this);
	        _.register_event(document, 'submit', handler, false, true);
	        _.register_event(document, 'change', handler, false, true);
	        _.register_event(document, 'click', handler, false, true);
	    },

	    _customProperties: {},
	    init: function(instance) {
	        if (!(document && document.body)) {
	            console.log('document not ready yet, trying again in 500 milliseconds...');
	            var that = this;
	            setTimeout(function() { that.init(instance); }, 500);
	            return;
	        }

	        var token = instance.get_config('token');
	        if (this._initializedTokens.indexOf(token) > -1) {
	            console.log('autotrack already initialized for token "' + token + '"');
	            return;
	        }
	        this._initializedTokens.push(token);

	        if (!this._maybeLoadEditor(instance)) { // don't autotrack actions when the editor is enabled
	            var parseDecideResponse = _.bind(function(response) {
	                if (response && response['config'] && response['config']['enable_collect_everything'] === true) {

	                    if (response['custom_properties']) {
	                        this._customProperties = response['custom_properties'];
	                    }

	                    instance.track('$web_event', _.extend({
	                        '$title': document.title
	                    }, this._getDefaultProperties('pageview')));

	                    this._addDomEventHandlers(instance);

	                } else {
	                    instance['__autotrack_enabled'] = false;
	                }
	            }, this);

	            instance._send_request(
	                instance.get_config('decide_host') + '/decide/', {
	                    'verbose': true,
	                    'version': '1',
	                    'lib': 'web',
	                    'token': token
	                },
	                instance._prepare_callback(parseDecideResponse)
	            );
	        }
	    },

	    _editorParamsFromHash: function(instance, hash) {
	        var editorParams;
	        try {
	            var state = _.getHashParam(hash, 'state');
	            state = JSON.parse(decodeURIComponent(state));
	            var expiresInSeconds = _.getHashParam(hash, 'expires_in');
	            editorParams = {
	                'accessToken': _.getHashParam(hash, 'access_token'),
	                'accessTokenExpiresAt': (new Date()).getTime() + (Number(expiresInSeconds) * 1000),
	                'bookmarkletMode': !!state['bookmarkletMode'],
	                'projectId': state['projectId'],
	                'projectOwnerId': state['projectOwnerId'],
	                'projectToken': state['token'],
	                'readOnly': state['readOnly'],
	                'userFlags': state['userFlags'],
	                'userId': state['userId']
	            };
	            window.sessionStorage.setItem('editorParams', JSON.stringify(editorParams));

	            if (state['desiredHash']) {
	                window.location.hash = state['desiredHash'];
	            } else if (window.history) {
	                history.replaceState('', document.title, window.location.pathname + window.location.search); // completely remove hash
	            } else {
	                window.location.hash = ''; // clear hash (but leaves # unfortunately)
	            }
	        } catch (e) {
	            console.error('Unable to parse data from hash', e);
	        }
	        return editorParams;
	    },

	    /**
	     * To load the visual editor, we need an access token and other state. That state comes from one of three places:
	     * 1. In the URL hash params if the customer is using an old snippet
	     * 2. From session storage under the key `_mpcehash` if the snippet already parsed the hash
	     * 3. From session storage under the key `editorParams` if the editor was initialized on a previous page
	     */
	    _maybeLoadEditor: function(instance) {
	        var parseFromUrl = false;
	        if (_.getHashParam(window.location.hash, 'state')) {
	            var state = _.getHashParam(window.location.hash, 'state');
	            state = JSON.parse(decodeURIComponent(state));
	            parseFromUrl = state['action'] === 'mpeditor';
	        }
	        var parseFromStorage = !!window.sessionStorage.getItem('_mpcehash');
	        var editorParams;

	        if (parseFromUrl) { // happens if they are initializing the editor using an old snippet
	            editorParams = this._editorParamsFromHash(instance, window.location.hash);
	        } else if (parseFromStorage) { // happens if they are initialized the editor and using the new snippet
	            editorParams = this._editorParamsFromHash(instance, window.sessionStorage.getItem('_mpcehash'));
	            window.sessionStorage.removeItem('_mpcehash');
	        } else { // get credentials from sessionStorage from a previous initialzation
	            editorParams = JSON.parse(window.sessionStorage.getItem('editorParams') || '{}');
	        }

	        if (editorParams['projectToken'] && instance.get_config('token') === editorParams['projectToken']) {
	            this._loadEditor(instance, editorParams);
	            return true;
	        } else {
	            return false;
	        }
	    },

	    // only load the codeless event editor once, even if there are multiple instances of MixpanelLib
	    _editorLoaded: false,
	    _loadEditor: function(instance, editorParams) {
	        if (!this._editorLoaded) {
	            this._editorLoaded = true;
	            var editorUrl;
	            var cacheBuster = '?_ts=' + (new Date()).getTime();
	            var siteMedia = instance.get_config('app_host') + '/site_media';
	            if (Config.DEBUG) {
	                editorUrl = siteMedia + '/compiled/reports/collect-everything/editor.js' + cacheBuster;
	            } else {
	                editorUrl = siteMedia + '/bundle-webpack/reports/collect-everything/editor.min.js' + cacheBuster;
	            }
	            this._loadScript(editorUrl, function() {
	                window['mp_load_editor'](editorParams);
	            });
	            return true;
	        }
	        return false;
	    },

	    // this is a mechanism to ramp up CE with no server-side interaction.
	    // when CE is active, every page load results in a decide request. we
	    // need to gently ramp this up so we don't overload decide. this decides
	    // deterministically if CE is enabled for this project by modding the char
	    // value of the project token.
	    enabledForProject: function(token, numBuckets, numEnabledBuckets) {
	        numBuckets = !_.isUndefined(numBuckets) ? numBuckets : 10;
	        numEnabledBuckets = !_.isUndefined(numEnabledBuckets) ? numEnabledBuckets : 10;
	        var charCodeSum = 0;
	        for (var i = 0; i < token.length; i++) {
	            charCodeSum += token.charCodeAt(i);
	        }
	        return (charCodeSum % numBuckets) < numEnabledBuckets;
	    },

	    isBrowserSupported: function() {
	        return _.isFunction(document.querySelectorAll);
	    }
	};

	_.bind_instance_methods(autotrack);
	_.safewrap_instance_methods(autotrack);

	/*
	 * Mixpanel JS Library
	 *
	 * Copyright 2012, Mixpanel, Inc. All Rights Reserved
	 * http://mixpanel.com/
	 *
	 * Includes portions of Underscore.js
	 * http://documentcloud.github.com/underscore/
	 * (c) 2011 Jeremy Ashkenas, DocumentCloud Inc.
	 * Released under the MIT License.
	 */

	// ==ClosureCompiler==
	// @compilation_level ADVANCED_OPTIMIZATIONS
	// @output_file_name mixpanel-2.8.min.js
	// ==/ClosureCompiler==

	/*
	SIMPLE STYLE GUIDE:

	this.x === public function
	this._x === internal - only use within this file
	this.__x === private - only use within the class

	Globals should be all caps
	*/

	var init_type;       // MODULE or SNIPPET loader
	var mixpanel_master; // main mixpanel instance / object
	var INIT_MODULE  = 0;
	var INIT_SNIPPET = 1;

	/*
	 * Constants
	 */
	/** @const */   var PRIMARY_INSTANCE_NAME     = 'mixpanel';
	/** @const */   var SET_QUEUE_KEY             = '__mps';
	/** @const */   var SET_ONCE_QUEUE_KEY        = '__mpso';
	/** @const */   var ADD_QUEUE_KEY             = '__mpa';
	/** @const */   var APPEND_QUEUE_KEY          = '__mpap';
	/** @const */   var UNION_QUEUE_KEY           = '__mpu';
	/** @const */   var SET_ACTION                = '$set';
	/** @const */   var SET_ONCE_ACTION           = '$set_once';
	/** @const */   var ADD_ACTION                = '$add';
	/** @const */   var APPEND_ACTION             = '$append';
	/** @const */   var UNION_ACTION              = '$union';
	// This key is deprecated, but we want to check for it to see whether aliasing is allowed.
	/** @const */   var PEOPLE_DISTINCT_ID_KEY    = '$people_distinct_id';
	/** @const */   var ALIAS_ID_KEY              = '__alias';
	/** @const */   var CAMPAIGN_IDS_KEY          = '__cmpns';
	/** @const */   var EVENT_TIMERS_KEY          = '__timers';
	/** @const */   var RESERVED_PROPERTIES       = [
	    SET_QUEUE_KEY,
	    SET_ONCE_QUEUE_KEY,
	    ADD_QUEUE_KEY,
	    APPEND_QUEUE_KEY,
	    UNION_QUEUE_KEY,
	    PEOPLE_DISTINCT_ID_KEY,
	    ALIAS_ID_KEY,
	    CAMPAIGN_IDS_KEY,
	    EVENT_TIMERS_KEY
	];

	/*
	 * Dynamic... constants? Is that an oxymoron?
	 */
	var HTTP_PROTOCOL = (('https:' === document.location.protocol) ? 'https://' : 'http://');

	    // http://hacks.mozilla.org/2009/07/cross-site-xmlhttprequest-with-cors/
	    // https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest#withCredentials
	var USE_XHR = (window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest());

	    // IE<10 does not support cross-origin XHR's but script tags
	    // with defer won't block window.onload; ENQUEUE_REQUESTS
	    // should only be true for Opera<12
	var ENQUEUE_REQUESTS = !USE_XHR && (userAgent.indexOf('MSIE') === -1) && (userAgent.indexOf('Mozilla') === -1);

	/*
	 * Module-level globals
	 */
	var DEFAULT_CONFIG = {
	    'api_host':               HTTP_PROTOCOL + 'api.mixpanel.com',
	    'app_host':               HTTP_PROTOCOL + 'mixpanel.com',
	    'autotrack':              true,
	    'cdn':                    HTTP_PROTOCOL + 'cdn.mxpnl.com',
	    'cross_subdomain_cookie': true,
	    'persistence':            'cookie',
	    'persistence_name':       '',
	    'cookie_name':            '',
	    'loaded':                 function() {},
	    'store_google':           true,
	    'save_referrer':          true,
	    'test':                   false,
	    'verbose':                false,
	    'img':                    false,
	    'track_pageview':         true,
	    'debug':                  false,
	    'track_links_timeout':    300,
	    'cookie_expiration':      365,
	    'upgrade':                false,
	    'disable_persistence':    false,
	    'disable_cookie':         false,
	    'secure_cookie':          false,
	    'ip':                     true,
	    'property_blacklist':     []
	};
	DEFAULT_CONFIG['decide_host'] = DEFAULT_CONFIG['api_host'];

	var DOM_LOADED = false;

	/**
	 * DomTracker Object
	 * @constructor
	 */
	var DomTracker = function() {};

	// interface
	DomTracker.prototype.create_properties = function() {};
	DomTracker.prototype.event_handler = function() {};
	DomTracker.prototype.after_track_handler = function() {};

	DomTracker.prototype.init = function(mixpanel_instance) {
	    this.mp = mixpanel_instance;
	    return this;
	};

	/**
	 * @param {Object|string} query
	 * @param {string} event_name
	 * @param {Object=} properties
	 * @param {function(...[*])=} user_callback
	 */
	DomTracker.prototype.track = function(query, event_name, properties, user_callback) {
	    var that = this;
	    var elements = _.dom_query(query);

	    if (elements.length === 0) {
	        console$1.error('The DOM query (' + query + ') returned 0 elements');
	        return;
	    }

	    _.each(elements, function(element) {
	        _.register_event(element, this.override_event, function(e) {
	            var options = {};
	            var props = that.create_properties(properties, this);
	            var timeout = that.mp.get_config('track_links_timeout');

	            that.event_handler(e, this, options);

	            // in case the mixpanel servers don't get back to us in time
	            window.setTimeout(that.track_callback(user_callback, props, options, true), timeout);

	            // fire the tracking event
	            that.mp.track(event_name, props, that.track_callback(user_callback, props, options));
	        });
	    }, this);

	    return true;
	};

	/**
	 * @param {function(...[*])} user_callback
	 * @param {Object} props
	 * @param {boolean=} timeout_occured
	 */
	DomTracker.prototype.track_callback = function(user_callback, props, options, timeout_occured) {
	    timeout_occured = timeout_occured || false;
	    var that = this;

	    return function() {
	        // options is referenced from both callbacks, so we can have
	        // a 'lock' of sorts to ensure only one fires
	        if (options.callback_fired) { return; }
	        options.callback_fired = true;

	        if (user_callback && user_callback(timeout_occured, props) === false) {
	            // user can prevent the default functionality by
	            // returning false from their callback
	            return;
	        }

	        that.after_track_handler(props, options, timeout_occured);
	    };
	};

	DomTracker.prototype.create_properties = function(properties, element) {
	    var props;

	    if (typeof(properties) === 'function') {
	        props = properties(element);
	    } else {
	        props = _.extend({}, properties);
	    }

	    return props;
	};

	/**
	 * LinkTracker Object
	 * @constructor
	 * @extends DomTracker
	 */
	var LinkTracker = function() {
	    this.override_event = 'click';
	};
	_.inherit(LinkTracker, DomTracker);

	LinkTracker.prototype.create_properties = function(properties, element) {
	    var props = LinkTracker.superclass.create_properties.apply(this, arguments);

	    if (element.href) { props['url'] = element.href; }

	    return props;
	};

	LinkTracker.prototype.event_handler = function(evt, element, options) {
	    options.new_tab = (
	        evt.which === 2 ||
	        evt.metaKey ||
	        evt.ctrlKey ||
	        element.target === '_blank'
	    );
	    options.href = element.href;

	    if (!options.new_tab) {
	        evt.preventDefault();
	    }
	};

	LinkTracker.prototype.after_track_handler = function(props, options) {
	    if (options.new_tab) { return; }

	    setTimeout(function() {
	        window.location = options.href;
	    }, 0);
	};

	/**
	 * FormTracker Object
	 * @constructor
	 * @extends DomTracker
	 */
	var FormTracker = function() {
	    this.override_event = 'submit';
	};
	_.inherit(FormTracker, DomTracker);

	FormTracker.prototype.event_handler = function(evt, element, options) {
	    options.element = element;
	    evt.preventDefault();
	};

	FormTracker.prototype.after_track_handler = function(props, options) {
	    setTimeout(function() {
	        options.element.submit();
	    }, 0);
	};

	/**
	 * Mixpanel Persistence Object
	 * @constructor
	 */
	var MixpanelPersistence = function(config) {
	    this['props'] = {};
	    this.campaign_params_saved = false;

	    if (config['persistence_name']) {
	        this.name = 'mp_' + config['persistence_name'];
	    } else {
	        this.name = 'mp_' + config['token'] + '_mixpanel';
	    }

	    var storage_type = config['persistence'];
	    if (storage_type !== 'cookie' && storage_type !== 'localStorage') {
	        console$1.critical('Unknown persistence type ' + storage_type + '; falling back to cookie');
	        storage_type = config['persistence'] = 'cookie';
	    }

	    var localStorage_supported = function() {
	        var supported = true;
	        try {
	            var key = '__mplssupport__',
	                val = 'xyz';
	            _.localStorage.set(key, val);
	            if (_.localStorage.get(key) !== val) {
	                supported = false;
	            }
	            _.localStorage.remove(key);
	        } catch (err) {
	            supported = false;
	        }
	        if (!supported) {
	            console$1.error('localStorage unsupported; falling back to cookie store');
	        }
	        return supported;
	    };
	    if (storage_type === 'localStorage' && localStorage_supported()) {
	        this.storage = _.localStorage;
	    } else {
	        this.storage = _.cookie;
	    }

	    this.load();
	    this.update_config(config);
	    this.upgrade(config);
	    this.save();
	};

	MixpanelPersistence.prototype.properties = function() {
	    var p = {};
	    // Filter out reserved properties
	    _.each(this['props'], function(v, k) {
	        if (!_.include(RESERVED_PROPERTIES, k)) {
	            p[k] = v;
	        }
	    });
	    return p;
	};

	MixpanelPersistence.prototype.load = function() {
	    if (this.disabled) { return; }

	    var entry = this.storage.parse(this.name);

	    if (entry) {
	        this['props'] = _.extend({}, entry);
	    }
	};

	MixpanelPersistence.prototype.upgrade = function(config) {
	    var upgrade_from_old_lib = config['upgrade'],
	        old_cookie_name,
	        old_cookie;

	    if (upgrade_from_old_lib) {
	        old_cookie_name = 'mp_super_properties';
	        // Case where they had a custom cookie name before.
	        if (typeof(upgrade_from_old_lib) === 'string') {
	            old_cookie_name = upgrade_from_old_lib;
	        }

	        old_cookie = this.storage.parse(old_cookie_name);

	        // remove the cookie
	        this.storage.remove(old_cookie_name);
	        this.storage.remove(old_cookie_name, true);

	        if (old_cookie) {
	            this['props'] = _.extend(
	                this['props'],
	                old_cookie['all'],
	                old_cookie['events']
	            );
	        }
	    }

	    if (!config['cookie_name'] && config['name'] !== 'mixpanel') {
	        // special case to handle people with cookies of the form
	        // mp_TOKEN_INSTANCENAME from the first release of this library
	        old_cookie_name = 'mp_' + config['token'] + '_' + config['name'];
	        old_cookie = this.storage.parse(old_cookie_name);

	        if (old_cookie) {
	            this.storage.remove(old_cookie_name);
	            this.storage.remove(old_cookie_name, true);

	            // Save the prop values that were in the cookie from before -
	            // this should only happen once as we delete the old one.
	            this.register_once(old_cookie);
	        }
	    }

	    if (this.storage === _.localStorage) {
	        old_cookie = _.cookie.parse(this.name);

	        _.cookie.remove(this.name);
	        _.cookie.remove(this.name, true);

	        if (old_cookie) {
	            this.register_once(old_cookie);
	        }
	    }
	};

	MixpanelPersistence.prototype.save = function() {
	    if (this.disabled) { return; }
	    this._expire_notification_campaigns();
	    this.storage.set(
	        this.name,
	        _.JSONEncode(this['props']),
	        this.expire_days,
	        this.cross_subdomain,
	        this.secure
	    );
	};

	MixpanelPersistence.prototype.remove = function() {
	    // remove both domain and subdomain cookies
	    this.storage.remove(this.name, false);
	    this.storage.remove(this.name, true);
	};

	// removes the storage entry and deletes all loaded data
	// forced name for tests
	MixpanelPersistence.prototype.clear = function() {
	    this.remove();
	    this['props'] = {};
	};

	/**
	 * @param {Object} props
	 * @param {*=} default_value
	 * @param {number=} days
	 */
	MixpanelPersistence.prototype.register_once = function(props, default_value, days) {
	    if (_.isObject(props)) {
	        if (typeof(default_value) === 'undefined') { default_value = 'None'; }
	        this.expire_days = (typeof(days) === 'undefined') ? this.default_expiry : days;

	        _.each(props, function(val, prop) {
	            if (!this['props'][prop] || this['props'][prop] === default_value) {
	                this['props'][prop] = val;
	            }
	        }, this);

	        this.save();

	        return true;
	    }
	    return false;
	};

	/**
	 * @param {Object} props
	 * @param {number=} days
	 */
	MixpanelPersistence.prototype.register = function(props, days) {
	    if (_.isObject(props)) {
	        this.expire_days = (typeof(days) === 'undefined') ? this.default_expiry : days;

	        _.extend(this['props'], props);

	        this.save();

	        return true;
	    }
	    return false;
	};

	MixpanelPersistence.prototype.unregister = function(prop) {
	    if (prop in this['props']) {
	        delete this['props'][prop];
	        this.save();
	    }
	};

	MixpanelPersistence.prototype._expire_notification_campaigns = _.safewrap(function() {
	    var campaigns_shown = this['props'][CAMPAIGN_IDS_KEY],
	        EXPIRY_TIME = Config.DEBUG ? 60 * 1000 : 60 * 60 * 1000; // 1 minute (Config.DEBUG) / 1 hour (PDXN)
	    if (!campaigns_shown) {
	        return;
	    }
	    for (var campaign_id in campaigns_shown) {
	        if (1 * new Date() - campaigns_shown[campaign_id] > EXPIRY_TIME) {
	            delete campaigns_shown[campaign_id];
	        }
	    }
	    if (_.isEmptyObject(campaigns_shown)) {
	        delete this['props'][CAMPAIGN_IDS_KEY];
	    }
	});

	MixpanelPersistence.prototype.update_campaign_params = function() {
	    if (!this.campaign_params_saved) {
	        this.register_once(_.info.campaignParams());
	        this.campaign_params_saved = true;
	    }
	};

	MixpanelPersistence.prototype.update_search_keyword = function(referrer) {
	    this.register(_.info.searchInfo(referrer));
	};

	// EXPORTED METHOD, we test this directly.
	MixpanelPersistence.prototype.update_referrer_info = function(referrer) {
	    // If referrer doesn't exist, we want to note the fact that it was type-in traffic.
	    this.register_once({
	        '$initial_referrer': referrer || '$direct',
	        '$initial_referring_domain': _.info.referringDomain(referrer) || '$direct'
	    }, '');
	};

	MixpanelPersistence.prototype.get_referrer_info = function() {
	    return _.strip_empty_properties({
	        '$initial_referrer': this['props']['$initial_referrer'],
	        '$initial_referring_domain': this['props']['$initial_referring_domain']
	    });
	};

	// safely fills the passed in object with stored properties,
	// does not override any properties defined in both
	// returns the passed in object
	MixpanelPersistence.prototype.safe_merge = function(props) {
	    _.each(this['props'], function(val, prop) {
	        if (!(prop in props)) {
	            props[prop] = val;
	        }
	    });

	    return props;
	};

	MixpanelPersistence.prototype.update_config = function(config) {
	    this.default_expiry = this.expire_days = config['cookie_expiration'];
	    this.set_disabled(config['disable_persistence']);
	    this.set_cross_subdomain(config['cross_subdomain_cookie']);
	    this.set_secure(config['secure_cookie']);
	};

	MixpanelPersistence.prototype.set_disabled = function(disabled) {
	    this.disabled = disabled;
	    if (this.disabled) {
	        this.remove();
	    }
	};

	MixpanelPersistence.prototype.set_cross_subdomain = function(cross_subdomain) {
	    if (cross_subdomain !== this.cross_subdomain) {
	        this.cross_subdomain = cross_subdomain;
	        this.remove();
	        this.save();
	    }
	};

	MixpanelPersistence.prototype.get_cross_subdomain = function() {
	    return this.cross_subdomain;
	};

	MixpanelPersistence.prototype.set_secure = function(secure) {
	    if (secure !== this.secure) {
	        this.secure = secure ? true : false;
	        this.remove();
	        this.save();
	    }
	};

	MixpanelPersistence.prototype._add_to_people_queue = function(queue, data) {
	    var q_key = this._get_queue_key(queue),
	        q_data = data[queue],
	        set_q = this._get_or_create_queue(SET_ACTION),
	        set_once_q = this._get_or_create_queue(SET_ONCE_ACTION),
	        add_q = this._get_or_create_queue(ADD_ACTION),
	        union_q = this._get_or_create_queue(UNION_ACTION),
	        append_q = this._get_or_create_queue(APPEND_ACTION, []);

	    if (q_key === SET_QUEUE_KEY) {
	        // Update the set queue - we can override any existing values
	        _.extend(set_q, q_data);
	        // if there was a pending increment, override it
	        // with the set.
	        this._pop_from_people_queue(ADD_ACTION, q_data);
	        // if there was a pending union, override it
	        // with the set.
	        this._pop_from_people_queue(UNION_ACTION, q_data);
	    } else if (q_key === SET_ONCE_QUEUE_KEY) {
	        // only queue the data if there is not already a set_once call for it.
	        _.each(q_data, function(v, k) {
	            if (!(k in set_once_q)) {
	                set_once_q[k] = v;
	            }
	        });
	    } else if (q_key === ADD_QUEUE_KEY) {
	        _.each(q_data, function(v, k) {
	            // If it exists in the set queue, increment
	            // the value
	            if (k in set_q) {
	                set_q[k] += v;
	            } else {
	                // If it doesn't exist, update the add
	                // queue
	                if (!(k in add_q)) {
	                    add_q[k] = 0;
	                }
	                add_q[k] += v;
	            }
	        }, this);
	    } else if (q_key === UNION_QUEUE_KEY) {
	        _.each(q_data, function(v, k) {
	            if (_.isArray(v)) {
	                if (!(k in union_q)) {
	                    union_q[k] = [];
	                }
	                // We may send duplicates, the server will dedup them.
	                union_q[k] = union_q[k].concat(v);
	            }
	        });
	    } else if (q_key === APPEND_QUEUE_KEY) {
	        append_q.push(q_data);
	    }

	    console$1.log('MIXPANEL PEOPLE REQUEST (QUEUED, PENDING IDENTIFY):');
	    console$1.log(data);

	    this.save();
	};

	MixpanelPersistence.prototype._pop_from_people_queue = function(queue, data) {
	    var q = this._get_queue(queue);
	    if (!_.isUndefined(q)) {
	        _.each(data, function(v, k) {
	            delete q[k];
	        }, this);

	        this.save();
	    }
	};

	MixpanelPersistence.prototype._get_queue_key = function(queue) {
	    if (queue === SET_ACTION) {
	        return SET_QUEUE_KEY;
	    } else if (queue === SET_ONCE_ACTION) {
	        return SET_ONCE_QUEUE_KEY;
	    } else if (queue === ADD_ACTION) {
	        return ADD_QUEUE_KEY;
	    } else if (queue === APPEND_ACTION) {
	        return APPEND_QUEUE_KEY;
	    } else if (queue === UNION_ACTION) {
	        return UNION_QUEUE_KEY;
	    } else {
	        console$1.error('Invalid queue:', queue);
	    }
	};

	MixpanelPersistence.prototype._get_queue = function(queue) {
	    return this['props'][this._get_queue_key(queue)];
	};
	MixpanelPersistence.prototype._get_or_create_queue = function(queue, default_val) {
	    var key = this._get_queue_key(queue);
	    default_val = _.isUndefined(default_val) ? {} : default_val;

	    return this['props'][key] || (this['props'][key] = default_val);
	};

	MixpanelPersistence.prototype.set_event_timer = function(event_name, timestamp) {
	    var timers = this['props'][EVENT_TIMERS_KEY] || {};
	    timers[event_name] = timestamp;
	    this['props'][EVENT_TIMERS_KEY] = timers;
	    this.save();
	};

	MixpanelPersistence.prototype.remove_event_timer = function(event_name) {
	    var timers = this['props'][EVENT_TIMERS_KEY] || {};
	    var timestamp = timers[event_name];
	    if (!_.isUndefined(timestamp)) {
	        delete this['props'][EVENT_TIMERS_KEY][event_name];
	        this.save();
	    }
	    return timestamp;
	};

	/**
	 * Mixpanel Library Object
	 * @constructor
	 */
	var MixpanelLib = function() {};

	/**
	 * Mixpanel People Object
	 * @constructor
	 */
	var MixpanelPeople = function() {};

	var MPNotif;

	/**
	 * create_mplib(token:string, config:object, name:string)
	 *
	 * This function is used by the init method of MixpanelLib objects
	 * as well as the main initializer at the end of the JSLib (that
	 * initializes document.mixpanel as well as any additional instances
	 * declared before this file has loaded).
	 */
	var create_mplib = function(token, config, name) {
	    var instance,
	        target = (name === PRIMARY_INSTANCE_NAME) ? mixpanel_master : mixpanel_master[name];

	    if (target && init_type === INIT_MODULE) {
	        instance = target;
	    } else {
	        if (target && !_.isArray(target)) {
	            console$1.error('You have already initialized ' + name);
	            return;
	        }
	        instance = new MixpanelLib();
	    }

	    instance._init(token, config, name);

	    instance['people'] = new MixpanelPeople();
	    instance['people']._init(instance);

	    // if any instance on the page has debug = true, we set the
	    // global debug to be true
	    Config.DEBUG = Config.DEBUG || instance.get_config('debug');

	    instance['__autotrack_enabled'] = instance.get_config('autotrack');
	    if (instance.get_config('autotrack')) {
	        var num_buckets = 100;
	        var num_enabled_buckets = 100;
	        if (!autotrack.enabledForProject(instance.get_config('token'), num_buckets, num_enabled_buckets)) {
	            instance['__autotrack_enabled'] = false;
	            console$1.log('Not in active bucket: disabling Automatic Event Collection.');
	        } else if (!autotrack.isBrowserSupported()) {
	            instance['__autotrack_enabled'] = false;
	            console$1.log('Disabling Automatic Event Collection because this browser is not supported');
	        } else {
	            autotrack.init(instance);
	        }

	        try {
	            add_dom_event_counting_handlers(instance);
	        } catch (e) {
	            console$1.error(e);
	        }
	    }

	    // if target is not defined, we called init after the lib already
	    // loaded, so there won't be an array of things to execute
	    if (!_.isUndefined(target) && _.isArray(target)) {
	        // Crunch through the people queue first - we queue this data up &
	        // flush on identify, so it's better to do all these operations first
	        instance._execute_array.call(instance['people'], target['people']);
	        instance._execute_array(target);
	    }

	    return instance;
	};

	// Initialization methods

	/**
	 * This function initializes a new instance of the Mixpanel tracking object.
	 * All new instances are added to the main mixpanel object as sub properties (such as
	 * mixpanel.library_name) and also returned by this function. To define a
	 * second instance on the page, you would call:
	 *
	 *     mixpanel.init('new token', { your: 'config' }, 'library_name');
	 *
	 * and use it like so:
	 *
	 *     mixpanel.library_name.track(...);
	 *
	 * @param {String} token   Your Mixpanel API token
	 * @param {Object} [config]  A dictionary of config options to override
	 * @param {String} [name]    The name for the new mixpanel instance that you want created
	 */
	MixpanelLib.prototype.init = function (token, config, name) {
	    if (_.isUndefined(name)) {
	        console$1.error('You must name your new library: init(token, config, name)');
	        return;
	    }
	    if (name === PRIMARY_INSTANCE_NAME) {
	        console$1.error('You must initialize the main mixpanel object right after you include the Mixpanel js snippet');
	        return;
	    }

	    var instance = create_mplib(token, config, name);
	    mixpanel_master[name] = instance;
	    instance._loaded();

	    return instance;
	};

	// mixpanel._init(token:string, config:object, name:string)
	//
	// This function sets up the current instance of the mixpanel
	// library.  The difference between this method and the init(...)
	// method is this one initializes the actual instance, whereas the
	// init(...) method sets up a new library and calls _init on it.
	//
	MixpanelLib.prototype._init = function(token, config, name) {
	    this['__loaded'] = true;
	    this['config'] = {};

	    this.set_config(_.extend({}, DEFAULT_CONFIG, config, {
	        'name': name,
	        'token': token,
	        'callback_fn': ((name === PRIMARY_INSTANCE_NAME) ? name : PRIMARY_INSTANCE_NAME + '.' + name) + '._jsc'
	    }));

	    this['_jsc'] = function() {};

	    this.__dom_loaded_queue = [];
	    this.__request_queue = [];
	    this.__disabled_events = [];
	    this._flags = {
	        'disable_all_events': false,
	        'identify_called': false
	    };

	    this['persistence'] = this['cookie'] = new MixpanelPersistence(this['config']);
	    this.register_once({'distinct_id': _.UUID()}, '');
	};

	// Private methods

	MixpanelLib.prototype._loaded = function() {
	    this.get_config('loaded')(this);

	    // this happens after so a user can call identify/name_tag in
	    // the loaded callback
	    if (this.get_config('track_pageview')) {
	        this.track_pageview();
	    }
	};

	MixpanelLib.prototype._dom_loaded = function() {
	    _.each(this.__dom_loaded_queue, function(item) {
	        this._track_dom.apply(this, item);
	    }, this);
	    _.each(this.__request_queue, function(item) {
	        this._send_request.apply(this, item);
	    }, this);
	    delete this.__dom_loaded_queue;
	    delete this.__request_queue;
	};

	MixpanelLib.prototype._track_dom = function(DomClass, args) {
	    if (this.get_config('img')) {
	        console$1.error('You can\'t use DOM tracking functions with img = true.');
	        return false;
	    }

	    if (!DOM_LOADED) {
	        this.__dom_loaded_queue.push([DomClass, args]);
	        return false;
	    }

	    var dt = new DomClass().init(this);
	    return dt.track.apply(dt, args);
	};

	/**
	 * _prepare_callback() should be called by callers of _send_request for use
	 * as the callback argument.
	 *
	 * If there is no callback, this returns null.
	 * If we are going to make XHR/XDR requests, this returns a function.
	 * If we are going to use script tags, this returns a string to use as the
	 * callback GET param.
	 */
	MixpanelLib.prototype._prepare_callback = function(callback, data) {
	    if (_.isUndefined(callback)) {
	        return null;
	    }

	    if (USE_XHR) {
	        var callback_function = function(response) {
	            callback(response, data);
	        };
	        return callback_function;
	    } else {
	        // if the user gives us a callback, we store as a random
	        // property on this instances jsc function and update our
	        // callback string to reflect that.
	        var jsc = this['_jsc'];
	        var randomized_cb = '' + Math.floor(Math.random() * 100000000);
	        var callback_string = this.get_config('callback_fn') + '[' + randomized_cb + ']';
	        jsc[randomized_cb] = function(response) {
	            delete jsc[randomized_cb];
	            callback(response, data);
	        };
	        return callback_string;
	    }
	};

	MixpanelLib.prototype._send_request = function(url, data, callback) {
	    if (ENQUEUE_REQUESTS) {
	        this.__request_queue.push(arguments);
	        return;
	    }

	    // needed to correctly format responses
	    var verbose_mode = this.get_config('verbose');
	    if (data['verbose']) { verbose_mode = true; }

	    if (this.get_config('test')) { data['test'] = 1; }
	    if (verbose_mode) { data['verbose'] = 1; }
	    if (this.get_config('img')) { data['img'] = 1; }
	    if (!USE_XHR) {
	        if (callback) {
	            data['callback'] = callback;
	        } else if (verbose_mode || this.get_config('test')) {
	            // Verbose output (from verbose mode, or an error in test mode) is a json blob,
	            // which by itself is not valid javascript. Without a callback, this verbose output will
	            // cause an error when returned via jsonp, so we force a no-op callback param.
	            // See the ECMA script spec: http://www.ecma-international.org/ecma-262/5.1/#sec-12.4
	            data['callback'] = '(function(){})';
	        }
	    }

	    data['ip'] = this.get_config('ip')?1:0;
	    data['_'] = new Date().getTime().toString();
	    url += '?' + _.HTTPBuildQuery(data);

	    if ('img' in data) {
	        var img = document.createElement('img');
	        img.src = url;
	        document.body.appendChild(img);
	    } else if (USE_XHR) {
	        try {
	            var req = new XMLHttpRequest();
	            req.open('GET', url, true);
	            // send the mp_optout cookie
	            // withCredentials cannot be modified until after calling .open on Android and Mobile Safari
	            req.withCredentials = true;
	            req.onreadystatechange = function () {
	                if (req.readyState === 4) { // XMLHttpRequest.DONE == 4, except in safari 4
	                    if (url.indexOf('api.mixpanel.com/track') !== -1) {
	                        autotrack.checkForBackoff(req);
	                    }
	                    if (req.status === 200) {
	                        if (callback) {
	                            if (verbose_mode) {
	                                callback(_.JSONDecode(req.responseText));
	                            } else {
	                                callback(Number(req.responseText));
	                            }
	                        }
	                    } else {
	                        var error = 'Bad HTTP status: ' + req.status + ' ' + req.statusText;
	                        console$1.error(error);
	                        if (callback) {
	                            if (verbose_mode) {
	                                callback({status: 0, error: error});
	                            } else {
	                                callback(0);
	                            }
	                        }
	                    }
	                }
	            };
	            req.send(null);
	        } catch (e) {
	            console$1.error(e);
	        }
	    } else {
	        var script = document.createElement('script');
	        script.type = 'text/javascript';
	        script.async = true;
	        script.defer = true;
	        script.src = url;
	        var s = document.getElementsByTagName('script')[0];
	        s.parentNode.insertBefore(script, s);
	    }
	};

	/**
	 * _execute_array() deals with processing any mixpanel function
	 * calls that were called before the Mixpanel library were loaded
	 * (and are thus stored in an array so they can be called later)
	 *
	 * Note: we fire off all the mixpanel function calls && user defined
	 * functions BEFORE we fire off mixpanel tracking calls. This is so
	 * identify/register/set_config calls can properly modify early
	 * tracking calls.
	 *
	 * @param {Array} array
	 */
	MixpanelLib.prototype._execute_array = function(array) {
	    var fn_name, alias_calls = [], other_calls = [], tracking_calls = [];
	    _.each(array, function(item) {
	        if (item) {
	            fn_name = item[0];
	            if (typeof(item) === 'function') {
	                item.call(this);
	            } else if (_.isArray(item) && fn_name === 'alias') {
	                alias_calls.push(item);
	            } else if (_.isArray(item) && fn_name.indexOf('track') !== -1 && typeof(this[fn_name]) === 'function') {
	                tracking_calls.push(item);
	            } else {
	                other_calls.push(item);
	            }
	        }
	    }, this);

	    var execute = function(calls, context) {
	        _.each(calls, function(item) {
	            this[item[0]].apply(this, item.slice(1));
	        }, context);
	    };

	    execute(alias_calls, this);
	    execute(other_calls, this);
	    execute(tracking_calls, this);
	};

	/**
	 * push() keeps the standard async-array-push
	 * behavior around after the lib is loaded.
	 * This is only useful for external integrations that
	 * do not wish to rely on our convenience methods
	 * (created in the snippet).
	 *
	 * ### Usage:
	 *     mixpanel.push(['register', { a: 'b' }]);
	 *
	 * @param {Array} item A [function_name, args...] array to be executed
	 */
	MixpanelLib.prototype.push = function(item) {
	    this._execute_array([item]);
	};

	/**
	 * Disable events on the Mixpanel object. If passed no arguments,
	 * this function disables tracking of any event. If passed an
	 * array of event names, those events will be disabled, but other
	 * events will continue to be tracked.
	 *
	 * Note: this function does not stop other mixpanel functions from
	 * firing, such as register() or people.set().
	 *
	 * @param {Array} [events] An array of event names to disable
	 */
	MixpanelLib.prototype.disable = function(events) {
	    if (typeof(events) === 'undefined') {
	        this._flags.disable_all_events = true;
	    } else {
	        this.__disabled_events = this.__disabled_events.concat(events);
	    }
	};

	/**
	 * Track an event. This is the most important and
	 * frequently used Mixpanel function.
	 *
	 * ### Usage:
	 *
	 *     // track an event named 'Registered'
	 *     mixpanel.track('Registered', {'Gender': 'Male', 'Age': 21});
	 *
	 * To track link clicks or form submissions, see track_links() or track_forms().
	 *
	 * @param {String} event_name The name of the event. This can be anything the user does - 'Button Click', 'Sign Up', 'Item Purchased', etc.
	 * @param {Object} [properties] A set of properties to include with the event you're sending. These describe the user who did the event or details about the event itself.
	 * @param {Function} [callback] If provided, the callback function will be called after tracking the event.
	 */
	MixpanelLib.prototype.track = function(event_name, properties, callback) {
	    if (typeof(callback) !== 'function') {
	        callback = function() {};
	    }

	    if (_.isUndefined(event_name)) {
	        console$1.error('No event name provided to mixpanel.track');
	        return;
	    }

	    if (this._event_is_disabled(event_name)) {
	        callback(0);
	        return;
	    }

	    // set defaults
	    properties = properties || {};
	    properties['token'] = this.get_config('token');

	    // set $duration if time_event was previously called for this event
	    var start_timestamp = this['persistence'].remove_event_timer(event_name);
	    if (!_.isUndefined(start_timestamp)) {
	        var duration_in_ms = new Date().getTime() - start_timestamp;
	        properties['$duration'] = parseFloat((duration_in_ms / 1000).toFixed(3));
	    }

	    // update persistence
	    this['persistence'].update_search_keyword(document.referrer);

	    if (this.get_config('store_google')) { this['persistence'].update_campaign_params(); }
	    if (this.get_config('save_referrer')) { this['persistence'].update_referrer_info(document.referrer); }

	    // note: extend writes to the first object, so lets make sure we
	    // don't write to the persistence properties object and info
	    // properties object by passing in a new object

	    // update properties with pageview info and super-properties
	    properties = _.extend(
	        {},
	        _.info.properties(),
	        this['persistence'].properties(),
	        properties
	    );

	    try {
	        if (this.get_config('autotrack') && event_name !== 'mp_page_view' && event_name !== '$create_alias') {
	            // The point of $__c is to count how many clicks occur per tracked event. Since we're
	            // tracking an event in this function, we need to reset the $__c value.
	            properties = _.extend({}, properties, this.mp_counts);
	            this.mp_counts = {'$__c': 0};
	            _.cookie.set('mp_' + this.get_config('name') + '__c', 0, 1, true);
	        }
	    } catch (e) {
	        console$1.error(e);
	    }

	    var property_blacklist = this.get_config('property_blacklist');
	    if (_.isArray(property_blacklist)) {
	        _.each(property_blacklist, function(blacklisted_prop) {
	            delete properties[blacklisted_prop];
	        });
	    } else {
	        console$1.error('Invalid value for property_blacklist config: ' + property_blacklist);
	    }

	    var data = {
	        'event': event_name,
	        'properties': properties
	    };

	    var truncated_data = _.truncate(data, 255);
	    var json_data      = _.JSONEncode(truncated_data);
	    var encoded_data   = _.base64Encode(json_data);

	    console$1.log('MIXPANEL REQUEST:');
	    console$1.log(truncated_data);

	    this._send_request(
	        this.get_config('api_host') + '/track/',
	        { 'data': encoded_data },
	        this._prepare_callback(callback, truncated_data)
	    );

	    return truncated_data;
	};

	/**
	 * Track a page view event, which is currently ignored by the server.
	 * This function is called by default on page load unless the
	 * track_pageview configuration variable is false.
	 *
	 * @param {String} [page] The url of the page to record. If you don't include this, it defaults to the current url.
	 * @api private
	 */
	MixpanelLib.prototype.track_pageview = function(page) {
	    if (_.isUndefined(page)) {
	        page = document.location.href;
	    }
	    this.track('mp_page_view', _.info.pageviewInfo(page));
	};

	/**
	 * Track clicks on a set of document elements. Selector must be a
	 * valid query. Elements must exist on the page at the time track_links is called.
	 *
	 * ### Usage:
	 *
	 *     // track click for link id #nav
	 *     mixpanel.track_links('#nav', 'Clicked Nav Link');
	 *
	 * ### Notes:
	 *
	 * This function will wait up to 300 ms for the Mixpanel
	 * servers to respond. If they have not responded by that time
	 * it will head to the link without ensuring that your event
	 * has been tracked.  To configure this timeout please see the
	 * set_config() documentation below.
	 *
	 * If you pass a function in as the properties argument, the
	 * function will receive the DOMElement that triggered the
	 * event as an argument.  You are expected to return an object
	 * from the function; any properties defined on this object
	 * will be sent to mixpanel as event properties.
	 *
	 * @type {Function}
	 * @param {Object|String} query A valid DOM query, element or jQuery-esque list
	 * @param {String} event_name The name of the event to track
	 * @param {Object|Function} [properties] A properties object or function that returns a dictionary of properties when passed a DOMElement
	 */
	MixpanelLib.prototype.track_links = function() {
	    return this._track_dom.call(this, LinkTracker, arguments);
	};

	/**
	 * Track form submissions. Selector must be a valid query.
	 *
	 * ### Usage:
	 *
	 *     // track submission for form id 'register'
	 *     mixpanel.track_forms('#register', 'Created Account');
	 *
	 * ### Notes:
	 *
	 * This function will wait up to 300 ms for the mixpanel
	 * servers to respond, if they have not responded by that time
	 * it will head to the link without ensuring that your event
	 * has been tracked.  To configure this timeout please see the
	 * set_config() documentation below.
	 *
	 * If you pass a function in as the properties argument, the
	 * function will receive the DOMElement that triggered the
	 * event as an argument.  You are expected to return an object
	 * from the function; any properties defined on this object
	 * will be sent to mixpanel as event properties.
	 *
	 * @type {Function}
	 * @param {Object|String} query A valid DOM query, element or jQuery-esque list
	 * @param {String} event_name The name of the event to track
	 * @param {Object|Function} [properties] This can be a set of properties, or a function that returns a set of properties after being passed a DOMElement
	 */
	MixpanelLib.prototype.track_forms = function() {
	    return this._track_dom.call(this, FormTracker, arguments);
	};

	/**
	 * Time an event by including the time between this call and a
	 * later 'track' call for the same event in the properties sent
	 * with the event.
	 *
	 * ### Usage:
	 *
	 *     // time an event named 'Registered'
	 *     mixpanel.time_event('Registered');
	 *     mixpanel.track('Registered', {'Gender': 'Male', 'Age': 21});
	 *
	 * When called for a particular event name, the next track call for that event
	 * name will include the elapsed time between the 'time_event' and 'track'
	 * calls. This value is stored as seconds in the '$duration' property.
	 *
	 * @param {String} event_name The name of the event.
	 */
	MixpanelLib.prototype.time_event = function(event_name) {
	    if (_.isUndefined(event_name)) {
	        console$1.error('No event name provided to mixpanel.time_event');
	        return;
	    }

	    if (this._event_is_disabled(event_name)) {
	        return;
	    }

	    this['persistence'].set_event_timer(event_name,  new Date().getTime());
	};

	/**
	 * Register a set of super properties, which are included with all
	 * events. This will overwrite previous super property values.
	 *
	 * ### Usage:
	 *
	 *     // register 'Gender' as a super property
	 *     mixpanel.register({'Gender': 'Female'});
	 *
	 *     // register several super properties when a user signs up
	 *     mixpanel.register({
	 *         'Email': 'jdoe@example.com',
	 *         'Account Type': 'Free'
	 *     });
	 *
	 * @param {Object} properties An associative array of properties to store about the user
	 * @param {Number} [days] How many days since the user's last visit to store the super properties
	 */
	MixpanelLib.prototype.register = function(props, days) {
	    this['persistence'].register(props, days);
	};

	/**
	 * Register a set of super properties only once. This will not
	 * overwrite previous super property values, unlike register().
	 *
	 * ### Usage:
	 *
	 *     // register a super property for the first time only
	 *     mixpanel.register_once({
	 *         'First Login Date': new Date().toISOString()
	 *     });
	 *
	 * ### Notes:
	 *
	 * If default_value is specified, current super properties
	 * with that value will be overwritten.
	 *
	 * @param {Object} properties An associative array of properties to store about the user
	 * @param {*} [default_value] Value to override if already set in super properties (ex: 'False') Default: 'None'
	 * @param {Number} [days] How many days since the users last visit to store the super properties
	 */
	MixpanelLib.prototype.register_once = function(props, default_value, days) {
	    this['persistence'].register_once(props, default_value, days);
	};

	/**
	 * Delete a super property stored with the current user.
	 *
	 * @param {String} property The name of the super property to remove
	 */
	MixpanelLib.prototype.unregister = function(property) {
	    this['persistence'].unregister(property);
	};

	MixpanelLib.prototype._register_single = function(prop, value) {
	    var props = {};
	    props[prop] = value;
	    this.register(props);
	};

	/**
	 * Identify a user with a unique ID. All subsequent
	 * actions caused by this user will be tied to this unique ID. This
	 * property is used to track unique visitors. If the method is
	 * never called, then unique visitors will be identified by a UUID
	 * generated the first time they visit the site.
	 *
	 * ### Notes:
	 *
	 * You can call this function to overwrite a previously set
	 * unique ID for the current user. Mixpanel cannot translate
	 * between IDs at this time, so when you change a user's ID
	 * they will appear to be a new user.
	 *
	 * identify() should not be called to link anonymous activity to
	 * subsequent activity when a unique ID is first assigned.
	 * Use alias() when a unique ID is first assigned (registration), and
	 * use identify() to identify the user with that unique ID on an ongoing
	 * basis (e.g., each time a user logs in after registering).
	 * Do not call identify() at the same time as alias().
	 *
	 * @param {String} [unique_id] A string that uniquely identifies a user. If not provided, the distinct_id currently in the persistent store (cookie or localStorage) will be used.
	 */
	MixpanelLib.prototype.identify = function(unique_id, _set_callback, _add_callback, _append_callback, _set_once_callback, _union_callback) {
	    // Optional Parameters
	    //  _set_callback:function  A callback to be run if and when the People set queue is flushed
	    //  _add_callback:function  A callback to be run if and when the People add queue is flushed
	    //  _append_callback:function  A callback to be run if and when the People append queue is flushed
	    //  _set_once_callback:function  A callback to be run if and when the People set_once queue is flushed
	    //  _union_callback:function  A callback to be run if and when the People union queue is flushed

	    // identify only changes the distinct id if it doesn't match either the existing or the alias;
	    // if it's new, blow away the alias as well.
	    if (unique_id !== this.get_distinct_id() && unique_id !== this.get_property(ALIAS_ID_KEY)) {
	        this.unregister(ALIAS_ID_KEY);
	        this._register_single('distinct_id', unique_id);
	    }
	    this._check_and_handle_notifications(this.get_distinct_id());
	    this._flags.identify_called = true;
	    // Flush any queued up people requests
	    this['people']._flush(_set_callback, _add_callback, _append_callback, _set_once_callback, _union_callback);
	};

	/**
	 * Clears super properties and generates a new random distinct_id for this instance.
	 * Useful for clearing data when a user logs out.
	 */
	MixpanelLib.prototype.reset = function() {
	    this['persistence'].clear();
	    this._flags.identify_called = false;
	    this.register_once({'distinct_id': _.UUID()}, '');
	};

	/**
	 * Returns the current distinct id of the user. This is either the id automatically
	 * generated by the library or the id that has been passed by a call to identify().
	 *
	 * ### Notes:
	 *
	 * get_distinct_id() can only be called after the Mixpanel library has finished loading.
	 * init() has a loaded function available to handle this automatically. For example:
	 *
	 *     // set distinct_id after the mixpanel library has loaded
	 *     mixpanel.init('YOUR PROJECT TOKEN', {
	 *         loaded: function(mixpanel) {
	 *             distinct_id = mixpanel.get_distinct_id();
	 *         }
	 *     });
	 */
	MixpanelLib.prototype.get_distinct_id = function() {
	    return this.get_property('distinct_id');
	};

	/**
	 * Create an alias, which Mixpanel will use to link two distinct_ids going forward (not retroactively).
	 * Multiple aliases can map to the same original ID, but not vice-versa. Aliases can also be chained - the
	 * following is a valid scenario:
	 *
	 *     mixpanel.alias('new_id', 'existing_id');
	 *     ...
	 *     mixpanel.alias('newer_id', 'new_id');
	 *
	 * If the original ID is not passed in, we will use the current distinct_id - probably the auto-generated GUID.
	 *
	 * ### Notes:
	 *
	 * The best practice is to call alias() when a unique ID is first created for a user
	 * (e.g., when a user first registers for an account and provides an email address).
	 * alias() should never be called more than once for a given user, except to
	 * chain a newer ID to a previously new ID, as described above.
	 *
	 * @param {String} alias A unique identifier that you want to use for this user in the future.
	 * @param {String} [original] The current identifier being used for this user.
	 */
	MixpanelLib.prototype.alias = function(alias, original) {
	    // If the $people_distinct_id key exists in persistence, there has been a previous
	    // mixpanel.people.identify() call made for this user. It is VERY BAD to make an alias with
	    // this ID, as it will duplicate users.
	    if (alias === this.get_property(PEOPLE_DISTINCT_ID_KEY)) {
	        console$1.critical('Attempting to create alias for existing People user - aborting.');
	        return -2;
	    }

	    var _this = this;
	    if (_.isUndefined(original)) {
	        original = this.get_distinct_id();
	    }
	    if (alias !== original) {
	        this._register_single(ALIAS_ID_KEY, alias);
	        return this.track('$create_alias', { 'alias': alias, 'distinct_id': original }, function() {
	            // Flush the people queue
	            _this.identify(alias);
	        });
	    } else {
	        console$1.error('alias matches current distinct_id - skipping api call.');
	        this.identify(alias);
	        return -1;
	    }
	};

	/**
	 * Provide a string to recognize the user by. The string passed to
	 * this method will appear in the Mixpanel Streams product rather
	 * than an automatically generated name. Name tags do not have to
	 * be unique.
	 *
	 * This value will only be included in Streams data.
	 *
	 * @param {String} name_tag A human readable name for the user
	 * @api private
	 */
	MixpanelLib.prototype.name_tag = function(name_tag) {
	    this._register_single('mp_name_tag', name_tag);
	};

	/**
	 * Update the configuration of a mixpanel library instance.
	 *
	 * The default config is:
	 *
	 *     {
	 *       // super properties cookie expiration (in days)
	 *       cookie_expiration:          365
	 *
	 *       // super properties span subdomains
	 *       cross_subdomain_cookie:     true
	 *
	 *       // if this is true, the mixpanel cookie or localStorage entry
	 *       // will be deleted, and no user persistence will take place
	 *       disable_persistence:        false
	 *
	 *       // type of persistent store for super properties (cookie/
	 *       // localStorage) if set to 'localStorage', any existing
	 *       // mixpanel cookie value with the same persistence_name
	 *       // will be transferred to localStorage and deleted
	 *       persistence:                'cookie'
	 *
	 *       // name for super properties persistent store
	 *       persistence_name:           ''
	 *
	 *       // names of properties/superproperties which should never
	 *       // be sent with track() calls
	 *       property_blacklist:         []
	 *
	 *       // if this is true, mixpanel cookies will be marked as
	 *       // secure, meaning they will only be transmitted over https
	 *       secure_cookie:              false
	 *
	 *       // the amount of time track_links will
	 *       // wait for Mixpanel's servers to respond
	 *       track_links_timeout:        300
	 *
	 *       // should we track a page view on page load
	 *       track_pageview:             true
	 *
	 *       // if you set upgrade to be true, the library will check for
	 *       // a cookie from our old js library and import super
	 *       // properties from it, then the old cookie is deleted
	 *       // The upgrade config option only works in the initialization,
	 *       // so make sure you set it when you create the library.
	 *       upgrade:                    false
	 *     }
	 *
	 *
	 * @param {Object} config A dictionary of new configuration values to update
	 */
	MixpanelLib.prototype.set_config = function(config) {
	    if (_.isObject(config)) {
	        _.extend(this['config'], config);

	        if (!this.get_config('persistence_name')) {
	            this['config']['persistence_name'] = this['config']['cookie_name'];
	        }
	        if (!this.get_config('disable_persistence')) {
	            this['config']['disable_persistence'] = this['config']['disable_cookie'];
	        }

	        if (this['persistence']) {
	            this['persistence'].update_config(this['config']);
	        }
	        Config.DEBUG = Config.DEBUG || this.get_config('debug');
	    }
	};

	/**
	 * returns the current config object for the library.
	 */
	MixpanelLib.prototype.get_config = function(prop_name) {
	    return this['config'][prop_name];
	};

	/**
	 * Returns the value of the super property named property_name. If no such
	 * property is set, get_property() will return the undefined value.
	 *
	 * ### Notes:
	 *
	 * get_property() can only be called after the Mixpanel library has finished loading.
	 * init() has a loaded function available to handle this automatically. For example:
	 *
	 *     // grab value for 'user_id' after the mixpanel library has loaded
	 *     mixpanel.init('YOUR PROJECT TOKEN', {
	 *         loaded: function(mixpanel) {
	 *             user_id = mixpanel.get_property('user_id');
	 *         }
	 *     });
	 *
	 * @param {String} property_name The name of the super property you want to retrieve
	 */
	MixpanelLib.prototype.get_property = function(property_name) {
	    return this['persistence']['props'][property_name];
	};

	MixpanelLib.prototype.toString = function() {
	    var name = this.get_config('name');
	    if (name !== PRIMARY_INSTANCE_NAME) {
	        name = PRIMARY_INSTANCE_NAME + '.' + name;
	    }
	    return name;
	};

	MixpanelLib.prototype._event_is_disabled = function(event_name) {
	    return _.isBlockedUA(userAgent) ||
	        this._flags.disable_all_events ||
	        _.include(this.__disabled_events, event_name);
	};

	MixpanelLib.prototype._check_and_handle_notifications = function(distinct_id) {
	    if (!distinct_id || this._flags.identify_called || this.get_config('disable_notifications')) {
	        return;
	    }

	    console$1.log('MIXPANEL NOTIFICATION CHECK');

	    var data = {
	        'verbose':     true,
	        'version':     '1',
	        'lib':         'web',
	        'token':       this.get_config('token'),
	        'distinct_id': distinct_id
	    };
	    var self = this;
	    this._send_request(
	        this.get_config('decide_host') + '/decide/',
	        data,
	        this._prepare_callback(function(r) {
	            if (r['notifications'] && r['notifications'].length > 0) {
	                self._show_notification.call(self, r['notifications'][0]);
	            }
	        })
	    );
	};

	MixpanelLib.prototype._show_notification = function(notification_data) {
	    var notification = new MPNotif(notification_data, this);
	    notification.show();
	};

	MixpanelPeople.prototype._init = function(mixpanel_instance) {
	    this._mixpanel = mixpanel_instance;
	};

	/*
	 * Set properties on a user record.
	 *
	 * ### Usage:
	 *
	 *     mixpanel.people.set('gender', 'm');
	 *
	 *     // or set multiple properties at once
	 *     mixpanel.people.set({
	 *         'Company': 'Acme',
	 *         'Plan': 'Premium',
	 *         'Upgrade date': new Date()
	 *     });
	 *     // properties can be strings, integers, dates, or lists
	 *
	 * @param {Object|String} prop If a string, this is the name of the property. If an object, this is an associative array of names and values.
	 * @param {*} [to] A value to set on the given property name
	 * @param {Function} [callback] If provided, the callback will be called after the tracking event
	 */
	MixpanelPeople.prototype.set = function(prop, to, callback) {
	    var data = {};
	    var $set = {};
	    if (_.isObject(prop)) {
	        _.each(prop, function(v, k) {
	            if (!this._is_reserved_property(k)) {
	                $set[k] = v;
	            }
	        }, this);
	        callback = to;
	    } else {
	        $set[prop] = to;
	    }

	    // make sure that the referrer info has been updated and saved
	    if (this._get_config('save_referrer')) {
	        this._mixpanel['persistence'].update_referrer_info(document.referrer);
	    }

	    // update $set object with default people properties
	    $set = _.extend(
	        {},
	        _.info.people_properties(),
	        this._mixpanel['persistence'].get_referrer_info(),
	        $set
	    );

	    data[SET_ACTION] = $set;

	    return this._send_request(data, callback);
	};

	/*
	 * Set properties on a user record, only if they do not yet exist.
	 * This will not overwrite previous people property values, unlike
	 * people.set().
	 *
	 * ### Usage:
	 *
	 *     mixpanel.people.set_once('First Login Date', new Date());
	 *
	 *     // or set multiple properties at once
	 *     mixpanel.people.set_once({
	 *         'First Login Date': new Date(),
	 *         'Starting Plan': 'Premium'
	 *     });
	 *
	 *     // properties can be strings, integers or dates
	 *
	 * @param {Object|String} prop If a string, this is the name of the property. If an object, this is an associative array of names and values.
	 * @param {*} [to] A value to set on the given property name
	 * @param {Function} [callback] If provided, the callback will be called after the tracking event
	 */
	MixpanelPeople.prototype.set_once = function(prop, to, callback) {
	    var data = {};
	    var $set_once = {};
	    if (_.isObject(prop)) {
	        _.each(prop, function(v, k) {
	            if (!this._is_reserved_property(k)) {
	                $set_once[k] = v;
	            }
	        }, this);
	        callback = to;
	    } else {
	        $set_once[prop] = to;
	    }
	    data[SET_ONCE_ACTION] = $set_once;
	    return this._send_request(data, callback);
	};

	/*
	 * Increment/decrement numeric people analytics properties.
	 *
	 * ### Usage:
	 *
	 *     mixpanel.people.increment('page_views', 1);
	 *
	 *     // or, for convenience, if you're just incrementing a counter by
	 *     // 1, you can simply do
	 *     mixpanel.people.increment('page_views');
	 *
	 *     // to decrement a counter, pass a negative number
	 *     mixpanel.people.increment('credits_left', -1);
	 *
	 *     // like mixpanel.people.set(), you can increment multiple
	 *     // properties at once:
	 *     mixpanel.people.increment({
	 *         counter1: 1,
	 *         counter2: 6
	 *     });
	 *
	 * @param {Object|String} prop If a string, this is the name of the property. If an object, this is an associative array of names and numeric values.
	 * @param {Number} [by] An amount to increment the given property
	 * @param {Function} [callback] If provided, the callback will be called after the tracking event
	 */
	MixpanelPeople.prototype.increment = function(prop, by, callback) {
	    var data = {};
	    var $add = {};
	    if (_.isObject(prop)) {
	        _.each(prop, function(v, k) {
	            if (!this._is_reserved_property(k)) {
	                if (isNaN(parseFloat(v))) {
	                    console$1.error('Invalid increment value passed to mixpanel.people.increment - must be a number');
	                    return;
	                } else {
	                    $add[k] = v;
	                }
	            }
	        }, this);
	        callback = by;
	    } else {
	        // convenience: mixpanel.people.increment('property'); will
	        // increment 'property' by 1
	        if (_.isUndefined(by)) {
	            by = 1;
	        }
	        $add[prop] = by;
	    }
	    data[ADD_ACTION] = $add;

	    return this._send_request(data, callback);
	};

	/*
	 * Append a value to a list-valued people analytics property.
	 *
	 * ### Usage:
	 *
	 *     // append a value to a list, creating it if needed
	 *     mixpanel.people.append('pages_visited', 'homepage');
	 *
	 *     // like mixpanel.people.set(), you can append multiple
	 *     // properties at once:
	 *     mixpanel.people.append({
	 *         list1: 'bob',
	 *         list2: 123
	 *     });
	 *
	 * @param {Object|String} prop If a string, this is the name of the property. If an object, this is an associative array of names and values.
	 * @param {*} [value] An item to append to the list
	 * @param {Function} [callback] If provided, the callback will be called after the tracking event
	 */
	MixpanelPeople.prototype.append = function(list_name, value, callback) {
	    var data = {};
	    var $append = {};
	    if (_.isObject(list_name)) {
	        _.each(list_name, function(v, k) {
	            if (!this._is_reserved_property(k)) {
	                $append[k] = v;
	            }
	        }, this);
	        callback = value;
	    } else {
	        $append[list_name] = value;
	    }
	    data[APPEND_ACTION] = $append;

	    return this._send_request(data, callback);
	};

	/*
	 * Merge a given list with a list-valued people analytics property,
	 * excluding duplicate values.
	 *
	 * ### Usage:
	 *
	 *     // merge a value to a list, creating it if needed
	 *     mixpanel.people.union('pages_visited', 'homepage');
	 *
	 *     // like mixpanel.people.set(), you can append multiple
	 *     // properties at once:
	 *     mixpanel.people.union({
	 *         list1: 'bob',
	 *         list2: 123
	 *     });
	 *
	 *     // like mixpanel.people.append(), you can append multiple
	 *     // values to the same list:
	 *     mixpanel.people.union({
	 *         list1: ['bob', 'billy']
	 *     });
	 *
	 * @param {Object|String} prop If a string, this is the name of the property. If an object, this is an associative array of names and values.
	 * @param {*} [value] Value / values to merge with the given property
	 * @param {Function} [callback] If provided, the callback will be called after the tracking event
	 */
	MixpanelPeople.prototype.union = function(list_name, values, callback) {
	    var data = {};
	    var $union = {};
	    if (_.isObject(list_name)) {
	        _.each(list_name, function(v, k) {
	            if (!this._is_reserved_property(k)) {
	                $union[k] = _.isArray(v) ? v : [v];
	            }
	        }, this);
	        callback = values;
	    } else {
	        $union[list_name] = _.isArray(values) ? values : [values];
	    }
	    data[UNION_ACTION] = $union;

	    return this._send_request(data, callback);
	};

	/*
	 * Record that you have charged the current user a certain amount
	 * of money. Charges recorded with track_charge() will appear in the
	 * Mixpanel revenue report.
	 *
	 * ### Usage:
	 *
	 *     // charge a user $50
	 *     mixpanel.people.track_charge(50);
	 *
	 *     // charge a user $30.50 on the 2nd of january
	 *     mixpanel.people.track_charge(30.50, {
	 *         '$time': new Date('jan 1 2012')
	 *     });
	 *
	 * @param {Number} amount The amount of money charged to the current user
	 * @param {Object} [properties] An associative array of properties associated with the charge
	 * @param {Function} [callback] If provided, the callback will be called when the server responds
	 */
	MixpanelPeople.prototype.track_charge = function(amount, properties, callback) {
	    if (!_.isNumber(amount)) {
	        amount = parseFloat(amount);
	        if (isNaN(amount)) {
	            console$1.error('Invalid value passed to mixpanel.people.track_charge - must be a number');
	            return;
	        }
	    }

	    return this.append('$transactions', _.extend({
	        '$amount': amount
	    }, properties), callback);
	};

	/*
	 * Permanently clear all revenue report transactions from the
	 * current user's people analytics profile.
	 *
	 * ### Usage:
	 *
	 *     mixpanel.people.clear_charges();
	 *
	 * @param {Function} [callback] If provided, the callback will be called after the tracking event
	 */
	MixpanelPeople.prototype.clear_charges = function(callback) {
	    return this.set('$transactions', [], callback);
	};

	/*
	 * Permanently deletes the current people analytics profile from
	 * Mixpanel (using the current distinct_id).
	 *
	 * ### Usage:
	 *
	 *     // remove the all data you have stored about the current user
	 *     mixpanel.people.delete_user();
	 *
	 */
	MixpanelPeople.prototype.delete_user = function() {
	    if (!this._identify_called()) {
	        console$1.error('mixpanel.people.delete_user() requires you to call identify() first');
	        return;
	    }
	    var data = {'$delete': this._mixpanel.get_distinct_id()};
	    return this._send_request(data);
	};

	MixpanelPeople.prototype.toString = function() {
	    return this._mixpanel.toString() + '.people';
	};

	MixpanelPeople.prototype._send_request = function(data, callback) {
	    data['$token'] = this._get_config('token');
	    data['$distinct_id'] = this._mixpanel.get_distinct_id();

	    var date_encoded_data = _.encodeDates(data);
	    var truncated_data    = _.truncate(date_encoded_data, 255);
	    var json_data         = _.JSONEncode(date_encoded_data);
	    var encoded_data      = _.base64Encode(json_data);

	    if (!this._identify_called()) {
	        this._enqueue(data);
	        if (!_.isUndefined(callback)) {
	            if (this._get_config('verbose')) {
	                callback({status: -1, error: null});
	            } else {
	                callback(-1);
	            }
	        }
	        return truncated_data;
	    }

	    console$1.log('MIXPANEL PEOPLE REQUEST:');
	    console$1.log(truncated_data);

	    this._mixpanel._send_request(
	        this._get_config('api_host') + '/engage/',
	        {'data': encoded_data},
	        this._mixpanel._prepare_callback(callback, truncated_data)
	    );

	    return truncated_data;
	};

	MixpanelPeople.prototype._get_config = function(conf_var) {
	    return this._mixpanel.get_config(conf_var);
	};

	MixpanelPeople.prototype._identify_called = function() {
	    return this._mixpanel._flags.identify_called === true;
	};

	// Queue up engage operations if identify hasn't been called yet.
	MixpanelPeople.prototype._enqueue = function(data) {
	    if (SET_ACTION in data) {
	        this._mixpanel['persistence']._add_to_people_queue(SET_ACTION, data);
	    } else if (SET_ONCE_ACTION in data) {
	        this._mixpanel['persistence']._add_to_people_queue(SET_ONCE_ACTION, data);
	    } else if (ADD_ACTION in data) {
	        this._mixpanel['persistence']._add_to_people_queue(ADD_ACTION, data);
	    } else if (APPEND_ACTION in data) {
	        this._mixpanel['persistence']._add_to_people_queue(APPEND_ACTION, data);
	    } else if (UNION_ACTION in data) {
	        this._mixpanel['persistence']._add_to_people_queue(UNION_ACTION, data);
	    } else {
	        console$1.error('Invalid call to _enqueue():', data);
	    }
	};

	// Flush queued engage operations - order does not matter,
	// and there are network level race conditions anyway
	MixpanelPeople.prototype._flush = function(_set_callback, _add_callback, _append_callback, _set_once_callback, _union_callback) {
	    var _this = this;
	    var $set_queue = _.extend({}, this._mixpanel['persistence']._get_queue(SET_ACTION));
	    var $set_once_queue = _.extend({}, this._mixpanel['persistence']._get_queue(SET_ONCE_ACTION));
	    var $add_queue = _.extend({}, this._mixpanel['persistence']._get_queue(ADD_ACTION));
	    var $append_queue = this._mixpanel['persistence']._get_queue(APPEND_ACTION);
	    var $union_queue = _.extend({}, this._mixpanel['persistence']._get_queue(UNION_ACTION));

	    if (!_.isUndefined($set_queue) && _.isObject($set_queue) && !_.isEmptyObject($set_queue)) {
	        _this._mixpanel['persistence']._pop_from_people_queue(SET_ACTION, $set_queue);
	        this.set($set_queue, function(response, data) {
	            // on bad response, we want to add it back to the queue
	            if (response === 0) {
	                _this._mixpanel['persistence']._add_to_people_queue(SET_ACTION, $set_queue);
	            }
	            if (!_.isUndefined(_set_callback)) {
	                _set_callback(response, data);
	            }
	        });
	    }

	    if (!_.isUndefined($set_once_queue) && _.isObject($set_once_queue) && !_.isEmptyObject($set_once_queue)) {
	        _this._mixpanel['persistence']._pop_from_people_queue(SET_ONCE_ACTION, $set_once_queue);
	        this.set_once($set_once_queue, function(response, data) {
	            // on bad response, we want to add it back to the queue
	            if (response === 0) {
	                _this._mixpanel['persistence']._add_to_people_queue(SET_ONCE_ACTION, $set_once_queue);
	            }
	            if (!_.isUndefined(_set_once_callback)) {
	                _set_once_callback(response, data);
	            }
	        });
	    }

	    if (!_.isUndefined($add_queue) && _.isObject($add_queue) && !_.isEmptyObject($add_queue)) {
	        _this._mixpanel['persistence']._pop_from_people_queue(ADD_ACTION, $add_queue);
	        this.increment($add_queue, function(response, data) {
	            // on bad response, we want to add it back to the queue
	            if (response === 0) {
	                _this._mixpanel['persistence']._add_to_people_queue(ADD_ACTION, $add_queue);
	            }
	            if (!_.isUndefined(_add_callback)) {
	                _add_callback(response, data);
	            }
	        });
	    }

	    if (!_.isUndefined($union_queue) && _.isObject($union_queue) && !_.isEmptyObject($union_queue)) {
	        _this._mixpanel['persistence']._pop_from_people_queue(UNION_ACTION, $union_queue);
	        this.union($union_queue, function(response, data) {
	            // on bad response, we want to add it back to the queue
	            if (response === 0) {
	                _this._mixpanel['persistence']._add_to_people_queue(UNION_ACTION, $union_queue);
	            }
	            if (!_.isUndefined(_union_callback)) {
	                _union_callback(response, data);
	            }
	        });
	    }

	    // we have to fire off each $append individually since there is
	    // no concat method server side
	    if (!_.isUndefined($append_queue) && _.isArray($append_queue) && $append_queue.length) {
	        var $append_item;
	        var callback = function(response, data) {
	            if (response === 0) {
	                _this._mixpanel['persistence']._add_to_people_queue(APPEND_ACTION, $append_item);
	            }
	            if (!_.isUndefined(_append_callback)) {
	                _append_callback(response, data);
	            }
	        };
	        for (var i = $append_queue.length - 1; i >= 0; i--) {
	            $append_item = $append_queue.pop();
	            _this.append($append_item, callback);
	        }
	        // Save the shortened append queue
	        _this._mixpanel['persistence'].save();
	    }
	};

	MixpanelPeople.prototype._is_reserved_property = function(prop) {
	    return prop === '$distinct_id' || prop === '$token';
	};


	// Internal class for notification display
	MixpanelLib._Notification = function(notif_data, mixpanel_instance) {
	    _.bind_instance_methods(this);

	    this.mixpanel    = mixpanel_instance;
	    this.persistence = this.mixpanel['persistence'];

	    this.campaign_id = _.escapeHTML(notif_data['id']);
	    this.message_id  = _.escapeHTML(notif_data['message_id']);

	    this.body            = (_.escapeHTML(notif_data['body']) || '').replace(/\n/g, '<br/>');
	    this.cta             = _.escapeHTML(notif_data['cta']) || 'Close';
	    this.dest_url        = _.escapeHTML(notif_data['cta_url']) || null;
	    this.image_url       = _.escapeHTML(notif_data['image_url']) || null;
	    this.notif_type      = _.escapeHTML(notif_data['type']) || 'takeover';
	    this.style           = _.escapeHTML(notif_data['style']) || 'light';
	    this.thumb_image_url = _.escapeHTML(notif_data['thumb_image_url']) || null;
	    this.title           = _.escapeHTML(notif_data['title']) || '';
	    this.video_url       = _.escapeHTML(notif_data['video_url']) || null;
	    this.video_width     = MPNotif.VIDEO_WIDTH;
	    this.video_height    = MPNotif.VIDEO_HEIGHT;

	    this.clickthrough = true;
	    if (!this.dest_url) {
	        this.dest_url = '#dismiss';
	        this.clickthrough = false;
	    }

	    this.mini = this.notif_type === 'mini';
	    if (!this.mini) {
	        this.notif_type = 'takeover';
	    }
	    this.notif_width = !this.mini ? MPNotif.NOTIF_WIDTH : MPNotif.NOTIF_WIDTH_MINI;

	    this._set_client_config();
	    this.imgs_to_preload = this._init_image_html();
	    this._init_video();
	};

	MPNotif = MixpanelLib._Notification;

	MPNotif.ANIM_TIME         = 200;
	MPNotif.MARKUP_PREFIX     = 'mixpanel-notification';
	MPNotif.BG_OPACITY        = 0.6;
	MPNotif.NOTIF_TOP         = 25;
	MPNotif.NOTIF_START_TOP   = 200;
	MPNotif.NOTIF_WIDTH       = 388;
	MPNotif.NOTIF_WIDTH_MINI  = 420;
	MPNotif.NOTIF_HEIGHT_MINI = 85;
	MPNotif.THUMB_BORDER_SIZE = 5;
	MPNotif.THUMB_IMG_SIZE    = 60;
	MPNotif.THUMB_OFFSET      = Math.round(MPNotif.THUMB_IMG_SIZE / 2);
	MPNotif.VIDEO_WIDTH       = 595;
	MPNotif.VIDEO_HEIGHT      = 334;

	MPNotif.prototype.show = function() {
	    var self = this;
	    this._set_client_config();

	    // don't display until HTML body exists
	    if (!this.body_el) {
	        setTimeout(function() { self.show(); }, 300);
	        return;
	    }

	    this._init_styles();
	    this._init_notification_el();

	    // wait for any images to load before showing notification
	    this._preload_images(this._attach_and_animate);
	};

	MPNotif.prototype.dismiss = _.safewrap(function() {
	    if (!this.marked_as_shown) {
	        // unexpected condition: user interacted with notif even though we didn't consider it
	        // visible (see _mark_as_shown()); send tracking signals to mark delivery
	        this._mark_delivery({'invisible': true});
	    }

	    var exiting_el = this.showing_video ? this._get_el('video') : this._get_notification_display_el();
	    if (this.use_transitions) {
	        this._remove_class('bg', 'visible');
	        this._add_class(exiting_el, 'exiting');
	        setTimeout(this._remove_notification_el, MPNotif.ANIM_TIME);
	    } else {
	        var notif_attr, notif_start, notif_goal;
	        if (this.mini) {
	            notif_attr  = 'right';
	            notif_start = 20;
	            notif_goal  = -100;
	        } else {
	            notif_attr  = 'top';
	            notif_start = MPNotif.NOTIF_TOP;
	            notif_goal  = MPNotif.NOTIF_START_TOP + MPNotif.NOTIF_TOP;
	        }
	        this._animate_els([
	            {
	                el:    this._get_el('bg'),
	                attr:  'opacity',
	                start: MPNotif.BG_OPACITY,
	                goal:  0.0
	            },
	            {
	                el:    exiting_el,
	                attr:  'opacity',
	                start: 1.0,
	                goal:  0.0
	            },
	            {
	                el:    exiting_el,
	                attr:  notif_attr,
	                start: notif_start,
	                goal:  notif_goal
	            }
	        ], MPNotif.ANIM_TIME, this._remove_notification_el);
	    }
	});

	MPNotif.prototype._add_class = _.safewrap(function(el, class_name) {
	    class_name = MPNotif.MARKUP_PREFIX + '-' + class_name;
	    if (typeof el === 'string') {
	        el = this._get_el(el);
	    }
	    if (!el.className) {
	        el.className = class_name;
	    } else if (!~(' ' + el.className + ' ').indexOf(' ' + class_name + ' ')) {
	        el.className += ' ' + class_name;
	    }
	});
	MPNotif.prototype._remove_class = _.safewrap(function(el, class_name) {
	    class_name = MPNotif.MARKUP_PREFIX + '-' + class_name;
	    if (typeof el === 'string') {
	        el = this._get_el(el);
	    }
	    if (el.className) {
	        el.className = (' ' + el.className + ' ')
	                .replace(' ' + class_name + ' ', '')
	                .replace(/^[\s\xA0]+/, '')
	                .replace(/[\s\xA0]+$/, '');
	    }
	});

	MPNotif.prototype._animate_els = _.safewrap(function(anims, mss, done_cb, start_time) {
	    var self = this,
	        in_progress = false,
	        ai, anim,
	        cur_time = 1 * new Date(), time_diff;

	    start_time = start_time || cur_time;
	    time_diff = cur_time - start_time;

	    for (ai = 0; ai < anims.length; ai++) {
	        anim = anims[ai];
	        if (typeof anim.val === 'undefined') {
	            anim.val = anim.start;
	        }
	        if (anim.val !== anim.goal) {
	            in_progress = true;
	            var anim_diff = anim.goal - anim.start,
	                anim_dir = anim.goal >= anim.start ? 1 : -1;
	            anim.val = anim.start + anim_diff * time_diff / mss;
	            if (anim.attr !== 'opacity') {
	                anim.val = Math.round(anim.val);
	            }
	            if ((anim_dir > 0 && anim.val >= anim.goal) || (anim_dir < 0 && anim.val <= anim.goal)) {
	                anim.val = anim.goal;
	            }
	        }
	    }
	    if (!in_progress) {
	        if (done_cb) {
	            done_cb();
	        }
	        return;
	    }

	    for (ai = 0; ai < anims.length; ai++) {
	        anim = anims[ai];
	        if (anim.el) {
	            var suffix = anim.attr === 'opacity' ? '' : 'px';
	            anim.el.style[anim.attr] = String(anim.val) + suffix;
	        }
	    }
	    setTimeout(function() { self._animate_els(anims, mss, done_cb, start_time); }, 10);
	});

	MPNotif.prototype._attach_and_animate = _.safewrap(function() {
	    var self = this;

	    // no possibility to double-display
	    if (this.shown || this._get_shown_campaigns()[this.campaign_id]) {
	        return;
	    }
	    this.shown = true;

	    this.body_el.appendChild(this.notification_el);
	    setTimeout(function() {
	        var notif_el = self._get_notification_display_el();
	        if (self.use_transitions) {
	            if (!self.mini) {
	                self._add_class('bg', 'visible');
	            }
	            self._add_class(notif_el, 'visible');
	            self._mark_as_shown();
	        } else {
	            var notif_attr, notif_start, notif_goal;
	            if (self.mini) {
	                notif_attr  = 'right';
	                notif_start = -100;
	                notif_goal  = 20;
	            } else {
	                notif_attr  = 'top';
	                notif_start = MPNotif.NOTIF_START_TOP + MPNotif.NOTIF_TOP;
	                notif_goal  = MPNotif.NOTIF_TOP;
	            }
	            self._animate_els([
	                {
	                    el:    self._get_el('bg'),
	                    attr:  'opacity',
	                    start: 0.0,
	                    goal:  MPNotif.BG_OPACITY
	                },
	                {
	                    el:    notif_el,
	                    attr:  'opacity',
	                    start: 0.0,
	                    goal:  1.0
	                },
	                {
	                    el:    notif_el,
	                    attr:  notif_attr,
	                    start: notif_start,
	                    goal:  notif_goal
	                }
	            ], MPNotif.ANIM_TIME, self._mark_as_shown);
	        }
	    }, 100);
	    _.register_event(self._get_el('cancel'), 'click', function(e) {
	        e.preventDefault();
	        self.dismiss();
	    });
	    var click_el = self._get_el('button') ||
	                       self._get_el('mini-content');
	    _.register_event(click_el, 'click', function(e) {
	        e.preventDefault();
	        if (self.show_video) {
	            self._track_event('$campaign_open', {'$resource_type': 'video'});
	            self._switch_to_video();
	        } else {
	            self.dismiss();
	            if (self.clickthrough) {
	                self._track_event('$campaign_open', {'$resource_type': 'link'}, function() {
	                    window.location.href = self.dest_url;
	                });
	            }
	        }
	    });
	});

	MPNotif.prototype._get_el = function(id) {
	    return document.getElementById(MPNotif.MARKUP_PREFIX + '-' + id);
	};

	MPNotif.prototype._get_notification_display_el = function() {
	    return this._get_el(this.notif_type);
	};

	MPNotif.prototype._get_shown_campaigns = function() {
	    return this.persistence['props'][CAMPAIGN_IDS_KEY] || (this.persistence['props'][CAMPAIGN_IDS_KEY] = {});
	};

	MPNotif.prototype._browser_lte = function(browser, version) {
	    return this.browser_versions[browser] && this.browser_versions[browser] <= version;
	};

	MPNotif.prototype._init_image_html = function() {
	    var imgs_to_preload = [];

	    if (!this.mini) {
	        if (this.image_url) {
	            imgs_to_preload.push(this.image_url);
	            this.img_html = '<img id="img" src="' + this.image_url + '"/>';
	        } else {
	            this.img_html = '';
	        }
	        if (this.thumb_image_url) {
	            imgs_to_preload.push(this.thumb_image_url);
	            this.thumb_img_html =
	                    '<div id="thumbborder-wrapper"><div id="thumbborder"></div></div>' +
	                    '<img id="thumbnail"' +
	                        ' src="' + this.thumb_image_url + '"' +
	                        ' width="' + MPNotif.THUMB_IMG_SIZE + '"' +
	                        ' height="' + MPNotif.THUMB_IMG_SIZE + '"' +
	                    '/>' +
	                    '<div id="thumbspacer"></div>';
	        } else {
	            this.thumb_img_html = '';
	        }
	    } else {
	        this.thumb_image_url = this.thumb_image_url || '//cdn.mxpnl.com/site_media/images/icons/notifications/mini-news-dark.png';
	        imgs_to_preload.push(this.thumb_image_url);
	    }

	    return imgs_to_preload;
	};

	MPNotif.prototype._init_notification_el = function() {
	    var notification_html = '';
	    var video_src         = '';
	    var video_html        = '';
	    var cancel_html       = '<div id="cancel">' +
	                                    '<div id="cancel-icon"></div>' +
	                                '</div>';

	    this.notification_el = document.createElement('div');
	    this.notification_el.id = MPNotif.MARKUP_PREFIX + '-wrapper';
	    if (!this.mini) {
	        // TAKEOVER notification
	        var close_html  = (this.clickthrough || this.show_video) ? '' : '<div id="button-close"></div>',
	            play_html   = this.show_video ? '<div id="button-play"></div>' : '';
	        if (this._browser_lte('ie', 7)) {
	            close_html = '';
	            play_html = '';
	        }
	        notification_html =
	                '<div id="takeover">' +
	                    this.thumb_img_html +
	                    '<div id="mainbox">' +
	                        cancel_html +
	                        '<div id="content">' +
	                            this.img_html +
	                            '<div id="title">' + this.title + '</div>' +
	                            '<div id="body">' + this.body + '</div>' +
	                            '<div id="tagline">' +
	                                '<a href="http://mixpanel.com?from=inapp" target="_blank">POWERED BY MIXPANEL</a>' +
	                            '</div>' +
	                        '</div>' +
	                        '<div id="button">' +
	                            close_html +
	                            '<a id="button-link" href="' + this.dest_url + '">' + this.cta + '</a>' +
	                            play_html +
	                        '</div>' +
	                    '</div>' +
	                '</div>';
	    } else {
	        // MINI notification
	        notification_html =
	                '<div id="mini">' +
	                    '<div id="mainbox">' +
	                        cancel_html +
	                        '<div id="mini-content">' +
	                            '<div id="mini-icon">' +
	                                '<div id="mini-icon-img"></div>' +
	                            '</div>' +
	                            '<div id="body">' +
	                                '<div id="body-text"><div>' + this.body + '</div></div>' +
	                            '</div>' +
	                        '</div>' +
	                    '</div>' +
	                    '<div id="mini-border"></div>' +
	                '</div>';
	    }
	    if (this.youtube_video) {
	        video_src = '//www.youtube.com/embed/' + this.youtube_video +
	                '?wmode=transparent&showinfo=0&modestbranding=0&rel=0&autoplay=1&loop=0&vq=hd1080';
	        if (this.yt_custom) {
	            video_src += '&enablejsapi=1&html5=1&controls=0';
	            video_html =
	                    '<div id="video-controls">' +
	                        '<div id="video-progress" class="video-progress-el">' +
	                            '<div id="video-progress-total" class="video-progress-el"></div>' +
	                            '<div id="video-elapsed" class="video-progress-el"></div>' +
	                        '</div>' +
	                        '<div id="video-time" class="video-progress-el"></div>' +
	                    '</div>';
	        }
	    } else if (this.vimeo_video) {
	        video_src = '//player.vimeo.com/video/' + this.vimeo_video + '?autoplay=1&title=0&byline=0&portrait=0';
	    }
	    if (this.show_video) {
	        this.video_iframe =
	                '<iframe id="' + MPNotif.MARKUP_PREFIX + '-video-frame" ' +
	                    'width="' + this.video_width + '" height="' + this.video_height + '" ' +
	                    ' src="' + video_src + '"' +
	                    ' frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen="1" scrolling="no"' +
	                '></iframe>';
	        video_html =
	                '<div id="video-' + (this.flip_animate ? '' : 'no') + 'flip">' +
	                    '<div id="video">' +
	                        '<div id="video-holder"></div>' +
	                        video_html +
	                    '</div>' +
	                '</div>';
	    }
	    var main_html = video_html + notification_html;
	    if (this.flip_animate) {
	        main_html =
	                (this.mini ? notification_html : '') +
	                '<div id="flipcontainer"><div id="flipper">' +
	                    (this.mini ? video_html : main_html) +
	                '</div></div>';
	    }

	    this.notification_el.innerHTML =
	            ('<div id="overlay" class="' + this.notif_type + '">' +
	                '<div id="campaignid-' + this.campaign_id + '">' +
	                    '<div id="bgwrapper">' +
	                        '<div id="bg"></div>' +
	                        main_html +
	                    '</div>' +
	                '</div>' +
	            '</div>')
	            .replace(/class=\"/g, 'class="' + MPNotif.MARKUP_PREFIX + '-')
	            .replace(/id=\"/g, 'id="' + MPNotif.MARKUP_PREFIX + '-');
	};

	MPNotif.prototype._init_styles = function() {
	    if (this.style === 'dark') {
	        this.style_vals = {
	            bg:             '#1d1f25',
	            bg_actions:     '#282b32',
	            bg_hover:       '#3a4147',
	            bg_light:       '#4a5157',
	            border_gray:    '#32353c',
	            cancel_opacity: '0.4',
	            mini_hover:     '#2a3137',
	            text_title:     '#fff',
	            text_main:      '#9498a3',
	            text_tagline:   '#464851',
	            text_hover:     '#ddd'
	        };
	    } else {
	        this.style_vals = {
	            bg:             '#fff',
	            bg_actions:     '#e7eaee',
	            bg_hover:       '#eceff3',
	            bg_light:       '#f5f5f5',
	            border_gray:    '#e4ecf2',
	            cancel_opacity: '1.0',
	            mini_hover:     '#fafafa',
	            text_title:     '#5c6578',
	            text_main:      '#8b949b',
	            text_tagline:   '#ced9e6',
	            text_hover:     '#7c8598'
	        };
	    }
	    var shadow = '0px 0px 35px 0px rgba(45, 49, 56, 0.7)',
	        video_shadow = shadow,
	        mini_shadow = shadow,
	        thumb_total_size = MPNotif.THUMB_IMG_SIZE + MPNotif.THUMB_BORDER_SIZE * 2,
	        anim_seconds = (MPNotif.ANIM_TIME / 1000) + 's';
	    if (this.mini) {
	        shadow = 'none';
	    }

	    // don't display on small viewports
	    var notif_media_queries = {},
	        min_width = MPNotif.NOTIF_WIDTH_MINI + 20;
	    notif_media_queries['@media only screen and (max-width: ' + (min_width - 1) + 'px)'] = {
	        '#overlay': {
	            'display': 'none'
	        }
	    };
	    var notif_styles = {
	        '.flipped': {
	            'transform': 'rotateY(180deg)'
	        },
	        '#overlay': {
	            'position': 'fixed',
	            'top': '0',
	            'left': '0',
	            'width': '100%',
	            'height': '100%',
	            'overflow': 'auto',
	            'text-align': 'center',
	            'z-index': '10000',
	            'font-family': '"Helvetica", "Arial", sans-serif',
	            '-webkit-font-smoothing': 'antialiased',
	            '-moz-osx-font-smoothing': 'grayscale'
	        },
	        '#overlay.mini': {
	            'height': '0',
	            'overflow': 'visible'
	        },
	        '#overlay a': {
	            'width': 'initial',
	            'padding': '0',
	            'text-decoration': 'none',
	            'text-transform': 'none',
	            'color': 'inherit'
	        },
	        '#bgwrapper': {
	            'position': 'relative',
	            'width': '100%',
	            'height': '100%'
	        },
	        '#bg': {
	            'position': 'fixed',
	            'top': '0',
	            'left': '0',
	            'width': '100%',
	            'height': '100%',
	            'min-width': this.doc_width * 4 + 'px',
	            'min-height': this.doc_height * 4 + 'px',
	            'background-color': 'black',
	            'opacity': '0.0',
	            '-ms-filter': 'progid:DXImageTransform.Microsoft.Alpha(Opacity=60)', // IE8
	            'filter': 'alpha(opacity=60)', // IE5-7
	            'transition': 'opacity ' + anim_seconds
	        },
	        '#bg.visible': {
	            'opacity': MPNotif.BG_OPACITY
	        },
	        '.mini #bg': {
	            'width': '0',
	            'height': '0',
	            'min-width': '0'
	        },
	        '#flipcontainer': {
	            'perspective': '1000px',
	            'position': 'absolute',
	            'width': '100%'
	        },
	        '#flipper': {
	            'position': 'relative',
	            'transform-style': 'preserve-3d',
	            'transition': '0.3s'
	        },
	        '#takeover': {
	            'position': 'absolute',
	            'left': '50%',
	            'width': MPNotif.NOTIF_WIDTH + 'px',
	            'margin-left': Math.round(-MPNotif.NOTIF_WIDTH / 2) + 'px',
	            'backface-visibility': 'hidden',
	            'transform': 'rotateY(0deg)',
	            'opacity': '0.0',
	            'top': MPNotif.NOTIF_START_TOP + 'px',
	            'transition': 'opacity ' + anim_seconds + ', top ' + anim_seconds
	        },
	        '#takeover.visible': {
	            'opacity': '1.0',
	            'top': MPNotif.NOTIF_TOP + 'px'
	        },
	        '#takeover.exiting': {
	            'opacity': '0.0',
	            'top': MPNotif.NOTIF_START_TOP + 'px'
	        },
	        '#thumbspacer': {
	            'height': MPNotif.THUMB_OFFSET + 'px'
	        },
	        '#thumbborder-wrapper': {
	            'position': 'absolute',
	            'top': (-MPNotif.THUMB_BORDER_SIZE) + 'px',
	            'left': (MPNotif.NOTIF_WIDTH / 2 - MPNotif.THUMB_OFFSET - MPNotif.THUMB_BORDER_SIZE) + 'px',
	            'width': thumb_total_size + 'px',
	            'height': (thumb_total_size / 2) + 'px',
	            'overflow': 'hidden'
	        },
	        '#thumbborder': {
	            'position': 'absolute',
	            'width': thumb_total_size + 'px',
	            'height': thumb_total_size + 'px',
	            'border-radius': thumb_total_size + 'px',
	            'background-color': this.style_vals.bg_actions,
	            'opacity': '0.5'
	        },
	        '#thumbnail': {
	            'position': 'absolute',
	            'top': '0px',
	            'left': (MPNotif.NOTIF_WIDTH / 2 - MPNotif.THUMB_OFFSET) + 'px',
	            'width': MPNotif.THUMB_IMG_SIZE + 'px',
	            'height': MPNotif.THUMB_IMG_SIZE + 'px',
	            'overflow': 'hidden',
	            'z-index': '100',
	            'border-radius': MPNotif.THUMB_IMG_SIZE + 'px'
	        },
	        '#mini': {
	            'position': 'absolute',
	            'right': '20px',
	            'top': MPNotif.NOTIF_TOP + 'px',
	            'width': this.notif_width + 'px',
	            'height': MPNotif.NOTIF_HEIGHT_MINI * 2 + 'px',
	            'margin-top': 20 - MPNotif.NOTIF_HEIGHT_MINI + 'px',
	            'backface-visibility': 'hidden',
	            'opacity': '0.0',
	            'transform': 'rotateX(90deg)',
	            'transition': 'opacity 0.3s, transform 0.3s, right 0.3s'
	        },
	        '#mini.visible': {
	            'opacity': '1.0',
	            'transform': 'rotateX(0deg)'
	        },
	        '#mini.exiting': {
	            'opacity': '0.0',
	            'right': '-150px'
	        },
	        '#mainbox': {
	            'border-radius': '4px',
	            'box-shadow': shadow,
	            'text-align': 'center',
	            'background-color': this.style_vals.bg,
	            'font-size': '14px',
	            'color': this.style_vals.text_main
	        },
	        '#mini #mainbox': {
	            'height': MPNotif.NOTIF_HEIGHT_MINI + 'px',
	            'margin-top': MPNotif.NOTIF_HEIGHT_MINI + 'px',
	            'border-radius': '3px',
	            'transition': 'background-color ' + anim_seconds
	        },
	        '#mini-border': {
	            'height': (MPNotif.NOTIF_HEIGHT_MINI + 6) + 'px',
	            'width': (MPNotif.NOTIF_WIDTH_MINI + 6) + 'px',
	            'position': 'absolute',
	            'top': '-3px',
	            'left': '-3px',
	            'margin-top': MPNotif.NOTIF_HEIGHT_MINI + 'px',
	            'border-radius': '6px',
	            'opacity': '0.25',
	            'background-color': '#fff',
	            'z-index': '-1',
	            'box-shadow': mini_shadow
	        },
	        '#mini-icon': {
	            'position': 'relative',
	            'display': 'inline-block',
	            'width': '75px',
	            'height': MPNotif.NOTIF_HEIGHT_MINI + 'px',
	            'border-radius': '3px 0 0 3px',
	            'background-color': this.style_vals.bg_actions,
	            'background': 'linear-gradient(135deg, ' + this.style_vals.bg_light + ' 0%, ' + this.style_vals.bg_actions + ' 100%)',
	            'transition': 'background-color ' + anim_seconds
	        },
	        '#mini:hover #mini-icon': {
	            'background-color': this.style_vals.mini_hover
	        },
	        '#mini:hover #mainbox': {
	            'background-color': this.style_vals.mini_hover
	        },
	        '#mini-icon-img': {
	            'position': 'absolute',
	            'background-image': 'url(' + this.thumb_image_url + ')',
	            'width': '48px',
	            'height': '48px',
	            'top': '20px',
	            'left': '12px'
	        },
	        '#content': {
	            'padding': '30px 20px 0px 20px'
	        },
	        '#mini-content': {
	            'text-align': 'left',
	            'height': MPNotif.NOTIF_HEIGHT_MINI + 'px',
	            'cursor': 'pointer'
	        },
	        '#img': {
	            'width': '328px',
	            'margin-top': '30px',
	            'border-radius': '5px'
	        },
	        '#title': {
	            'max-height': '600px',
	            'overflow': 'hidden',
	            'word-wrap': 'break-word',
	            'padding': '25px 0px 20px 0px',
	            'font-size': '19px',
	            'font-weight': 'bold',
	            'color': this.style_vals.text_title
	        },
	        '#body': {
	            'max-height': '600px',
	            'margin-bottom': '25px',
	            'overflow': 'hidden',
	            'word-wrap': 'break-word',
	            'line-height': '21px',
	            'font-size': '15px',
	            'font-weight': 'normal',
	            'text-align': 'left'
	        },
	        '#mini #body': {
	            'display': 'inline-block',
	            'max-width': '250px',
	            'margin': '0 0 0 30px',
	            'height': MPNotif.NOTIF_HEIGHT_MINI + 'px',
	            'font-size': '16px',
	            'letter-spacing': '0.8px',
	            'color': this.style_vals.text_title
	        },
	        '#mini #body-text': {
	            'display': 'table',
	            'height': MPNotif.NOTIF_HEIGHT_MINI + 'px'
	        },
	        '#mini #body-text div': {
	            'display': 'table-cell',
	            'vertical-align': 'middle'
	        },
	        '#tagline': {
	            'margin-bottom': '15px',
	            'font-size': '10px',
	            'font-weight': '600',
	            'letter-spacing': '0.8px',
	            'color': '#ccd7e0',
	            'text-align': 'left'
	        },
	        '#tagline a': {
	            'color': this.style_vals.text_tagline,
	            'transition': 'color ' + anim_seconds
	        },
	        '#tagline a:hover': {
	            'color': this.style_vals.text_hover
	        },
	        '#cancel': {
	            'position': 'absolute',
	            'right': '0',
	            'width': '8px',
	            'height': '8px',
	            'padding': '10px',
	            'border-radius': '20px',
	            'margin': '12px 12px 0 0',
	            'box-sizing': 'content-box',
	            'cursor': 'pointer',
	            'transition': 'background-color ' + anim_seconds
	        },
	        '#mini #cancel': {
	            'margin': '7px 7px 0 0'
	        },
	        '#cancel-icon': {
	            'width': '8px',
	            'height': '8px',
	            'overflow': 'hidden',
	            'background-image': 'url(//cdn.mxpnl.com/site_media/images/icons/notifications/cancel-x.png)',
	            'opacity': this.style_vals.cancel_opacity
	        },
	        '#cancel:hover': {
	            'background-color': this.style_vals.bg_hover
	        },
	        '#button': {
	            'display': 'block',
	            'height': '60px',
	            'line-height': '60px',
	            'text-align': 'center',
	            'background-color': this.style_vals.bg_actions,
	            'border-radius': '0 0 4px 4px',
	            'overflow': 'hidden',
	            'cursor': 'pointer',
	            'transition': 'background-color ' + anim_seconds
	        },
	        '#button-close': {
	            'display': 'inline-block',
	            'width': '9px',
	            'height': '60px',
	            'margin-right': '8px',
	            'vertical-align': 'top',
	            'background-image': 'url(//cdn.mxpnl.com/site_media/images/icons/notifications/close-x-' + this.style + '.png)',
	            'background-repeat': 'no-repeat',
	            'background-position': '0px 25px'
	        },
	        '#button-play': {
	            'display': 'inline-block',
	            'width': '30px',
	            'height': '60px',
	            'margin-left': '15px',
	            'background-image': 'url(//cdn.mxpnl.com/site_media/images/icons/notifications/play-' + this.style + '-small.png)',
	            'background-repeat': 'no-repeat',
	            'background-position': '0px 15px'
	        },
	        'a#button-link': {
	            'display': 'inline-block',
	            'vertical-align': 'top',
	            'text-align': 'center',
	            'font-size': '17px',
	            'font-weight': 'bold',
	            'overflow': 'hidden',
	            'word-wrap': 'break-word',
	            'color': this.style_vals.text_title,
	            'transition': 'color ' + anim_seconds
	        },
	        '#button:hover': {
	            'background-color': this.style_vals.bg_hover,
	            'color': this.style_vals.text_hover
	        },
	        '#button:hover a': {
	            'color': this.style_vals.text_hover
	        },

	        '#video-noflip': {
	            'position': 'relative',
	            'top': (-this.video_height * 2) + 'px'
	        },
	        '#video-flip': {
	            'backface-visibility': 'hidden',
	            'transform': 'rotateY(180deg)'
	        },
	        '#video': {
	            'position': 'absolute',
	            'width': (this.video_width - 1) + 'px',
	            'height': this.video_height + 'px',
	            'top': MPNotif.NOTIF_TOP + 'px',
	            'margin-top': '100px',
	            'left': '50%',
	            'margin-left': Math.round(-this.video_width / 2) + 'px',
	            'overflow': 'hidden',
	            'border-radius': '5px',
	            'box-shadow': video_shadow,
	            'transform': 'translateZ(1px)', // webkit rendering bug http://stackoverflow.com/questions/18167981/clickable-link-area-unexpectedly-smaller-after-css-transform
	            'transition': 'opacity ' + anim_seconds + ', top ' + anim_seconds
	        },
	        '#video.exiting': {
	            'opacity': '0.0',
	            'top': this.video_height + 'px'
	        },
	        '#video-holder': {
	            'position': 'absolute',
	            'width': (this.video_width - 1) + 'px',
	            'height': this.video_height + 'px',
	            'overflow': 'hidden',
	            'border-radius': '5px'
	        },
	        '#video-frame': {
	            'margin-left': '-1px',
	            'width': this.video_width + 'px'
	        },
	        '#video-controls': {
	            'opacity': '0',
	            'transition': 'opacity 0.5s'
	        },
	        '#video:hover #video-controls': {
	            'opacity': '1.0'
	        },
	        '#video .video-progress-el': {
	            'position': 'absolute',
	            'bottom': '0',
	            'height': '25px',
	            'border-radius': '0 0 0 5px'
	        },
	        '#video-progress': {
	            'width': '90%'
	        },
	        '#video-progress-total': {
	            'width': '100%',
	            'background-color': this.style_vals.bg,
	            'opacity': '0.7'
	        },
	        '#video-elapsed': {
	            'width': '0',
	            'background-color': '#6cb6f5',
	            'opacity': '0.9'
	        },
	        '#video #video-time': {
	            'width': '10%',
	            'right': '0',
	            'font-size': '11px',
	            'line-height': '25px',
	            'color': this.style_vals.text_main,
	            'background-color': '#666',
	            'border-radius': '0 0 5px 0'
	        }
	    };

	    // IE hacks
	    if (this._browser_lte('ie', 8)) {
	        _.extend(notif_styles, {
	            '* html #overlay': {
	                'position': 'absolute'
	            },
	            '* html #bg': {
	                'position': 'absolute'
	            },
	            'html, body': {
	                'height': '100%'
	            }
	        });
	    }
	    if (this._browser_lte('ie', 7)) {
	        _.extend(notif_styles, {
	            '#mini #body': {
	                'display': 'inline',
	                'zoom': '1',
	                'border': '1px solid ' + this.style_vals.bg_hover
	            },
	            '#mini #body-text': {
	                'padding': '20px'
	            },
	            '#mini #mini-icon': {
	                'display': 'none'
	            }
	        });
	    }

	    // add vendor-prefixed style rules
	    var VENDOR_STYLES   = ['backface-visibility', 'border-radius', 'box-shadow', 'opacity',
	                               'perspective', 'transform', 'transform-style', 'transition'],
	        VENDOR_PREFIXES = ['khtml', 'moz', 'ms', 'o', 'webkit'];
	    for (var selector in notif_styles) {
	        for (var si = 0; si < VENDOR_STYLES.length; si++) {
	            var prop = VENDOR_STYLES[si];
	            if (prop in notif_styles[selector]) {
	                var val = notif_styles[selector][prop];
	                for (var pi = 0; pi < VENDOR_PREFIXES.length; pi++) {
	                    notif_styles[selector]['-' + VENDOR_PREFIXES[pi] + '-' + prop] = val;
	                }
	            }
	        }
	    }

	    var inject_styles = function(styles, media_queries) {
	        var create_style_text = function(style_defs) {
	            var st = '';
	            for (var selector in style_defs) {
	                var mp_selector = selector
	                        .replace(/#/g, '#' + MPNotif.MARKUP_PREFIX + '-')
	                        .replace(/\./g, '.' + MPNotif.MARKUP_PREFIX + '-');
	                st += '\n' + mp_selector + ' {';
	                var props = style_defs[selector];
	                for (var k in props) {
	                    st += k + ':' + props[k] + ';';
	                }
	                st += '}';
	            }
	            return st;
	        };
	        var create_media_query_text = function(mq_defs) {
	            var mqt = '';
	            for (var mq in mq_defs) {
	                mqt += '\n' + mq + ' {' + create_style_text(mq_defs[mq]) + '\n}';
	            }
	            return mqt;
	        };

	        var style_text = create_style_text(styles) + create_media_query_text(media_queries),
	            head_el = document.head || document.getElementsByTagName('head')[0] || document.documentElement,
	            style_el = document.createElement('style');
	        head_el.appendChild(style_el);
	        style_el.setAttribute('type', 'text/css');
	        if (style_el.styleSheet) { // IE
	            style_el.styleSheet.cssText = style_text;
	        } else {
	            style_el.textContent = style_text;
	        }
	    };
	    inject_styles(notif_styles, notif_media_queries);
	};

	MPNotif.prototype._init_video = _.safewrap(function() {
	    if (!this.video_url) {
	        return;
	    }
	    var self = this;

	    // Youtube iframe API compatibility
	    self.yt_custom = 'postMessage' in window;

	    self.dest_url = self.video_url;
	    var youtube_match = self.video_url.match(
	                // http://stackoverflow.com/questions/2936467/parse-youtube-video-id-using-preg-match
	                /(?:youtube(?:-nocookie)?\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i
	            ),
	        vimeo_match = self.video_url.match(
	                /vimeo\.com\/.*?(\d+)/i
	            );
	    if (youtube_match) {
	        self.show_video = true;
	        self.youtube_video = youtube_match[1];

	        if (self.yt_custom) {
	            window['onYouTubeIframeAPIReady'] = function() {
	                if (self._get_el('video-frame')) {
	                    self._yt_video_ready();
	                }
	            };

	            // load Youtube iframe API; see https://developers.google.com/youtube/iframe_api_reference
	            var tag = document.createElement('script');
	            tag.src = '//www.youtube.com/iframe_api';
	            var firstScriptTag = document.getElementsByTagName('script')[0];
	            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	        }
	    } else if (vimeo_match) {
	        self.show_video = true;
	        self.vimeo_video = vimeo_match[1];
	    }

	    // IE <= 7, FF <= 3: fall through to video link rather than embedded player
	    if (self._browser_lte('ie', 7) || self._browser_lte('firefox', 3)) {
	        self.show_video = false;
	        self.clickthrough = true;
	    }
	});

	MPNotif.prototype._mark_as_shown = _.safewrap(function() {
	    // click on background to dismiss
	    var self = this;
	    _.register_event(self._get_el('bg'), 'click', function() {
	        self.dismiss();
	    });

	    var get_style = function(el, style_name) {
	        var styles = {};
	        if (document.defaultView && document.defaultView.getComputedStyle) {
	            styles = document.defaultView.getComputedStyle(el, null); // FF3 requires both args
	        } else if (el.currentStyle) { // IE
	            styles = el.currentStyle;
	        }
	        return styles[style_name];
	    };

	    if (this.campaign_id) {
	        var notif_el = this._get_el('overlay');
	        if (notif_el && get_style(notif_el, 'visibility') !== 'hidden' && get_style(notif_el, 'display') !== 'none') {
	            this._mark_delivery();
	        }
	    }
	});

	MPNotif.prototype._mark_delivery = _.safewrap(function(extra_props) {
	    if (!this.marked_as_shown) {
	        this.marked_as_shown = true;

	        if (this.campaign_id) {
	            // mark notification shown (local cache)
	            this._get_shown_campaigns()[this.campaign_id] = 1 * new Date();
	            this.persistence.save();
	        }

	        // track delivery
	        this._track_event('$campaign_delivery', extra_props);

	        // mark notification shown (mixpanel property)
	        this.mixpanel['people']['append']({
	            '$campaigns': this.campaign_id,
	            '$notifications': {
	                'campaign_id': this.campaign_id,
	                'message_id':  this.message_id,
	                'type':        'web',
	                'time':        new Date()
	            }
	        });
	    }
	});

	MPNotif.prototype._preload_images = function(all_loaded_cb) {
	    var self = this;
	    if (this.imgs_to_preload.length === 0) {
	        all_loaded_cb();
	        return;
	    }

	    var preloaded_imgs = 0;
	    var img_objs = [];
	    var onload = function() {
	        preloaded_imgs++;
	        if (preloaded_imgs === self.imgs_to_preload.length && all_loaded_cb) {
	            all_loaded_cb();
	            all_loaded_cb = null;
	        }
	    };
	    for (var i = 0; i < this.imgs_to_preload.length; i++) {
	        var img = new Image();
	        img.onload = onload;
	        img.src = this.imgs_to_preload[i];
	        if (img.complete) {
	            onload();
	        }
	        img_objs.push(img);
	    }

	    // IE6/7 doesn't fire onload reliably
	    if (this._browser_lte('ie', 7)) {
	        setTimeout(function() {
	            var imgs_loaded = true;
	            for (i = 0; i < img_objs.length; i++) {
	                if (!img_objs[i].complete) {
	                    imgs_loaded = false;
	                }
	            }
	            if (imgs_loaded && all_loaded_cb) {
	                all_loaded_cb();
	                all_loaded_cb = null;
	            }
	        }, 500);
	    }
	};

	MPNotif.prototype._remove_notification_el = _.safewrap(function() {
	    window.clearInterval(this._video_progress_checker);
	    this.notification_el.style.visibility = 'hidden';
	    this.body_el.removeChild(this.notification_el);
	});

	MPNotif.prototype._set_client_config = function() {
	    var get_browser_version = function(browser_ex) {
	        var match = navigator.userAgent.match(browser_ex);
	        return match && match[1];
	    };
	    this.browser_versions = {};
	    this.browser_versions['chrome']  = get_browser_version(/Chrome\/(\d+)/);
	    this.browser_versions['firefox'] = get_browser_version(/Firefox\/(\d+)/);
	    this.browser_versions['ie']      = get_browser_version(/MSIE (\d+).+/);
	    if (!this.browser_versions['ie'] && !(window.ActiveXObject) && 'ActiveXObject' in window) {
	        this.browser_versions['ie'] = 11;
	    }

	    this.body_el = document.body || document.getElementsByTagName('body')[0];
	    if (this.body_el) {
	        this.doc_width = Math.max(
	                this.body_el.scrollWidth, document.documentElement.scrollWidth,
	                this.body_el.offsetWidth, document.documentElement.offsetWidth,
	                this.body_el.clientWidth, document.documentElement.clientWidth
	            );
	        this.doc_height = Math.max(
	                this.body_el.scrollHeight, document.documentElement.scrollHeight,
	                this.body_el.offsetHeight, document.documentElement.offsetHeight,
	                this.body_el.clientHeight, document.documentElement.clientHeight
	            );
	    }

	    // detect CSS compatibility
	    var ie_ver = this.browser_versions['ie'];
	    var sample_styles = document.createElement('div').style,
	        is_css_compatible = function(rule) {
	            if (rule in sample_styles) {
	                return true;
	            }
	            if (!ie_ver) {
	                rule = rule[0].toUpperCase() + rule.slice(1);
	                var props = ['O' + rule, 'Webkit' + rule, 'Moz' + rule];
	                for (var i = 0; i < props.length; i++) {
	                    if (props[i] in sample_styles) {
	                        return true;
	                    }
	                }
	            }
	            return false;
	        };
	    this.use_transitions = this.body_el &&
	        is_css_compatible('transition') &&
	        is_css_compatible('transform');
	    this.flip_animate = (this.browser_versions['chrome'] >= 33 || this.browser_versions['firefox'] >= 15) &&
	        this.body_el &&
	        is_css_compatible('backfaceVisibility') &&
	        is_css_compatible('perspective') &&
	        is_css_compatible('transform');
	};

	MPNotif.prototype._switch_to_video = _.safewrap(function() {
	    var self = this,
	        anims = [
	            {
	                el:    self._get_notification_display_el(),
	                attr:  'opacity',
	                start: 1.0,
	                goal:  0.0
	            },
	            {
	                el:    self._get_notification_display_el(),
	                attr:  'top',
	                start: MPNotif.NOTIF_TOP,
	                goal:  -500
	            },
	            {
	                el:    self._get_el('video-noflip'),
	                attr:  'opacity',
	                start: 0.0,
	                goal:  1.0
	            },
	            {
	                el:    self._get_el('video-noflip'),
	                attr:  'top',
	                start: -self.video_height * 2,
	                goal:  0
	            }
	        ];

	    if (self.mini) {
	        var bg = self._get_el('bg'),
	            overlay = self._get_el('overlay');
	        bg.style.width = '100%';
	        bg.style.height = '100%';
	        overlay.style.width = '100%';

	        self._add_class(self._get_notification_display_el(), 'exiting');
	        self._add_class(bg, 'visible');

	        anims.push({
	            el:    self._get_el('bg'),
	            attr:  'opacity',
	            start: 0.0,
	            goal:  MPNotif.BG_OPACITY
	        });
	    }

	    var video_el = self._get_el('video-holder');
	    video_el.innerHTML = self.video_iframe;

	    var video_ready = function() {
	        if (window['YT'] && window['YT']['loaded']) {
	            self._yt_video_ready();
	        }
	        self.showing_video = true;
	        self._get_notification_display_el().style.visibility = 'hidden';
	    };
	    if (self.flip_animate) {
	        self._add_class('flipper', 'flipped');
	        setTimeout(video_ready, MPNotif.ANIM_TIME);
	    } else {
	        self._animate_els(anims, MPNotif.ANIM_TIME, video_ready);
	    }
	});

	MPNotif.prototype._track_event = function(event_name, properties, cb) {
	    if (this.campaign_id) {
	        properties = properties || {};
	        properties = _.extend(properties, {
	            'campaign_id':     this.campaign_id,
	            'message_id':      this.message_id,
	            'message_type':    'web_inapp',
	            'message_subtype': this.notif_type
	        });
	        this.mixpanel['track'](event_name, properties, cb);
	    } else if (cb) {
	        cb.call();
	    }
	};

	MPNotif.prototype._yt_video_ready = _.safewrap(function() {
	    var self = this;
	    if (self.video_inited) {
	        return;
	    }
	    self.video_inited = true;

	    var progress_bar  = self._get_el('video-elapsed'),
	        progress_time = self._get_el('video-time'),
	        progress_el   = self._get_el('video-progress');

	    new window['YT']['Player'](MPNotif.MARKUP_PREFIX + '-video-frame', {
	        'events': {
	            'onReady': function(event) {
	                var ytplayer = event['target'],
	                    video_duration = ytplayer['getDuration'](),
	                    pad = function(i) {
	                        return ('00' + i).slice(-2);
	                    },
	                    update_video_time = function(current_time) {
	                        var secs = Math.round(video_duration - current_time),
	                            mins = Math.floor(secs / 60),
	                            hours = Math.floor(mins / 60);
	                        secs -= mins * 60;
	                        mins -= hours * 60;
	                        progress_time.innerHTML = '-' + (hours ? hours + ':' : '') + pad(mins) + ':' + pad(secs);
	                    };
	                update_video_time(0);
	                self._video_progress_checker = window.setInterval(function() {
	                    var current_time = ytplayer['getCurrentTime']();
	                    progress_bar.style.width = (current_time / video_duration * 100) + '%';
	                    update_video_time(current_time);
	                }, 250);
	                _.register_event(progress_el, 'click', function(e) {
	                    var clickx = Math.max(0, e.pageX - progress_el.getBoundingClientRect().left);
	                    ytplayer['seekTo'](video_duration * clickx / progress_el.clientWidth, true);
	                });
	            }
	        }
	    });
	});

	// EXPORTS (for closure compiler)

	// MixpanelLib Exports
	MixpanelLib.prototype['init']                            = MixpanelLib.prototype.init;
	MixpanelLib.prototype['reset']                           = MixpanelLib.prototype.reset;
	MixpanelLib.prototype['disable']                         = MixpanelLib.prototype.disable;
	MixpanelLib.prototype['time_event']                      = MixpanelLib.prototype.time_event;
	MixpanelLib.prototype['track']                           = MixpanelLib.prototype.track;
	MixpanelLib.prototype['track_links']                     = MixpanelLib.prototype.track_links;
	MixpanelLib.prototype['track_forms']                     = MixpanelLib.prototype.track_forms;
	MixpanelLib.prototype['track_pageview']                  = MixpanelLib.prototype.track_pageview;
	MixpanelLib.prototype['register']                        = MixpanelLib.prototype.register;
	MixpanelLib.prototype['register_once']                   = MixpanelLib.prototype.register_once;
	MixpanelLib.prototype['unregister']                      = MixpanelLib.prototype.unregister;
	MixpanelLib.prototype['identify']                        = MixpanelLib.prototype.identify;
	MixpanelLib.prototype['alias']                           = MixpanelLib.prototype.alias;
	MixpanelLib.prototype['name_tag']                        = MixpanelLib.prototype.name_tag;
	MixpanelLib.prototype['set_config']                      = MixpanelLib.prototype.set_config;
	MixpanelLib.prototype['get_config']                      = MixpanelLib.prototype.get_config;
	MixpanelLib.prototype['get_property']                    = MixpanelLib.prototype.get_property;
	MixpanelLib.prototype['get_distinct_id']                 = MixpanelLib.prototype.get_distinct_id;
	MixpanelLib.prototype['toString']                        = MixpanelLib.prototype.toString;
	MixpanelLib.prototype['_check_and_handle_notifications'] = MixpanelLib.prototype._check_and_handle_notifications;
	MixpanelLib.prototype['_show_notification']              = MixpanelLib.prototype._show_notification;

	// MixpanelPersistence Exports
	MixpanelPersistence.prototype['properties']            = MixpanelPersistence.prototype.properties;
	MixpanelPersistence.prototype['update_search_keyword'] = MixpanelPersistence.prototype.update_search_keyword;
	MixpanelPersistence.prototype['update_referrer_info']  = MixpanelPersistence.prototype.update_referrer_info;
	MixpanelPersistence.prototype['get_cross_subdomain']   = MixpanelPersistence.prototype.get_cross_subdomain;
	MixpanelPersistence.prototype['clear']                 = MixpanelPersistence.prototype.clear;

	// MixpanelPeople Exports
	MixpanelPeople.prototype['set']           = MixpanelPeople.prototype.set;
	MixpanelPeople.prototype['set_once']      = MixpanelPeople.prototype.set_once;
	MixpanelPeople.prototype['increment']     = MixpanelPeople.prototype.increment;
	MixpanelPeople.prototype['append']        = MixpanelPeople.prototype.append;
	MixpanelPeople.prototype['union']         = MixpanelPeople.prototype.union;
	MixpanelPeople.prototype['track_charge']  = MixpanelPeople.prototype.track_charge;
	MixpanelPeople.prototype['clear_charges'] = MixpanelPeople.prototype.clear_charges;
	MixpanelPeople.prototype['delete_user']   = MixpanelPeople.prototype.delete_user;
	MixpanelPeople.prototype['toString']      = MixpanelPeople.prototype.toString;

	_.safewrap_class(MixpanelLib, ['identify', '_check_and_handle_notifications', '_show_notification']);

	var instances = {};
	var extend_mp = function() {
	    // add all the sub mixpanel instances
	    _.each(instances, function(instance, name) {
	        if (name !== PRIMARY_INSTANCE_NAME) { mixpanel_master[name] = instance; }
	    });

	    // add private functions as _
	    mixpanel_master['_'] = _;
	};

	var override_mp_init_func = function() {
	    // we override the snippets init function to handle the case where a
	    // user initializes the mixpanel library after the script loads & runs
	    mixpanel_master['init'] = function(token, config, name) {
	        if (name) {
	            // initialize a sub library
	            if (!mixpanel_master[name]) {
	                mixpanel_master[name] = instances[name] = create_mplib(token, config, name);
	                mixpanel_master[name]._loaded();
	            }
	            return mixpanel_master[name];
	        } else {
	            var instance = mixpanel_master;

	            if (instances[PRIMARY_INSTANCE_NAME]) {
	                // main mixpanel lib already initialized
	                instance = instances[PRIMARY_INSTANCE_NAME];
	            } else if (token) {
	                // intialize the main mixpanel lib
	                instance = create_mplib(token, config, PRIMARY_INSTANCE_NAME);
	                instance._loaded();
	                instances[PRIMARY_INSTANCE_NAME] = instance;
	            }

	            mixpanel_master = instance;
	            if (init_type === INIT_SNIPPET) {
	                window[PRIMARY_INSTANCE_NAME] = mixpanel_master;
	            }
	            extend_mp();
	        }
	    };
	};

	var add_dom_loaded_handler = function() {
	    // Cross browser DOM Loaded support
	    function dom_loaded_handler() {
	        // function flag since we only want to execute this once
	        if (dom_loaded_handler.done) { return; }
	        dom_loaded_handler.done = true;

	        DOM_LOADED = true;
	        ENQUEUE_REQUESTS = false;

	        _.each(instances, function(inst) {
	            inst._dom_loaded();
	        });
	    }

	    function do_scroll_check() {
	        try {
	            document.documentElement.doScroll('left');
	        } catch(e) {
	            setTimeout(do_scroll_check, 1);
	            return;
	        }

	        dom_loaded_handler();
	    }

	    if (document.addEventListener) {
	        if (document.readyState === 'complete') {
	            // safari 4 can fire the DOMContentLoaded event before loading all
	            // external JS (including this file). you will see some copypasta
	            // on the internet that checks for 'complete' and 'loaded', but
	            // 'loaded' is an IE thing
	            dom_loaded_handler();
	        } else {
	            document.addEventListener('DOMContentLoaded', dom_loaded_handler, false);
	        }
	    } else if (document.attachEvent) {
	        // IE
	        document.attachEvent('onreadystatechange', dom_loaded_handler);

	        // check to make sure we arn't in a frame
	        var toplevel = false;
	        try {
	            toplevel = window.frameElement === null;
	        } catch(e) {
	            // noop
	        }

	        if (document.documentElement.doScroll && toplevel) {
	            do_scroll_check();
	        }
	    }

	    // fallback handler, always will work
	    _.register_event(window, 'load', dom_loaded_handler, true);
	};

	var add_dom_event_counting_handlers = function(instance) {
	    var name = instance.get_config('name');

	    instance.mp_counts = instance.mp_counts || {};
	    instance.mp_counts['$__c'] = parseInt(_.cookie.get('mp_' + name + '__c')) || 0;

	    var increment_count = function() {
	        instance.mp_counts['$__c'] = (instance.mp_counts['$__c'] || 0) + 1;
	        _.cookie.set('mp_' + name + '__c', instance.mp_counts['$__c'], 1, true);
	    };

	    var evtCallback = function() {
	        try {
	            instance.mp_counts = instance.mp_counts || {};
	            increment_count();
	        } catch (e) {
	            console$1.error(e);
	        }
	    };
	    _.register_event(document, 'submit', evtCallback);
	    _.register_event(document, 'change', evtCallback);
	    var mousedownTarget = null;
	    _.register_event(document, 'mousedown', function(e) {
	        mousedownTarget = e.target;
	    });
	    _.register_event(document, 'mouseup', function(e) {
	        if (e.target === mousedownTarget) {
	            evtCallback(e);
	        }
	    });
	};

	function init_as_module() {
	    init_type = INIT_MODULE;
	    mixpanel_master = new MixpanelLib();

	    override_mp_init_func();
	    mixpanel_master['init']();
	    add_dom_loaded_handler();

	    return mixpanel_master;
	}

	var mixpanel = init_as_module();

	module.exports = mixpanel;

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	!function(e,r){if(true)module.exports=r();else if("function"==typeof define&&define.amd)define([],r);else{var t=r();for(var n in t)("object"==typeof exports?exports:e)[n]=t[n]}}(this,function(){return function(e){function r(n){if(t[n])return t[n].exports;var o=t[n]={exports:{},id:n,loaded:!1};return e[n].call(o.exports,o,o.exports,r),o.loaded=!0,o.exports}var t={};return r.m=e,r.c=t,r.p="",r(0)}([function(e,r,t){e.exports=t(1)},function(e,r,t){"use strict";function n(){var e="undefined"==typeof JSON?{}:JSON;o.setupJSON(e)}var o=t(2),i=t(3);n();var a=window._rollbarConfig,s=a&&a.globalAlias||"Rollbar",u=window[s]&&"undefined"!=typeof window[s].shimId;!u&&a?o.wrapper.init(a):(window.Rollbar=o.wrapper,window.RollbarNotifier=i.Notifier),e.exports=o.wrapper},function(e,r,t){"use strict";function n(e,r,t){!t[4]&&window._rollbarWrappedError&&(t[4]=window._rollbarWrappedError,window._rollbarWrappedError=null),e.uncaughtError.apply(e,t),r&&r.apply(window,t)}function o(e,r){if(r.hasOwnProperty&&r.hasOwnProperty("addEventListener")){var t=r.addEventListener;r.addEventListener=function(r,n,o){t.call(this,r,e.wrap(n),o)};var n=r.removeEventListener;r.removeEventListener=function(e,r,t){n.call(this,e,r&&r._wrapped||r,t)}}}var i=t(3),a=t(8),s=i.Notifier;window._rollbarWrappedError=null;var u={};u.init=function(e,r){var t=new s(r);if(t.configure(e),e.captureUncaught){var i;r&&a.isType(r._rollbarOldOnError,"function")?i=r._rollbarOldOnError:window.onerror&&!window.onerror.belongsToShim&&(i=window.onerror),window.onerror=function(){var e=Array.prototype.slice.call(arguments,0);n(t,i,e)};var u,c,l=["EventTarget","Window","Node","ApplicationCache","AudioTrackList","ChannelMergerNode","CryptoOperation","EventSource","FileReader","HTMLUnknownElement","IDBDatabase","IDBRequest","IDBTransaction","KeyOperation","MediaController","MessagePort","ModalWindow","Notification","SVGElementInstance","Screen","TextTrack","TextTrackCue","TextTrackList","WebSocket","WebSocketWorker","Worker","XMLHttpRequest","XMLHttpRequestEventTarget","XMLHttpRequestUpload"];for(u=0;u<l.length;++u)c=l[u],window[c]&&window[c].prototype&&o(t,window[c].prototype)}return e.captureUnhandledRejections&&(r&&a.isType(r._unhandledRejectionHandler,"function")&&window.removeEventListener("unhandledrejection",r._unhandledRejectionHandler),t._unhandledRejectionHandler=function(e){var r=e.reason,n=e.promise,o=e.detail;!r&&o&&(r=o.reason,n=o.promise),t.unhandledRejection(r,n)},window.addEventListener("unhandledrejection",t._unhandledRejectionHandler)),window.Rollbar=t,s.processPayloads(),t},e.exports={wrapper:u,setupJSON:i.setupJSON}},function(e,r,t){"use strict";function n(e){E=e,w.setupJSON(e)}function o(e,r){return function(){var t=r||this;try{return e.apply(t,arguments)}catch(n){console.error("[Rollbar]:",n)}}}function i(){h||(h=setTimeout(f,1e3))}function a(){return _}function s(e){_=_||this;var r="https://"+s.DEFAULT_ENDPOINT;this.options={enabled:!0,endpoint:r,environment:"production",scrubFields:g([],s.DEFAULT_SCRUB_FIELDS),checkIgnore:null,logLevel:s.DEFAULT_LOG_LEVEL,reportLevel:s.DEFAULT_REPORT_LEVEL,uncaughtErrorLevel:s.DEFAULT_UNCAUGHT_ERROR_LEVEL,payload:{}},this.lastError=null,this.plugins={},this.parentNotifier=e,e&&(e.hasOwnProperty("shimId")?e.notifier=this:this.configure(e.options))}function u(e){window._rollbarPayloadQueue.push(e),i()}function c(e){return o(function(){var r=this._getLogArgs(arguments);return this._log(e||r.level||this.options.logLevel||s.DEFAULT_LOG_LEVEL,r.message,r.err,r.custom,r.callback)})}function l(e,r){e||(e=r?E.stringify(r):"");var t={body:e};return r&&(t.extra=g(!0,{},r)),{message:t}}function p(e,r,t){var n=m.guessErrorClass(r.message),o=r.name||n[0],i=n[1],a={exception:{"class":o,message:i}};if(e&&(a.exception.description=e||"uncaught exception"),r.stack){var s,u,c,p,f,d,h,w;for(a.frames=[],h=0;h<r.stack.length;++h)s=r.stack[h],u={filename:s.url?v.sanitizeUrl(s.url):"(unknown)",lineno:s.line||null,method:s.func&&"?"!==s.func?s.func:"[anonymous]",colno:s.column},c=p=f=null,d=s.context?s.context.length:0,d&&(w=Math.floor(d/2),p=s.context.slice(0,w),c=s.context[w],f=s.context.slice(w)),c&&(u.code=c),(p||f)&&(u.context={},p&&p.length&&(u.context.pre=p),f&&f.length&&(u.context.post=f)),s.args&&(u.args=s.args),a.frames.push(u);return a.frames.reverse(),t&&(a.extra=g(!0,{},t)),{trace:a}}return l(o+": "+i,t)}function f(){var e;try{for(;e=window._rollbarPayloadQueue.shift();)d(e)}finally{h=void 0}}function d(e){var r=e.endpointUrl,t=e.accessToken,n=e.payload,o=e.callback||function(){},i=(new Date).getTime();i-L>=6e4&&(L=i,R=0);var a=window._globalRollbarOptions.maxItems,c=window._globalRollbarOptions.itemsPerMinute,l=function(){return!n.ignoreRateLimit&&a>=1&&T>=a},p=function(){return!n.ignoreRateLimit&&c>=1&&R>=c};return l()?void o(new Error(a+" max items reached")):p()?void o(new Error(c+" items per minute reached")):(T++,R++,l()&&_._log(_.options.uncaughtErrorLevel,"maxItems has been hit. Ignoring errors for the remainder of the current page load.",null,{maxItems:a},null,!1,!0),n.ignoreRateLimit&&delete n.ignoreRateLimit,void y.post(r,t,n,function(r,t){return r?(r instanceof b&&(e.callback=function(){},setTimeout(function(){u(e)},s.RETRY_DELAY)),o(r)):o(null,t)}))}var h,g=t(4),m=t(5),v=t(8),w=t(10),y=w.XHR,b=w.ConnectionError,E=null;s.NOTIFIER_VERSION="1.9.1",s.DEFAULT_ENDPOINT="api.rollbar.com/api/1/",s.DEFAULT_SCRUB_FIELDS=["pw","pass","passwd","password","secret","confirm_password","confirmPassword","password_confirmation","passwordConfirmation","access_token","accessToken","secret_key","secretKey","secretToken"],s.DEFAULT_LOG_LEVEL="debug",s.DEFAULT_REPORT_LEVEL="debug",s.DEFAULT_UNCAUGHT_ERROR_LEVEL="error",s.DEFAULT_ITEMS_PER_MIN=60,s.DEFAULT_MAX_ITEMS=0,s.LEVELS={debug:0,info:1,warning:2,error:3,critical:4},s.RETRY_DELAY=1e4,window._rollbarPayloadQueue=window._rollbarPayloadQueue||[],window._globalRollbarOptions={startTime:(new Date).getTime(),maxItems:s.DEFAULT_MAX_ITEMS,itemsPerMinute:s.DEFAULT_ITEMS_PER_MIN};var _,x=s.prototype;x._getLogArgs=function(e){for(var r,t,n,i,a,u,c=this.options.logLevel||s.DEFAULT_LOG_LEVEL,l=[],p=0;p<e.length;++p)u=e[p],a=v.typeName(u),"string"===a?r?l.push(u):r=u:"function"===a?i=o(u,this):"date"===a?l.push(u):"error"===a||u instanceof Error||"undefined"!=typeof DOMException&&u instanceof DOMException?t?l.push(u):t=u:"object"!==a&&"array"!==a||(n?l.push(u):n=u);return l.length&&(n=n||{},n.extraArgs=l),{level:c,message:r,err:t,custom:n,callback:i}},x._route=function(e){var r=this.options.endpoint,t=/\/$/.test(r),n=/^\//.test(e);return t&&n?e=e.substring(1):t||n||(e="/"+e),r+e},x._processShimQueue=function(e){for(var r,t,n,o,i,a,u,c={};t=e.shift();)r=t.shim,n=t.method,o=t.args,i=r.parentShim,u=c[r.shimId],u||(i?(a=c[i.shimId],u=new s(a)):u=this,c[r.shimId]=u),u[n]&&v.isType(u[n],"function")&&u[n].apply(u,o)},x._buildPayload=function(e,r,t,n,o){var i=this.options.accessToken,a=this.options.environment,u=g(!0,{},this.options.payload),c=v.uuid4();if(void 0===s.LEVELS[r])throw new Error("Invalid level");if(!t&&!n&&!o)throw new Error("No message, stack info or custom data");var l={environment:a,endpoint:this.options.endpoint,uuid:c,level:r,platform:"browser",framework:"browser-js",language:"javascript",body:this._buildBody(t,n,o),request:{url:window.location.href,query_string:window.location.search,user_ip:"$remote_ip"},client:{runtime_ms:e.getTime()-window._globalRollbarOptions.startTime,timestamp:Math.round(e.getTime()/1e3),javascript:{browser:window.navigator.userAgent,language:window.navigator.language,cookie_enabled:window.navigator.cookieEnabled,screen:{width:window.screen.width,height:window.screen.height},plugins:this._getBrowserPlugins()}},server:{},notifier:{name:"rollbar-browser-js",version:s.NOTIFIER_VERSION}};u.body&&delete u.body;var p={access_token:i,data:g(!0,l,u)};return this._scrub(p.data),p},x._buildBody=function(e,r,t){var n;return n=r?p(e,r,t):l(e,t)},x._getBrowserPlugins=function(){if(!this._browserPlugins){var e,r,t=window.navigator.plugins||[],n=t.length,o=[];for(r=0;n>r;++r)e=t[r],o.push({name:e.name,description:e.description});this._browserPlugins=o}return this._browserPlugins},x._scrub=function(e){function r(e,r,t,n,o,i){return r+v.redact(i)}function t(e){var t;if(v.isType(e,"string"))for(t=0;t<s.length;++t)e=e.replace(s[t],r);return e}function n(e,r){var t;for(t=0;t<a.length;++t)if(a[t].test(e)){r=v.redact(r);break}return r}function o(e,r){var o=n(e,r);return o===r?t(o):o}var i=this.options.scrubFields,a=this._getScrubFieldRegexs(i),s=this._getScrubQueryParamRegexs(i);return v.traverse(e,o),e},x._getScrubFieldRegexs=function(e){for(var r,t=[],n=0;n<e.length;++n)r="\\[?(%5[bB])?"+e[n]+"\\[?(%5[bB])?\\]?(%5[dD])?",t.push(new RegExp(r,"i"));return t},x._getScrubQueryParamRegexs=function(e){for(var r,t=[],n=0;n<e.length;++n)r="\\[?(%5[bB])?"+e[n]+"\\[?(%5[bB])?\\]?(%5[dD])?",t.push(new RegExp("("+r+"=)([^&\\n]+)","igm"));return t},x._urlIsWhitelisted=function(e){var r,t,n,o,i,a,s,u,c,l;try{if(r=this.options.hostWhiteList,t=e&&e.data&&e.data.body&&e.data.body.trace,!r||0===r.length)return!0;if(!t)return!0;for(s=r.length,i=t.frames.length,c=0;i>c;c++){if(n=t.frames[c],o=n.filename,!v.isType(o,"string"))return!0;for(l=0;s>l;l++)if(a=r[l],u=new RegExp(a),u.test(o))return!0}}catch(p){return this.configure({hostWhiteList:null}),console.error("[Rollbar]: Error while reading your configuration's hostWhiteList option. Removing custom hostWhiteList.",p),!0}return!1},x._messageIsIgnored=function(e){var r,t,n,o,i,a,s,u,c;try{if(i=!1,n=this.options.ignoredMessages,!n||0===n.length)return!1;if(s=e&&e.data&&e.data.body,u=s&&s.trace&&s.trace.exception&&s.trace.exception.message,c=s&&s.message&&s.message.body,r=u||c,!r)return!1;for(o=n.length,t=0;o>t&&(a=new RegExp(n[t],"gi"),!(i=a.test(r)));t++);}catch(l){this.configure({ignoredMessages:null}),console.error("[Rollbar]: Error while reading your configuration's ignoredMessages option. Removing custom ignoredMessages.")}return i},x._enqueuePayload=function(e,r,t,n){var o={callback:n,accessToken:this.options.accessToken,endpointUrl:this._route("item/"),payload:e},i=function(){if(n){var e="This item was not sent to Rollbar because it was ignored. This can happen if a custom checkIgnore() function was used or if the item's level was less than the notifier' reportLevel. See https://rollbar.com/docs/notifier/rollbar.js/configuration for more details.";n(null,{err:0,result:{id:null,uuid:null,message:e}})}};if(this._internalCheckIgnore(r,t,e))return void i();try{if(v.isType(this.options.checkIgnore,"function")&&this.options.checkIgnore(r,t,e))return void i()}catch(a){this.configure({checkIgnore:null}),console.error("[Rollbar]: Error while calling custom checkIgnore() function. Removing custom checkIgnore().",a)}if(this._urlIsWhitelisted(e)&&!this._messageIsIgnored(e)){if(this.options.verbose){if(e.data&&e.data.body&&e.data.body.trace){var s=e.data.body.trace,c=s.exception.message;console.error("[Rollbar]: ",c)}console.info("[Rollbar]: ",o)}v.isType(this.options.logFunction,"function")&&this.options.logFunction(o);try{v.isType(this.options.transform,"function")&&this.options.transform(e)}catch(a){this.configure({transform:null}),console.error("[Rollbar]: Error while calling custom transform() function. Removing custom transform().",a)}this.options.enabled&&u(o)}},x._internalCheckIgnore=function(e,r,t){var n=r[0],o=s.LEVELS[n]||0,i=s.LEVELS[this.options.reportLevel]||0;if(i>o)return!0;var a=this.options?this.options.plugins:{};if(a&&a.jquery&&a.jquery.ignoreAjaxErrors)try{return!!t.data.body.message.extra.isAjax}catch(u){return!1}return!1},x._log=function(e,r,t,n,o,i,a){var s=null;if(t)try{if(s=t._savedStackTrace?t._savedStackTrace:m.parse(t),t===this.lastError)return;this.lastError=t}catch(u){console.error("[Rollbar]: Error while parsing the error object.",u),r=t.message||t.description||r||String(t),t=null}var c=this._buildPayload(new Date,e,r,s,n);a&&(c.ignoreRateLimit=!0),this._enqueuePayload(c,!!i,[e,r,t,n],o)},x.log=c(),x.debug=c("debug"),x.info=c("info"),x.warn=c("warning"),x.warning=c("warning"),x.error=c("error"),x.critical=c("critical"),x.uncaughtError=o(function(e,r,t,n,o,i){if(i=i||null,o&&v.isType(o,"error"))return void this._log(this.options.uncaughtErrorLevel,e,o,i,null,!0);if(r&&v.isType(r,"error"))return void this._log(this.options.uncaughtErrorLevel,e,r,i,null,!0);var a={url:r||"",line:t};a.func=m.guessFunctionName(a.url,a.line),a.context=m.gatherContext(a.url,a.line);var s={mode:"onerror",message:o?String(o):e||"uncaught exception",url:document.location.href,stack:[a],useragent:navigator.userAgent},u=this._buildPayload(new Date,this.options.uncaughtErrorLevel,e,s,i);this._enqueuePayload(u,!0,[this.options.uncaughtErrorLevel,e,r,t,n,o])}),x.unhandledRejection=o(function(e,r){if(null==e)return void _._log(_.options.uncaughtErrorLevel,"unhandled rejection was null or undefined!",null,{},null,!1,!1);var t=e.message||(e?String(e):"unhandled rejection"),n=e._rollbarContext||r._rollbarContext||null;if(e&&v.isType(e,"error"))return void this._log(this.options.uncaughtErrorLevel,t,e,n,null,!0);var o={url:"",line:0};o.func=m.guessFunctionName(o.url,o.line),o.context=m.gatherContext(o.url,o.line);var i={mode:"unhandledrejection",message:t,url:document.location.href,stack:[o],useragent:navigator.userAgent},a=this._buildPayload(new Date,this.options.uncaughtErrorLevel,t,i,n);this._enqueuePayload(a,!0,[this.options.uncaughtErrorLevel,t,o.url,o.line,0,e,r])}),x.global=o(function(e){e=e||{};var r={startTime:e.startTime,maxItems:e.maxItems,itemsPerMinute:e.itemsPerMinute};g(!0,window._globalRollbarOptions,r),void 0!==e.maxItems&&(T=0),void 0!==e.itemsPerMinute&&(R=0)}),x.configure=o(function(e,r){var t=g(!0,{},e);g(!r,this.options,t),this.global(t)}),x.scope=o(function(e){var r=new s(this);return g(!0,r.options.payload,e),r}),x.wrap=function(e,r){try{var t;if(t=v.isType(r,"function")?r:function(){return r||{}},!v.isType(e,"function"))return e;if(e._isWrap)return e;if(!e._wrapped){e._wrapped=function(){try{return e.apply(this,arguments)}catch(r){throw r.stack||(r._savedStackTrace=m.parse(r)),r._rollbarContext=t()||{},r._rollbarContext._wrappedSource=e.toString(),window._rollbarWrappedError=r,r}},e._wrapped._isWrap=!0;for(var n in e)e.hasOwnProperty(n)&&(e._wrapped[n]=e[n])}return e._wrapped}catch(o){return e}},x.loadFull=function(){console.error("[Rollbar]: Unexpected Rollbar.loadFull() called on a Notifier instance")},s.processPayloads=function(e){return e?void f():void i()};var L=(new Date).getTime(),T=0,R=0;e.exports={Notifier:s,setupJSON:n,topLevelNotifier:a}},function(e,r){"use strict";var t=Object.prototype.hasOwnProperty,n=Object.prototype.toString,o=function(e){return"function"==typeof Array.isArray?Array.isArray(e):"[object Array]"===n.call(e)},i=function(e){if(!e||"[object Object]"!==n.call(e))return!1;var r=t.call(e,"constructor"),o=e.constructor&&e.constructor.prototype&&t.call(e.constructor.prototype,"isPrototypeOf");if(e.constructor&&!r&&!o)return!1;var i;for(i in e);return"undefined"==typeof i||t.call(e,i)};e.exports=function a(){var e,r,t,n,s,u,c=arguments[0],l=1,p=arguments.length,f=!1;for("boolean"==typeof c?(f=c,c=arguments[1]||{},l=2):("object"!=typeof c&&"function"!=typeof c||null==c)&&(c={});p>l;++l)if(e=arguments[l],null!=e)for(r in e)t=c[r],n=e[r],c!==n&&(f&&n&&(i(n)||(s=o(n)))?(s?(s=!1,u=t&&o(t)?t:[]):u=t&&i(t)?t:{},c[r]=a(f,u,n)):"undefined"!=typeof n&&(c[r]=n));return c}},function(e,r,t){"use strict";function n(){return l}function o(){return null}function i(e){var r={};return r._stackFrame=e,r.url=e.fileName,r.line=e.lineNumber,r.func=e.functionName,r.column=e.columnNumber,r.args=e.args,r.context=o(r.url,r.line),r}function a(e){function r(){var r=[];try{r=c.parse(e)}catch(t){r=[]}for(var n=[],o=0;o<r.length;o++)n.push(new i(r[o]));return n}return{stack:r(),message:e.message,name:e.name}}function s(e){return new a(e)}function u(e){if(!e)return["Unknown error. There was no error message to display.",""];var r=e.match(p),t="(unknown)";return r&&(t=r[r.length-1],e=e.replace((r[r.length-2]||"")+t+":",""),e=e.replace(/(^[\s]+|[\s]+$)/g,"")),[t,e]}var c=t(6),l="?",p=new RegExp("^(([a-zA-Z0-9-_$ ]*): *)?(Uncaught )?([a-zA-Z0-9-_$ ]*): ");e.exports={guessFunctionName:n,guessErrorClass:u,gatherContext:o,parse:s,Stack:a,Frame:i}},function(e,r,t){var n,o,i;!function(a,s){"use strict";o=[t(7)],n=s,i="function"==typeof n?n.apply(r,o):n,!(void 0!==i&&(e.exports=i))}(this,function(e){"use strict";function r(e,r,t){if("function"==typeof Array.prototype.map)return e.map(r,t);for(var n=new Array(e.length),o=0;o<e.length;o++)n[o]=r.call(t,e[o]);return n}function t(e,r,t){if("function"==typeof Array.prototype.filter)return e.filter(r,t);for(var n=[],o=0;o<e.length;o++)r.call(t,e[o])&&n.push(e[o]);return n}var n=/(^|@)\S+\:\d+/,o=/^\s*at .*(\S+\:\d+|\(native\))/m,i=/^(eval@)?(\[native code\])?$/;return{parse:function(e){if("undefined"!=typeof e.stacktrace||"undefined"!=typeof e["opera#sourceloc"])return this.parseOpera(e);if(e.stack&&e.stack.match(o))return this.parseV8OrIE(e);if(e.stack)return this.parseFFOrSafari(e);throw new Error("Cannot parse given Error object")},extractLocation:function(e){if(-1===e.indexOf(":"))return[e];var r=e.replace(/[\(\)\s]/g,"").split(":"),t=r.pop(),n=r[r.length-1];if(!isNaN(parseFloat(n))&&isFinite(n)){var o=r.pop();return[r.join(":"),o,t]}return[r.join(":"),t,void 0]},parseV8OrIE:function(n){var i=t(n.stack.split("\n"),function(e){return!!e.match(o)},this);return r(i,function(r){r.indexOf("(eval ")>-1&&(r=r.replace(/eval code/g,"eval").replace(/(\(eval at [^\()]*)|(\)\,.*$)/g,""));var t=r.replace(/^\s+/,"").replace(/\(eval code/g,"(").split(/\s+/).slice(1),n=this.extractLocation(t.pop()),o=t.join(" ")||void 0,i="eval"===n[0]?void 0:n[0];return new e(o,void 0,i,n[1],n[2],r)},this)},parseFFOrSafari:function(n){var o=t(n.stack.split("\n"),function(e){return!e.match(i)},this);return r(o,function(r){if(r.indexOf(" > eval")>-1&&(r=r.replace(/ line (\d+)(?: > eval line \d+)* > eval\:\d+\:\d+/g,":$1")),-1===r.indexOf("@")&&-1===r.indexOf(":"))return new e(r);var t=r.split("@"),n=this.extractLocation(t.pop()),o=t.shift()||void 0;return new e(o,void 0,n[0],n[1],n[2],r)},this)},parseOpera:function(e){return!e.stacktrace||e.message.indexOf("\n")>-1&&e.message.split("\n").length>e.stacktrace.split("\n").length?this.parseOpera9(e):e.stack?this.parseOpera11(e):this.parseOpera10(e)},parseOpera9:function(r){for(var t=/Line (\d+).*script (?:in )?(\S+)/i,n=r.message.split("\n"),o=[],i=2,a=n.length;a>i;i+=2){var s=t.exec(n[i]);s&&o.push(new e(void 0,void 0,s[2],s[1],void 0,n[i]))}return o},parseOpera10:function(r){for(var t=/Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i,n=r.stacktrace.split("\n"),o=[],i=0,a=n.length;a>i;i+=2){var s=t.exec(n[i]);s&&o.push(new e(s[3]||void 0,void 0,s[2],s[1],void 0,n[i]))}return o},parseOpera11:function(o){var i=t(o.stack.split("\n"),function(e){return!!e.match(n)&&!e.match(/^Error created at/)},this);return r(i,function(r){var t,n=r.split("@"),o=this.extractLocation(n.pop()),i=n.shift()||"",a=i.replace(/<anonymous function(: (\w+))?>/,"$2").replace(/\([^\)]*\)/g,"")||void 0;i.match(/\(([^\)]*)\)/)&&(t=i.replace(/^[^\(]+\(([^\)]*)\)$/,"$1"));var s=void 0===t||"[arguments not available]"===t?void 0:t.split(",");return new e(a,s,o[0],o[1],o[2],r)},this)}}})},function(e,r,t){var n,o,i;!function(t,a){"use strict";o=[],n=a,i="function"==typeof n?n.apply(r,o):n,!(void 0!==i&&(e.exports=i))}(this,function(){"use strict";function e(e){return!isNaN(parseFloat(e))&&isFinite(e)}function r(e,r,t,n,o,i){void 0!==e&&this.setFunctionName(e),void 0!==r&&this.setArgs(r),void 0!==t&&this.setFileName(t),void 0!==n&&this.setLineNumber(n),void 0!==o&&this.setColumnNumber(o),void 0!==i&&this.setSource(i)}return r.prototype={getFunctionName:function(){return this.functionName},setFunctionName:function(e){this.functionName=String(e)},getArgs:function(){return this.args},setArgs:function(e){if("[object Array]"!==Object.prototype.toString.call(e))throw new TypeError("Args must be an Array");this.args=e},getFileName:function(){return this.fileName},setFileName:function(e){this.fileName=String(e)},getLineNumber:function(){return this.lineNumber},setLineNumber:function(r){if(!e(r))throw new TypeError("Line Number must be a Number");this.lineNumber=Number(r)},getColumnNumber:function(){return this.columnNumber},setColumnNumber:function(r){if(!e(r))throw new TypeError("Column Number must be a Number");this.columnNumber=Number(r)},getSource:function(){return this.source},setSource:function(e){this.source=String(e)},toString:function(){var r=this.getFunctionName()||"{anonymous}",t="("+(this.getArgs()||[]).join(",")+")",n=this.getFileName()?"@"+this.getFileName():"",o=e(this.getLineNumber())?":"+this.getLineNumber():"",i=e(this.getColumnNumber())?":"+this.getColumnNumber():"";return r+t+n+o+i}},r})},function(e,r,t){"use strict";function n(e){return{}.toString.call(e).match(/\s([a-zA-Z]+)/)[1].toLowerCase()}function o(e,r){return n(e)===r}function i(e){if(!o(e,"string"))throw new Error("received invalid input");for(var r=l,t=r.parser[r.strictMode?"strict":"loose"].exec(e),n={},i=14;i--;)n[r.key[i]]=t[i]||"";return n[r.q.name]={},n[r.key[12]].replace(r.q.parser,function(e,t,o){t&&(n[r.q.name][t]=o)}),n}function a(e){var r=i(e);return""===r.anchor&&(r.source=r.source.replace("#","")),e=r.source.replace("?"+r.query,"")}function s(e,r){var t,n,i,a=o(e,"object"),u=o(e,"array"),c=[];if(a)for(t in e)e.hasOwnProperty(t)&&c.push(t);else if(u)for(i=0;i<e.length;++i)c.push(i);for(i=0;i<c.length;++i)t=c[i],n=e[t],a=o(n,"object"),u=o(n,"array"),a||u?e[t]=s(n,r):e[t]=r(t,n);return e}function u(e){return e=String(e),new Array(e.length+1).join("*")}function c(){var e=(new Date).getTime(),r="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(r){var t=(e+16*Math.random())%16|0;return e=Math.floor(e/16),("x"===r?t:7&t|8).toString(16)});return r}t(9);var l={strictMode:!1,key:["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],q:{name:"queryKey",parser:/(?:^|&)([^&=]*)=?([^&]*)/g},parser:{strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,loose:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/}},p={isType:o,parseUri:i,parseUriOptions:l,redact:u,sanitizeUrl:a,traverse:s,typeName:n,uuid4:c};e.exports=p},function(e,r){!function(e){"use strict";e.console=e.console||{};for(var r,t,n=e.console,o={},i=function(){},a="memory".split(","),s="assert,clear,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn".split(",");r=a.pop();)n[r]||(n[r]=o);for(;t=s.pop();)n[t]||(n[t]=i)}("undefined"==typeof window?this:window)},function(e,r,t){"use strict";function n(e){a=e}function o(e){this.name="Connection Error",this.message=e,this.stack=(new Error).stack}var i=t(8),a=null;o.prototype=Object.create(Error.prototype),o.prototype.constructor=o;var s={XMLHttpFactories:[function(){return new XMLHttpRequest},function(){return new ActiveXObject("Msxml2.XMLHTTP")},function(){return new ActiveXObject("Msxml3.XMLHTTP")},function(){return new ActiveXObject("Microsoft.XMLHTTP")}],createXMLHTTPObject:function(){var e,r=!1,t=s.XMLHttpFactories,n=t.length;for(e=0;n>e;e++)try{r=t[e]();break}catch(o){}return r},post:function(e,r,t,n){if(!i.isType(t,"object"))throw new Error("Expected an object to POST");t=a.stringify(t),n=n||function(){};var u=s.createXMLHTTPObject();if(u)try{try{var c=function(){try{c&&4===u.readyState&&(c=void 0,200===u.status?n(null,a.parse(u.responseText)):n(i.isType(u.status,"number")&&u.status>=400&&u.status<600?new Error(String(u.status)):new o("XHR response had no status code (likely connection failure)")))}catch(e){var r;r=e&&e.stack?e:new Error(e),n(r)}};u.open("POST",e,!0),u.setRequestHeader&&(u.setRequestHeader("Content-Type","application/json"),u.setRequestHeader("X-Rollbar-Access-Token",r)),u.onreadystatechange=c,u.send(t)}catch(l){if("undefined"!=typeof XDomainRequest){"http:"===window.location.href.substring(0,5)&&"https"===e.substring(0,5)&&(e="http"+e.substring(5));var p=function(){n(new o("Request timed out"))},f=function(){n(new Error("Error during request"))},d=function(){n(null,a.parse(u.responseText))};u=new XDomainRequest,u.onprogress=function(){},u.ontimeout=p,u.onerror=f,u.onload=d,u.open("POST",e,!0),u.send(t)}}}catch(h){n(h)}}};e.exports={XHR:s,setupJSON:n,ConnectionError:o}}])});

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _panel = __webpack_require__(5);

	var _parentFrame = __webpack_require__(60);

	var _persistence = __webpack_require__(65);

	var _persistence2 = _interopRequireDefault(_persistence);

	var _util = __webpack_require__(66);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var MPApp = function (_Component) {
	  _inherits(MPApp, _Component);

	  function MPApp() {
	    _classCallCheck(this, MPApp);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(MPApp).apply(this, arguments));
	  }

	  _createClass(MPApp, [{
	    key: 'attachedCallback',
	    value: function attachedCallback() {
	      Object.assign(this.state, this.deserialize(this.persistence.get('state')));

	      // initialize frame communication
	      if (this.parentFrame) {
	        (0, _parentFrame.mirrorLocationHash)(this.parentFrame);
	        window.history.replaceState(null, null, this.initialURLHash());
	      }

	      _get(Object.getPrototypeOf(MPApp.prototype), 'attachedCallback', this).apply(this, arguments);

	      this.initClickOutside();
	    }
	  }, {
	    key: 'setParentFrame',
	    value: function setParentFrame(parentFrame, parentData) {
	      this.parentFrame = parentFrame;
	      this.parentData = parentData;
	      this.historyMethod = 'replaceState';
	    }
	  }, {
	    key: 'initialURLHash',
	    value: function initialURLHash() {
	      return this.parentData.hash.replace(/^#*/, '#');
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      var stateUpdate = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	      _util.debug.info('applying update ->', stateUpdate);
	      _get(Object.getPrototypeOf(MPApp.prototype), 'update', this).apply(this, arguments);
	      _util.debug.info('      new state ->', this.state);
	      this.persistence.set('state', this.serialize());
	    }

	    // serialization helpers

	  }, {
	    key: 'serialize',
	    value: function serialize() {
	      return JSON.stringify(this.toSerializationAttrs());
	    }
	  }, {
	    key: 'deserialize',
	    value: function deserialize(JSONstr) {
	      var persisted = null;
	      try {
	        persisted = this.fromSerializationAttrs(JSON.parse(JSONstr));
	      } catch (err) {
	        if (JSONstr) {
	          _util.debug.warn('Invalid persistence entry: ' + JSONstr);
	        }
	      }
	      return persisted || {};
	    }
	  }, {
	    key: 'toSerializationAttrs',
	    value: function toSerializationAttrs() {
	      return {};
	    }
	  }, {
	    key: 'fromSerializationAttrs',
	    value: function fromSerializationAttrs(attrs) {
	      return attrs;
	    }

	    // DOM helpers

	  }, {
	    key: 'initClickOutside',
	    value: function initClickOutside() {
	      var _this2 = this;

	      document.addEventListener('click', function (ev) {
	        return _this2.clickOutsideHandler(ev);
	      });

	      if (this.parentFrame) {
	        this.parentFrame.addHandler('click', function (ev) {
	          return _this2.clickOutsideHandler(ev);
	        });
	      }
	    }
	  }, {
	    key: 'onClickOutside',
	    value: function onClickOutside(tagName, appMethodName) {
	      this.clickOutsideHandlers = this.clickOutsideHandlers || {};
	      this.clickOutsideHandlers[appMethodName] = this.clickOutsideHandlers[appMethodName] || [];

	      if (this.clickOutsideHandlers[appMethodName].indexOf(tagName) === -1) {
	        this.clickOutsideHandlers[appMethodName].push(tagName);
	      }
	    }
	  }, {
	    key: 'clickOutsideHandler',
	    value: function clickOutsideHandler(ev) {
	      var _this3 = this;

	      this.clickOutsideHandlers = this.clickOutsideHandlers || {};
	      Object.keys(this.clickOutsideHandlers).forEach(function (appMethodName) {
	        var tagNames = _this3.clickOutsideHandlers[appMethodName];

	        for (var el = ev.target; el; el = el.parentElement) {
	          if (tagNames.includes(el.tagName)) {
	            return;
	          }
	        }

	        _this3[appMethodName](ev);
	      });
	    }
	  }, {
	    key: 'persistence',
	    get: function get() {
	      if (!this._persistence) {
	        var namespaceVars = [this.persistenceKey];
	        if (this.parentData) {
	          var _parentData = this.parentData;
	          var project_id = _parentData.project_id;
	          var user_id = _parentData.user_id;

	          namespaceVars = namespaceVars.concat([project_id, user_id]);
	        }
	        this._persistence = new _persistence2.default(namespaceVars.join(':'));
	      }
	      return this._persistence;
	    }

	    // override for app-specific storage entries and versioning

	  }, {
	    key: 'persistenceKey',
	    get: function get() {
	      return 'mpapp';
	    }
	  }]);

	  return MPApp;
	}(_panel.Component);

	exports.default = MPApp;

/***/ },
/* 65 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// safe namespaced in-browser persistence (currently localStorage only)

	var Persistence = function () {
	  function Persistence(namespace) {
	    _classCallCheck(this, Persistence);

	    this.namespace = namespace;
	  }

	  _createClass(Persistence, [{
	    key: "get",
	    value: function get(key) {
	      try {
	        return window.localStorage.getItem(this.keyFor(key));
	      } catch (err) {
	        return null;
	      }
	    }
	  }, {
	    key: "keyFor",
	    value: function keyFor(key) {
	      return this.namespace + ":" + key;
	    }
	  }, {
	    key: "set",
	    value: function set(key, val) {
	      try {
	        window.localStorage.setItem(this.keyFor(key), val);
	      } catch (err) {
	        return;
	      }
	    }
	  }]);

	  return Persistence;
	}();

	exports.default = Persistence;

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.debug = undefined;
	exports.downloadData = downloadData;
	exports.renameEvent = renameEvent;
	exports.renameProperty = renameProperty;
	exports.renamePropertyType = renamePropertyType;
	exports.renamePropertyValue = renamePropertyValue;

	var _util = __webpack_require__(55);

	var _constants = __webpack_require__(67);

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /* global DEBUG_LOG */

	// mixpanel-specific report utils

	/*
	 * downloadData()
	 *
	 * Initiates a direct download to the browser for any HTTP method,
	 * using a terrible hack of submitting a hidden form to a hidden
	 * iframe target.
	 *
	 */
	var downloadIdCounter = 1;
	function downloadData(endpoint, params) {
	  var method = arguments.length <= 2 || arguments[2] === undefined ? 'POST' : arguments[2];

	  // prepare target iframe
	  var exportFrameID = 'download-frame-' + downloadIdCounter++;
	  var exportFrame = document.createElement('iframe');
	  exportFrame.id = exportFrameID;
	  exportFrame.name = exportFrameID;
	  exportFrame.src = '';
	  exportFrame.style.display = 'none';
	  document.body.appendChild(exportFrame);

	  // prepare source form
	  var postForm = document.createElement('form');
	  postForm.action = endpoint;
	  postForm.method = method;
	  postForm.style.display = 'none';
	  postForm.target = exportFrameID;
	  postForm.innerHTML = Object.keys(params).map(function (p) {
	    return '<input type="hidden" name="' + p + '" value="' + (0, _util.htmlEncodeString)(params[p]) + '"/>';
	  }).join('');

	  // submit request
	  document.body.appendChild(postForm);
	  postForm.submit();
	}

	// TODO epurcer - replace this with a more general-purpose tool like https://www.npmjs.com/package/debug
	function getLogger(level) {
	  if (typeof DEBUG_LOG !== 'undefined' && DEBUG_LOG) {
	    /* eslint-disable no-console */
	    return function () {
	      var _console;

	      (_console = console)[level].apply(_console, arguments);
	    };
	    /* eslint-enable no-console */
	  } else {
	    return function () {};
	  }
	}
	var debug = exports.debug = ['log', 'info', 'warn', 'error', 'critical'].reduce(function (ret, level) {
	  return (0, _util.extend)(ret, _defineProperty({}, level, getLogger(level)));
	}, {});

	function renameEvent(event) {
	  if (_constants.EVENTS.hasOwnProperty(event)) {
	    return _constants.EVENTS[event];
	  }

	  return event;
	}

	function renameProperty(property) {
	  var remappedProperty = _constants.PROPERTIES[property];
	  if (remappedProperty) {
	    return remappedProperty;
	  }

	  // default conversion for all properties starting with '$'
	  if (property && property.length > 1 && property[0] === '$') {
	    return property.slice(1).split('_').map(_util.capitalize).join(' ');
	  }

	  return property;
	}

	function renamePropertyType(type) {
	  return {
	    number: 'Integer',
	    datetime: 'Date',
	    boolean: 'True/False'
	  }[type] || (0, _util.capitalize)(type);
	}

	function renamePropertyValue(value) {
	  var country = _constants.COUNTRIES[String(value).toUpperCase()];
	  if (country) {
	    return country;
	  }
	  return value;
	}

/***/ },
/* 67 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var COUNTRIES = exports.COUNTRIES = {
	  AD: 'Andorra',
	  AE: 'United Arab Emirates',
	  AF: 'Afghanistan',
	  AG: 'Antigua and Barbuda',
	  AI: 'Anguilla',
	  AL: 'Albania',
	  AM: 'Armenia',
	  AO: 'Angola',
	  AQ: 'Antarctica',
	  AR: 'Argentina',
	  AS: 'American Samoa',
	  AT: 'Austria',
	  AU: 'Australia',
	  AW: 'Aruba',
	  AX: '\xC5land Islands',
	  AZ: 'Azerbaijan',
	  BA: 'Bosnia and Herzegovina',
	  BB: 'Barbados',
	  BD: 'Bangladesh',
	  BE: 'Belgium',
	  BF: 'Burkina Faso',
	  BG: 'Bulgaria',
	  BH: 'Bahrain',
	  BI: 'Burundi',
	  BJ: 'Benin',
	  BL: 'Saint Barth\xE9lemy',
	  BM: 'Bermuda',
	  BN: 'Brunei Darussalam',
	  BO: 'Bolivia, Plurinational State of',
	  BQ: 'Bonaire, Sint Eustatius and Saba',
	  BR: 'Brazil',
	  BS: 'Bahamas',
	  BT: 'Bhutan',
	  BV: 'Bouvet Island',
	  BW: 'Botswana',
	  BY: 'Belarus',
	  BZ: 'Belize',
	  CA: 'Canada',
	  CC: 'Cocos (Keeling) Islands',
	  CD: 'Congo, the Democratic Republic of the',
	  CF: 'Central African Republic',
	  CG: 'Congo',
	  CH: 'Switzerland',
	  CI: 'C\xF4te d\'Ivoire',
	  CK: 'Cook Islands',
	  CL: 'Chile',
	  CM: 'Cameroon',
	  CN: 'China',
	  CO: 'Colombia',
	  CR: 'Costa Rica',
	  CU: 'Cuba',
	  CV: 'Cape Verde',
	  CW: 'Cura\xE7ao',
	  CX: 'Christmas Island',
	  CY: 'Cyprus',
	  CZ: 'Czech Republic',
	  DE: 'Germany',
	  DJ: 'Djibouti',
	  DK: 'Denmark',
	  DM: 'Dominica',
	  DO: 'Dominican Republic',
	  DZ: 'Algeria',
	  EC: 'Ecuador',
	  EE: 'Estonia',
	  EG: 'Egypt',
	  EH: 'Western Sahara',
	  ER: 'Eritrea',
	  ES: 'Spain',
	  ET: 'Ethiopia',
	  FI: 'Finland',
	  FJ: 'Fiji',
	  FK: 'Falkland Islands (Malvinas)',
	  FM: 'Micronesia, Federated States of',
	  FO: 'Faroe Islands',
	  FR: 'France',
	  GA: 'Gabon',
	  GB: 'United Kingdom',
	  GD: 'Grenada',
	  GE: 'Georgia',
	  GF: 'French Guiana',
	  GG: 'Guernsey',
	  GH: 'Ghana',
	  GI: 'Gibraltar',
	  GL: 'Greenland',
	  GM: 'Gambia',
	  GN: 'Guinea',
	  GP: 'Guadeloupe',
	  GQ: 'Equatorial Guinea',
	  GR: 'Greece',
	  GS: 'South Georgia and the South Sandwich Islands',
	  GT: 'Guatemala',
	  GU: 'Guam',
	  GW: 'Guinea-Bissau',
	  GY: 'Guyana',
	  HK: 'Hong Kong',
	  HM: 'Heard Island and McDonald Islands',
	  HN: 'Honduras',
	  HR: 'Croatia',
	  HT: 'Haiti',
	  HU: 'Hungary',
	  ID: 'Indonesia',
	  IE: 'Ireland',
	  IL: 'Israel',
	  IM: 'Isle of Man',
	  IN: 'India',
	  IO: 'British Indian Ocean Territory',
	  IQ: 'Iraq',
	  IR: 'Iran, Islamic Republic of',
	  IS: 'Iceland',
	  IT: 'Italy',
	  JE: 'Jersey',
	  JM: 'Jamaica',
	  JO: 'Jordan',
	  JP: 'Japan',
	  KE: 'Kenya',
	  KG: 'Kyrgyzstan',
	  KH: 'Cambodia',
	  KI: 'Kiribati',
	  KM: 'Comoros',
	  KN: 'Saint Kitts and Nevis',
	  KP: 'Korea, Democratic People\'s Republic of',
	  KR: 'Korea, Republic of',
	  KW: 'Kuwait',
	  KY: 'Cayman Islands',
	  KZ: 'Kazakhstan',
	  LA: 'Lao People\'s Democratic Republic',
	  LB: 'Lebanon',
	  LC: 'Saint Lucia',
	  LI: 'Liechtenstein',
	  LK: 'Sri Lanka',
	  LR: 'Liberia',
	  LS: 'Lesotho',
	  LT: 'Lithuania',
	  LU: 'Luxembourg',
	  LV: 'Latvia',
	  LY: 'Libya',
	  MA: 'Morocco',
	  MC: 'Monaco',
	  MD: 'Moldova, Republic of',
	  ME: 'Montenegro',
	  MF: 'Saint Martin (French part)',
	  MG: 'Madagascar',
	  MH: 'Marshall Islands',
	  MK: 'Macedonia, the Former Yugoslav Republic of',
	  ML: 'Mali',
	  MM: 'Myanmar',
	  MN: 'Mongolia',
	  MO: 'Macao',
	  MP: 'Northern Mariana Islands',
	  MQ: 'Martinique',
	  MR: 'Mauritania',
	  MS: 'Montserrat',
	  MT: 'Malta',
	  MU: 'Mauritius',
	  MV: 'Maldives',
	  MW: 'Malawi',
	  MX: 'Mexico',
	  MY: 'Malaysia',
	  MZ: 'Mozambique',
	  NA: 'Namibia',
	  NC: 'New Caledonia',
	  NE: 'Niger',
	  NF: 'Norfolk Island',
	  NG: 'Nigeria',
	  NI: 'Nicaragua',
	  NL: 'Netherlands',
	  NO: 'Norway',
	  NP: 'Nepal',
	  NR: 'Nauru',
	  NU: 'Niue',
	  NZ: 'New Zealand',
	  OM: 'Oman',
	  PA: 'Panama',
	  PE: 'Peru',
	  PF: 'French Polynesia',
	  PG: 'Papua New Guinea',
	  PH: 'Philippines',
	  PK: 'Pakistan',
	  PL: 'Poland',
	  PM: 'Saint Pierre and Miquelon',
	  PN: 'Pitcairn',
	  PR: 'Puerto Rico',
	  PS: 'Palestine, State of',
	  PT: 'Portugal',
	  PW: 'Palau',
	  PY: 'Paraguay',
	  QA: 'Qatar',
	  RE: 'R\xE9union',
	  RO: 'Romania',
	  RS: 'Serbia',
	  RU: 'Russian Federation',
	  RW: 'Rwanda',
	  SA: 'Saudi Arabia',
	  SB: 'Solomon Islands',
	  SC: 'Seychelles',
	  SD: 'Sudan',
	  SE: 'Sweden',
	  SG: 'Singapore',
	  SH: 'Saint Helena, Ascension and Tristan da Cunha',
	  SI: 'Slovenia',
	  SJ: 'Svalbard and Jan Mayen',
	  SK: 'Slovakia',
	  SL: 'Sierra Leone',
	  SM: 'San Marino',
	  SN: 'Senegal',
	  SO: 'Somalia',
	  SR: 'Suriname',
	  SS: 'South Sudan',
	  ST: 'Sao Tome and Principe',
	  SV: 'El Salvador',
	  SX: 'Sint Maarten (Dutch part)',
	  SY: 'Syrian Arab Republic',
	  SZ: 'Swaziland',
	  TC: 'Turks and Caicos Islands',
	  TD: 'Chad',
	  TF: 'French Southern Territories',
	  TG: 'Togo',
	  TH: 'Thailand',
	  TJ: 'Tajikistan',
	  TK: 'Tokelau',
	  TL: 'Timor-Leste',
	  TM: 'Turkmenistan',
	  TN: 'Tunisia',
	  TO: 'Tonga',
	  TR: 'Turkey',
	  TT: 'Trinidad and Tobago',
	  TV: 'Tuvalu',
	  TW: 'Taiwan, Province of China',
	  TZ: 'Tanzania, United Republic of',
	  UA: 'Ukraine',
	  UG: 'Uganda',
	  UM: 'United States Minor Outlying Islands',
	  US: 'United States',
	  UY: 'Uruguay',
	  UZ: 'Uzbekistan',
	  VA: 'Holy See (Vatican City State)',
	  VC: 'Saint Vincent and the Grenadines',
	  VE: 'Venezuela, Bolivarian Republic of',
	  VG: 'Virgin Islands, British',
	  VI: 'Virgin Islands, U.S.',
	  VN: 'Viet Nam',
	  VU: 'Vanuatu',
	  WF: 'Wallis and Futuna',
	  WS: 'Samoa',
	  YE: 'Yemen',
	  YT: 'Mayotte',
	  ZA: 'South Africa',
	  ZM: 'Zambia',
	  ZW: 'Zimbabwe'
	};

	var EVENTS = exports.EVENTS = {
	  $all_events: 'All Events',
	  $campaign_delivery: 'Notification Sent',
	  $campaign_open: 'Notification Opened',
	  $campaign_bounced: 'Notification Bounced',
	  $campaign_marked_spam: 'Notification Marked Spam',
	  $experiment_started: 'Experiment Started',
	  $show_survey: 'Show Survey',
	  $top_events: 'Your Top Events',
	  $signup: 'Signup'
	};

	var PROPERTIES = exports.PROPERTIES = {
	  $answer_count: 'Answer Count',
	  $app_build_number: '$app_build_number',
	  $app_release: 'App Release',
	  $app_version: 'App Version',
	  $app_version_string: '$app_version_string',
	  $bluetooth_enabled: 'Bluetooth Enabled',
	  $bluetooth_version: 'Bluetooth Version',
	  $brand: 'Brand',
	  $browser: 'Browser',
	  $browser_version: 'Browser Version',
	  $carrier: 'Carrier',
	  $city: 'City',
	  $current_url: 'Current URL',
	  $experiments: 'Experiments',
	  $device: 'Device',
	  $duration: 'Duration',
	  $from_binding: 'From Binding',
	  $google_play_services: 'Google Play Services',
	  $has_nfc: 'Has NFC',
	  $has_telephone: 'Has Telephone',
	  $import: 'Import',
	  $initial_referrer: 'Initial Referrer',
	  $initial_referring_domain: 'Initial Referring Domain',
	  $ios_ifa: 'iOS IFA',
	  $lib_version: 'Library Version',
	  $manufacturer: 'Manufacturer',
	  $model: 'Model',
	  $os: 'Operating System',
	  $os_version: 'OS Version',
	  $radio: 'Radio',
	  $referrer: 'Referrer',
	  $referring_domain: 'Referring Domain',
	  $region: 'Region',
	  $screen_dpi: 'Screen DPI',
	  $screen_height: 'Screen Height',
	  $screen_width: 'Screen Width',
	  $search_engine: 'Search Engine',
	  $survey_shown: 'Survey Shown',
	  $watch_model: 'Watch Model',
	  $wifi: 'Wifi',
	  campaign_id: 'Campaign',
	  collection_id: 'Collection ID',
	  message_id: 'Message ID',
	  message_subtype: 'Message Subtype',
	  message_type: 'Message Type',
	  mp_country_code: 'Country',
	  mp_device_model: 'Device Model',
	  mp_keyword: 'Search Keyword',
	  mp_lib: 'Mixpanel Library',
	  survey_id: 'Survey ID',
	  utm_campaign: 'UTM Campaign',
	  utm_content: 'UTM Content',
	  utm_medium: 'UTM Medium',
	  utm_source: 'UTM Source',
	  utm_term: 'UTM Term',

	  // the following are no longer used but
	  // should be included for historical reasons
	  mp_browser: 'Browser',
	  mp_page: 'Page View',
	  mp_platform: 'Platform',
	  mp_referrer: 'Referrer'
	};

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.h = exports.Component = undefined;

	var _component = __webpack_require__(69);

	var _component2 = _interopRequireDefault(_component);

	var _virtualHyperscript = __webpack_require__(38);

	var _virtualHyperscript2 = _interopRequireDefault(_virtualHyperscript);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Entry point for Panel apps and components
	 * @module panel
	 * @example
	 * import { Component } from 'panel';
	 * document.registerElement('my-widget', class extends Component {
	 *   // app definition
	 * });
	 */

	exports.Component = _component2.default;
	exports.h = _virtualHyperscript2.default;

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _mainLoop = __webpack_require__(7);

	var _mainLoop2 = _interopRequireDefault(_mainLoop);

	var _createElement = __webpack_require__(15);

	var _createElement2 = _interopRequireDefault(_createElement);

	var _diff = __webpack_require__(28);

	var _diff2 = _interopRequireDefault(_diff);

	var _patch = __webpack_require__(33);

	var _patch2 = _interopRequireDefault(_patch);

	var _virtualHyperscript = __webpack_require__(38);

	var _virtualHyperscript2 = _interopRequireDefault(_virtualHyperscript);

	var _webcomponent = __webpack_require__(48);

	var _webcomponent2 = _interopRequireDefault(_webcomponent);

	var _router = __webpack_require__(70);

	var _router2 = _interopRequireDefault(_router);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var panelID = 1;
	var DOCUMENT_FRAGMENT_NODE = 11;
	var EMPTY_DIV = (0, _virtualHyperscript2.default)('div');

	/**
	 * Definition of a Panel component/app, implemented as an HTML custom element.
	 * App logic and configuration is defined by extending this class. Instantiating
	 * a component is typically not done by calling the constructor directly, but
	 * either by including the tag in HTML markup, or by using the DOM API method
	 * [document.createElement]{@link https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement}.
	 *
	 * @example <caption>Defining a Panel component</caption>
	 * class MyWidget extends Component {
	 *   get config() {
	 *     return {
	 *       // options go here
	 *     };
	 *   }
	 *
	 *   myMethod() {
	 *     // etc
	 *   }
	 * }
	 *
	 * @example <caption>Registering the custom element definition for the DOM</caption>
	 * document.registerElement('my-widget', MyWidget);
	 *
	 * @example <caption>Adding an instance of the element to the DOM</caption>
	 * <my-widget some-attr></my-widget>
	 *
	 * @extends WebComponent
	 */

	var Component = function (_WebComponent) {
	  _inherits(Component, _WebComponent);

	  function Component() {
	    _classCallCheck(this, Component);

	    return _possibleConstructorReturn(this, (Component.__proto__ || Object.getPrototypeOf(Component)).apply(this, arguments));
	  }

	  _createClass(Component, [{
	    key: 'child',


	    /**
	     * For use inside view templates, to create a child Panel component nested under this
	     * component, which will share its state object and update cycle.
	     * @param {string} tagName - the HTML element tag name of the custom element
	     * to be created
	     * @param {object} [attrs={}] - HTML attributes to assign to the child
	     * @returns {object} virtual-dom node
	     * @example
	     * {template: state => h('.header', this.child('my-child-widget'))}
	     */
	    value: function child(tagName) {
	      var attrs = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	      attrs = Object.assign({}, attrs);
	      attrs.attributes = Object.assign({}, attrs.attributes, { 'panel-parent': this.panelID });
	      return (0, _virtualHyperscript2.default)(tagName, attrs);
	    }

	    /**
	     * Searches the component's Panel ancestors for the first component of the
	     * given type (HTML tag name).
	     * @param {string} tagName - tag name of the parent to search for
	     * @returns {object} Panel component
	     * @throws Throws an error if no parent component with the given tag name is found.
	     * @example
	     * myWidget.findPanelParentByTagName('my-app');
	     */

	  }, {
	    key: 'findPanelParentByTagName',
	    value: function findPanelParentByTagName(tagName) {
	      tagName = tagName.toLowerCase();
	      for (var node = this.$panelParent; !!node; node = node.$panelParent) {
	        if (node.tagName.toLowerCase() === tagName) {
	          return node;
	        }
	      }
	      throw Error(tagName + ' not found');
	    }

	    /**
	     * Fetches a value from the component's configuration map (a combination of
	     * values supplied in the config() getter and defaults applied automatically).
	     * @param {string} key - key of config item to fetch
	     * @returns value associated with key
	     * @example
	     * myWidget.getConfig('css');
	     */

	  }, {
	    key: 'getConfig',
	    value: function getConfig(key) {
	      return this._config[key];
	    }

	    /**
	     * Executes the route handler matching the given URL fragment, and updates
	     * the URL, as though the user had navigated explicitly to that address.
	     * @param {string} fragment - URL fragment to navigate to
	     * @param {object} [stateUpdate={}] - update to apply to state object when
	     * routing
	     * @example
	     * myApp.navigate('wombat/54', {color: 'blue'});
	     */

	  }, {
	    key: 'navigate',
	    value: function navigate() {
	      var _$panelRoot$router;

	      (_$panelRoot$router = this.$panelRoot.router).navigate.apply(_$panelRoot$router, arguments);
	    }

	    /**
	     * Sets a value in the component's configuration map after element
	     * initialization.
	     * @param {string} key - key of config item to set
	     * @param val - value to associate with key
	     * @example
	     * myWidget.setConfig('template', () => h('.new-template', 'Hi'));
	     */

	  }, {
	    key: 'setConfig',
	    value: function setConfig(key, val) {
	      this._config[key] = val;
	    }

	    /**
	     * To be overridden by subclasses, defining conditional logic for whether
	     * a component should rerender its template given the state to be applied.
	     * In most cases this method can be left untouched, but can provide improved
	     * performance when dealing with very many DOM elements.
	     * @param {object} state - state object to be used when rendering
	     * @returns {boolean} whether or not to render/update this component
	     * @example
	     * shouldUpdate(state) {
	     *   // don't need to rerender if result set ID hasn't changed
	     *   return state.largeResultSetID !== this._cachedResultID;
	     * }
	     */

	  }, {
	    key: 'shouldUpdate',
	    value: function shouldUpdate(state) {
	      return true;
	    }

	    /**
	     * Applies a state update, triggering a re-render check of the component as
	     * well as any other components sharing the same state. This is the primary
	     * means of updating the DOM in a Panel application.
	     * @param {object} [stateUpdate={}] - keys and values of entries to update in
	     * the component's state object
	     * @example
	     * myWidget.update({name: 'Bob'});
	     */

	  }, {
	    key: 'update',
	    value: function update() {
	      var stateUpdate = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	      if (!this.initialized) {
	        Object.assign(this.state, stateUpdate);
	      } else if (this.isPanelRoot) {
	        var updateHash = '$fragment' in stateUpdate && stateUpdate.$fragment !== this.state.$fragment;

	        Object.assign(this.state, stateUpdate);
	        this.updateSelfAndChildren(this.state);

	        if (updateHash) {
	          this.router.replaceHash(this.state.$fragment);
	        }
	      } else {
	        this.$panelRoot.update(stateUpdate);
	      }
	    }
	  }, {
	    key: 'createdCallback',
	    value: function createdCallback() {
	      this.panelID = panelID++;
	      this._config = Object.assign({}, {
	        css: '',
	        helpers: {},
	        routes: {},
	        template: function template() {
	          throw Error('No template provided by Component subclass');
	        },
	        useShadowDom: false
	      }, this.config);
	      this.state = {};
	      if (this.getConfig('useShadowDom')) {
	        this.el = this.createShadowRoot();
	        this.styleTag = document.createElement('style');
	        this.styleTag.innerHTML = this.getConfig('css');
	        this.el.appendChild(this.styleTag);
	      } else if (this.getConfig('css')) {
	        throw Error('"useShadowDom" config option must be set in order to use "css" config.');
	      } else {
	        this.el = this;
	      }
	    }
	  }, {
	    key: 'attachedCallback',
	    value: function attachedCallback() {
	      this.$panelChildren = new Set();

	      var parentID = Number(this.getAttribute('panel-parent'));
	      if (parentID) {
	        this.isPanelChild = true;
	        // find $panelParent
	        for (var node = this.parentNode; node && !this.$panelParent; node = node.parentNode) {
	          if (node.nodeType === DOCUMENT_FRAGMENT_NODE) {
	            // handle shadow-root
	            node = node.host;
	          }
	          if (node.panelID === parentID) {
	            this.$panelParent = node;
	            this.$panelRoot = node.$panelRoot;
	          }
	        }
	        if (!this.$panelParent) {
	          throw Error('panel-parent ' + parentID + ' not found');
	        }
	        this.$panelParent.$panelChildren.add(this);
	        this.state = this.$panelRoot.state;
	      } else {
	        this.isPanelRoot = true;
	        this.$panelRoot = this;
	        this.$panelParent = null;
	      }
	      this.app = this.$panelRoot;

	      var newState = Object.assign({}, this.getConfig('defaultState'), this.state, this.getJSONAttribute('data-state'), this._stateFromAttributes());
	      Object.assign(this.state, newState);

	      this.loop = (0, _mainLoop2.default)(this.state, this._render.bind(this), { create: _createElement2.default, diff: _diff2.default, patch: _patch2.default });
	      this.el.appendChild(this.loop.target);
	      this.initialized = true;

	      if (Object.keys(this.getConfig('routes')).length) {
	        this.router = new _router2.default(this, { historyMethod: this.historyMethod });
	        this.navigate(window.location.hash);
	      }
	    }
	  }, {
	    key: 'detachedCallback',
	    value: function detachedCallback() {
	      this.$panelParent && this.$panelParent.$panelChildren.delete(this);
	    }
	  }, {
	    key: 'attributeChangedCallback',
	    value: function attributeChangedCallback(attr, oldVal, newVal) {
	      if (attr === 'style-override') {
	        this._applyStyles(newVal);
	      }
	      if (this.isPanelRoot && this.initialized) {
	        this.update();
	      }
	    }
	  }, {
	    key: '_applyStyles',
	    value: function _applyStyles(styleOverride) {
	      if (this.getConfig('useShadowDom')) {
	        this.styleTag.innerHTML = this.getConfig('css') + (styleOverride || '');
	      }
	    }
	  }, {
	    key: 'logError',
	    value: function logError() {
	      var _console;

	      (_console = console).error.apply(_console, arguments);
	    }
	  }, {
	    key: 'toString',
	    value: function toString() {
	      try {
	        return this.tagName + '#' + this.panelID;
	      } catch (e) {
	        return 'UNKNOWN COMPONENT';
	      }
	    }
	  }, {
	    key: 'updateSelfAndChildren',
	    value: function updateSelfAndChildren(state) {
	      if (this.initialized && this.shouldUpdate(state)) {
	        this.loop.update(state);
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	          for (var _iterator = this.$panelChildren[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var child = _step.value;

	            child.updateSelfAndChildren(state);
	          }
	        } catch (err) {
	          _didIteratorError = true;
	          _iteratorError = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion && _iterator.return) {
	              _iterator.return();
	            }
	          } finally {
	            if (_didIteratorError) {
	              throw _iteratorError;
	            }
	          }
	        }
	      }
	    }
	  }, {
	    key: '_render',
	    value: function _render(state) {
	      if (this.shouldUpdate(state)) {
	        try {
	          this._rendered = this.getConfig('template')(Object.assign({}, state, {
	            $component: this,
	            $helpers: this.getConfig('helpers')
	          }));
	        } catch (e) {
	          this.logError('Error while rendering ' + this.toString(), this, e);
	        }
	      }
	      return this._rendered || EMPTY_DIV;
	    }
	  }, {
	    key: '_stateFromAttributes',
	    value: function _stateFromAttributes() {
	      var state = {};

	      // this.attributes is a NamedNodeMap, without normal iterators
	      for (var ai = 0; ai < this.attributes.length; ai++) {
	        var attr = this.attributes[ai];
	        var attrMatch = attr.name.match(/^state-(.+)/);
	        if (attrMatch) {
	          var num = Number(attr.value);
	          state[attrMatch[1]] = isNaN(num) ? attr.value : num;
	        }
	      }

	      return state;
	    }
	  }, {
	    key: 'config',


	    /**
	     * Defines standard component configuration.
	     * @type {object}
	     * @property {function} template - function transforming state object to virtual-dom tree
	     * @property {object} [helpers={}] - properties and functions injected automatically into template state object
	     * @property {object} [routes={}] - object mapping string route expressions to handler functions
	     * @property {boolean} [useShadowDom=false] - whether to use Shadow DOM
	     * @property {string} [css=''] - component-specific Shadow DOM stylesheet
	     * @example
	     * get config() {
	     *   return {
	     *     template: state => h('.name', `My name is ${name}`),
	     *     routes: {
	     *       'wombat/:wombatId': (stateUpdate={}, wombatId) => {
	     *         // route handler implementation
	     *       },
	     *     },
	     *   };
	     * }
	     */
	    get: function get() {
	      return {};
	    }
	  }]);

	  return Component;
	}(_webcomponent2.default);

	exports.default = Component;

/***/ },
/* 70 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// just the necessary bits of Backbone router+history
	var Router = function () {
	  function Router(app) {
	    var _this = this;

	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    _classCallCheck(this, Router);

	    // allow injecting window dep
	    var routerWindow = this.window = options.window || window;

	    this.app = app;
	    var routeDefs = this.app.getConfig('routes');

	    // https://github.com/jashkenas/backbone/blob/d682061a/backbone.js#L1476-L1479
	    // Cached regular expressions for matching named param parts and splatted
	    // parts of route strings.
	    var optionalParam = /\((.*?)\)/g;
	    var namedParam = /(\(\?)?:\w+/g;
	    var splatParam = /\*\w+/g;
	    var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
	    this.compiledRoutes = Object.keys(routeDefs).map(function (routeExpr) {
	      // https://github.com/jashkenas/backbone/blob/d682061a/backbone.js#L1537-L1547
	      var expr = routeExpr.replace(escapeRegExp, '\\$&').replace(optionalParam, '(?:$1)?').replace(namedParam, function (match, optional) {
	        return optional ? match : '([^/?]+)';
	      }).replace(splatParam, '([^?]*?)');
	      expr = new RegExp('^' + expr + '(?:\\?([\\s\\S]*))?$');

	      // hook up route handler function
	      var handler = routeDefs[routeExpr];
	      if (typeof handler === 'string') {
	        // reference to another handler rather than its own function
	        handler = routeDefs[handler];
	      }

	      return { expr: expr, handler: handler };
	    });

	    var navigateToHash = function navigateToHash() {
	      return _this.navigate(routerWindow.location.hash);
	    };
	    routerWindow.addEventListener('popstate', function () {
	      return navigateToHash();
	    });

	    this.historyMethod = options.historyMethod || 'pushState';
	    var origChangeState = routerWindow.history[this.historyMethod];
	    routerWindow.history[this.historyMethod] = function () {
	      origChangeState.apply(routerWindow.history, arguments);
	      navigateToHash();
	    };
	  }

	  _createClass(Router, [{
	    key: 'navigate',
	    value: function navigate(fragment) {
	      var _this2 = this;

	      var stateUpdate = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	      fragment = stripHash(fragment);
	      if (fragment === this.app.state.$fragment && !Object.keys(stateUpdate).length) {
	        return;
	      }

	      stateUpdate.$fragment = fragment;
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = this.compiledRoutes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var route = _step.value;

	          var matches = route.expr.exec(fragment);
	          if (matches) {
	            var _ret = function () {
	              // extract params
	              // https://github.com/jashkenas/backbone/blob/d682061a/backbone.js#L1553-L1558
	              var params = matches.slice(1);
	              params = params.map(function (param, i) {
	                // Don't decode the search params.
	                if (i === params.length - 1) {
	                  return param || null;
	                }
	                return param ? decodeURIComponent(param) : null;
	              });

	              var routeHandler = route.handler;
	              if (!routeHandler) {
	                throw 'No route handler defined for #' + fragment;
	              }
	              var routeStateUpdate = routeHandler.call.apply(routeHandler, [_this2.app, stateUpdate].concat(_toConsumableArray(params)));
	              if (routeStateUpdate) {
	                // don't update if route handler returned a falsey result
	                _this2.app.update(Object.assign({}, stateUpdate, routeStateUpdate));
	              }
	              return {
	                v: void 0
	              };
	            }();

	            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	          }
	        }

	        // no route matched
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }

	      console.error('No route found matching #' + fragment);
	    }
	  }, {
	    key: 'replaceHash',
	    value: function replaceHash(fragment) {
	      fragment = stripHash(fragment);
	      if (fragment !== stripHash(this.window.location.hash)) {
	        this.window.history[this.historyMethod](null, null, '#' + fragment);
	      }
	    }
	  }]);

	  return Router;
	}();

	exports.default = Router;


	function stripHash(fragment) {
	  return fragment.replace(/^#*/, '');
	}

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	function _jade_template_fn(locals) {
	  locals = locals || {};;;
	  var result_of_with = (function($helpers, Boolean, apiSecret, event, on, where) {
	    var h = __webpack_require__(51);
	    return {
	      value: (h("div", {
	        "className": [].concat('segmentation').filter(Boolean).join(' '),
	      }, [h("div", {
	        "className": [].concat('apiSecret').filter(Boolean).join(' '),
	      }, [h("label", {
	        "htmlFor": "apiSecretInput",
	      }, ["Api secret:"]), h("input", {
	        "id": 'apiSecretInput',
	        "type": "text",
	        "placeholder": "Paste in your project API secret...",
	        "value": apiSecret,
	        "onkeyup": $helpers.apiSecretChanged,
	      }), ]), h("div", {
	        "className": [].concat('event').filter(Boolean).join(' '),
	      }, [h("label", {
	        "htmlFor": "eventInput",
	      }, ["Event name:"]), h("input", {
	        "id": 'eventInput',
	        "type": "text",
	        "name": "eventInput",
	        "placeholder": "Type an event name...",
	        "value": event,
	        "onkeyup": $helpers.eventChanged,
	      }), ]), h("div", {
	        "className": [].concat('filter').filter(Boolean).join(' '),
	      }, [h("label", {
	        "htmlFor": "filterInput",
	      }, ["Filter expression:"]), h("input", {
	        "id": 'filterInput',
	        "type": "text",
	        "placeholder": "Type an filter expression...",
	        "value": where,
	        "onkeyup": $helpers.filterChanged,
	      }), ]), h("div", {
	        "className": [].concat('segment').filter(Boolean).join(' '),
	      }, [h("label", {
	        "htmlFor": "segmentInput",
	      }, ["Segment expression:"]), h("input", {
	        "id": 'segmentInput',
	        "type": "text",
	        "placeholder": "Type a segment expression...",
	        "value": on,
	        "onkeyup": $helpers.segmentChanged,
	      }), ]), h("div", {
	        "id": 'chart',
	      }), ]))
	    };
	  }.call(this, "$helpers" in locals ? locals.$helpers : typeof $helpers !== "undefined" ? $helpers : undefined, "Boolean" in locals ? locals.Boolean : typeof Boolean !== "undefined" ? Boolean : undefined, "apiSecret" in locals ? locals.apiSecret : typeof apiSecret !== "undefined" ? apiSecret : undefined, "event" in locals ? locals.event : typeof event !== "undefined" ? event : undefined, "on" in locals ? locals.on : typeof on !== "undefined" ? on : undefined, "where" in locals ? locals.where : typeof where !== "undefined" ? where : undefined));
	  if (result_of_with) return result_of_with.value;
	}
	module.exports = _jade_template_fn;

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(73);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(75)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./node_modules/css-loader/index.js!./node_modules/autoprefixer-loader/index.js!./node_modules/stylus-loader/index.js!./app.styl", function() {
				var newContent = require("!!./node_modules/css-loader/index.js!./node_modules/autoprefixer-loader/index.js!./node_modules/stylus-loader/index.js!./app.styl");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(74)();
	// imports


	// module
	exports.push([module.id, "a {\n  cursor: pointer;\n  text-decoration: none;\n}\na,\na:visited {\n  color: #3b99f0;\n}\na:hover {\n  color: #4ba8ff;\n}\n.mp-font-title {\n  font-family: 'Proxima Nova', 'proxima-nova', sans-serif;\n  font-size: 18px;\n  font-weight: 700;\n  line-height: 1.4;\n  color: #4c6072;\n}\n.mp-font-subtitle {\n  font-family: 'Proxima Nova', 'proxima-nova', sans-serif;\n  font-size: 15px;\n  font-weight: 600;\n  line-height: 18px;\n  color: #4c6072;\n}\n.mp-font-list-item {\n  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;\n  font-size: 13px;\n  line-height: 1.7;\n  color: #6e859d;\n}\n.mp-font-paragraph {\n  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;\n  font-size: 14px;\n  font-weight: normal;\n  line-height: 18px;\n  color: #6e859d;\n}\n* {\n  -webkit-font-smoothing: antialiased;\n}\ninput[type=text],\ntextarea {\n  border: 1px solid #d8e0e7;\n  border-radius: 4px;\n  color: #6e859d;\n  display: inline-block;\n  font-size: 13px;\n  font-weight: 500;\n  -webkit-transition: border-color 150ms ease-out;\n  transition: border-color 150ms ease-out;\n}\ninput[type=text] ::-webkit-input-placeholder,\ntextarea ::-webkit-input-placeholder {\n  color: #9cacbb !important;\n  font-weight: 400 !important;\n}\ninput[type=text] ::-moz-placeholder,\ntextarea ::-moz-placeholder {\n  color: #9cacbb !important;\n  font-weight: 400 !important;\n}\ninput[type=text] :-ms-input-placeholder,\ntextarea :-ms-input-placeholder {\n  color: #9cacbb !important;\n  font-weight: 400 !important;\n}\ninput[type=text] ::placeholder,\ntextarea ::placeholder {\n  color: #9cacbb !important;\n  font-weight: 400 !important;\n}\ninput[type=text]:focus,\ntextarea:focus {\n  border-color: #3391e9;\n  -webkit-transition: border-color 250ms ease-in;\n  transition: border-color 250ms ease-in;\n}\n*:focus {\n  outline: 0;\n}\n*::-ms-clear {\n  height: 0;\n  width: 0;\n}\n", ""]);

	// exports


/***/ },
/* 74 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);