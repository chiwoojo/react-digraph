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
const NodeText = /** @class */ (function(_super) {
  __extends(NodeText, _super);

  function NodeText() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  NodeText.prototype.getTypeText = function(data, nodeTypes) {
    if (data.type && nodeTypes[data.type]) {
      return nodeTypes[data.type].typeText;
    } else if (nodeTypes.emptyNode) {
      return nodeTypes.emptyNode.typeText;
    } else {
      return null;
    }
  };
  NodeText.prototype.render = function() {
    const _a = this.props,
      data = _a.data,
      nodeTypes = _a.nodeTypes,
      isSelected = _a.isSelected,
      maxTitleChars = _a.maxTitleChars;
    const lineOffset = 18;
    const title = data.title;
    const className = graph_util_1['default'].classNames('node-text', {
      selected: isSelected,
    });
    const typeText = this.getTypeText(data, nodeTypes);

    return React.createElement(
      'text',
      { className: className, textAnchor: 'middle' },
      !!typeText && React.createElement('tspan', { opacity: '0.5' }, typeText),
      title &&
        React.createElement(
          'tspan',
          { x: 0, dy: lineOffset, fontSize: '10px' },
          title.length > maxTitleChars ? title.substr(0, maxTitleChars) : title
        ),
      title && React.createElement('title', null, title)
    );
  };

  return NodeText;
})(React.Component);

exports['default'] = NodeText;
