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
const arrowhead_marker_1 = require('./arrowhead-marker');
const background_pattern_1 = require('./background-pattern');
const dropshadow_filter_1 = require('./dropshadow-filter');
const Defs = /** @class */ (function(_super) {
  __extends(Defs, _super);

  function Defs(props) {
    const _this = _super.call(this, props) || this;

    _this.state = {
      graphConfigDefs: [],
    };

    return _this;
  }
  Defs.getDerivedStateFromProps = function(nextProps, prevState) {
    const graphConfigDefs = [];

    Defs.processGraphConfigDefs(nextProps.nodeTypes, graphConfigDefs);
    Defs.processGraphConfigDefs(nextProps.nodeSubtypes, graphConfigDefs);
    Defs.processGraphConfigDefs(nextProps.edgeTypes, graphConfigDefs);

    return {
      graphConfigDefs: graphConfigDefs,
    };
  };
  Defs.processGraphConfigDefs = function(typesObj, graphConfigDefs) {
    Object.keys(typesObj).forEach(function(type) {
      const safeId = typesObj[type].shapeId
        ? typesObj[type].shapeId.replace('#', '')
        : 'graphdef';

      graphConfigDefs.push(
        React.cloneElement(typesObj[type].shape, {
          key: safeId + '-' + (graphConfigDefs.length + 1),
        })
      );
    });
  };
  Defs.prototype.render = function() {
    const _a = this.props,
      edgeArrowSize = _a.edgeArrowSize,
      gridSpacing = _a.gridSpacing,
      gridDotSize = _a.gridDotSize;

    return React.createElement(
      'defs',
      null,
      this.state.graphConfigDefs,
      React.createElement(arrowhead_marker_1['default'], {
        edgeArrowSize: edgeArrowSize,
      }),
      React.createElement(background_pattern_1['default'], {
        gridSpacing: gridSpacing,
        gridDotSize: gridDotSize,
      }),
      React.createElement(dropshadow_filter_1['default'], null),
      this.props.renderDefs && this.props.renderDefs()
    );
  };
  Defs.defaultProps = {
    gridDotSize: 2,
    renderDefs: function() {
      return null;
    },
  };

  return Defs;
})(React.Component);

exports['default'] = Defs;
