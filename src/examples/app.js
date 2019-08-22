'use strict';

/*
  Copyright(c) 2018 Uber Technologies, Inc.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

          http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
const __extends =
  (this && this.__extends) ||
  (function() {
    var extendStatics = function(d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function(d, b) {
            d.__proto__ = b;
          }) ||
        function(d, b) {
          for (const p in b) {
            if (b.hasOwnProperty(p)) {
              d[p] = b[p];
            }
          }
        };

      return extendStatics(d, b);
    };

    return function(d, b) {
      extendStatics(d, b);

      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();

exports.__esModule = true;
const React = require('react');
const ReactDOM = require('react-dom');
const react_router_dom_1 = require('react-router-dom');
const bwdl_1 = require('./bwdl');
const bwdl_editable_1 = require('./bwdl-editable');
const graph_1 = require('./graph');
const fast_1 = require('./fast');

require('./app.scss');
const App = /** @class */ (function(_super) {
  __extends(App, _super);

  function App() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  App.prototype.render = function() {
    return React.createElement(
      react_router_dom_1.BrowserRouter,
      null,
      React.createElement(
        'div',
        null,
        React.createElement(
          'header',
          { className: 'app-header' },
          React.createElement(
            'nav',
            null,
            React.createElement(
              react_router_dom_1.NavLink,
              { to: '/', exact: true, activeClassName: 'active' },
              'Home'
            ),
            React.createElement(
              react_router_dom_1.NavLink,
              { to: '/bwdl', activeClassName: 'active' },
              'BWDL'
            )
          )
        ),
        React.createElement(react_router_dom_1.Route, {
          exact: true,
          path: '/',
          component: graph_1['default'],
        }),
        React.createElement(
          react_router_dom_1.Switch,
          null,
          React.createElement(react_router_dom_1.Route, {
            path: '/bwdl',
            component: bwdl_1['default'],
          }),
          React.createElement(react_router_dom_1.Redirect, {
            from: '/bwld',
            to: '/bwdl',
          }),
          React.createElement(react_router_dom_1.Route, {
            path: '/bwdl-editable',
            component: bwdl_editable_1['default'],
          }),
          React.createElement(react_router_dom_1.Route, {
            path: '/fast',
            component: fast_1['default'],
          })
        )
      )
    );
  };

  return App;
})(React.Component);

if (typeof window !== 'undefined') {
  window.onload = function() {
    ReactDOM.render(
      React.createElement(App, null),
      document.getElementById('content')
    );
  };
}
