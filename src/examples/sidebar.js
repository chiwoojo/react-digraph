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
const graph_util_1 = require('../utilities/graph-util');
const sidebarClass = {
  CLOSED: 'closed',
  OPEN: 'open',
};
const directionOpposites = {
  down: 'up',
  left: 'right',
  right: 'left',
  up: 'down',
};
const Sidebar = /** @class */ (function(_super) {
  __extends(Sidebar, _super);

  function Sidebar(props) {
    const _this = _super.call(this, props) || this;

    _this.toggleContainer = function() {
      const originalValue = _this.state.sidebarClass;
      let newValue = sidebarClass.CLOSED;

      if (originalValue === newValue) {
        newValue = sidebarClass.OPEN;
      }

      _this.setState({
        sidebarClass: newValue,
      });
    };
    _this.state = {
      sidebarClass: sidebarClass.OPEN,
    };

    return _this;
  }
  Sidebar.prototype.getContainerClasses = function() {
    const classes = ['sidebar-main-container'];

    classes.push(this.state.sidebarClass || '');

    return graph_util_1['default'].classNames(classes);
  };
  Sidebar.prototype.getContainerStyle = function(size, direction) {
    if (direction === 'up' || direction === 'down') {
      return { height: '' + size, maxHeight: '' + size };
    }

    return { width: '' + size, maxWidth: '' + size };
  };
  Sidebar.prototype.getArrowIconClasses = function(direction) {
    const classes = ['icon'];

    if (this.state.sidebarClass === sidebarClass.CLOSED) {
      classes.push('icon_' + directionOpposites[direction] + '-arrow');
    } else {
      classes.push('icon_' + direction + '-arrow');
    }

    return graph_util_1['default'].classNames(classes);
  };
  Sidebar.prototype.renderToggleBar = function(direction) {
    return React.createElement(
      'div',
      { className: 'sidebar-toggle-bar', onClick: this.toggleContainer },
      React.createElement('i', {
        className: this.getArrowIconClasses(direction),
      })
    );
  };
  Sidebar.prototype.render = function() {
    const _a = this.props,
      children = _a.children,
      direction = _a.direction,
      size = _a.size;
    const sidebarClassName = graph_util_1['default'].classNames(
      'sidebar',
      direction
    );

    return React.createElement(
      'div',
      { className: sidebarClassName },
      React.createElement(
        'div',
        {
          className: this.getContainerClasses(),
          style: this.getContainerStyle(size, direction),
        },
        children
      ),
      React.createElement(
        'div',
        { className: 'sidebar-toggle-bar', onClick: this.toggleContainer },
        React.createElement('i', {
          className: this.getArrowIconClasses(direction),
        })
      )
    );
  };
  Sidebar.defaultProps = {
    direction: 'left',
    size: '130px',
  };

  return Sidebar;
})(React.Component);

exports['default'] = Sidebar;
