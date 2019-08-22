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
const Background = /** @class */ (function(_super) {
  __extends(Background, _super);

  function Background() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  Background.prototype.render = function() {
    const _a = this.props,
      gridSize = _a.gridSize,
      backgroundFillId = _a.backgroundFillId,
      renderBackground = _a.renderBackground;

    if (renderBackground != null) {
      return renderBackground(gridSize);
    }

    return React.createElement('rect', {
      className: 'background',
      x: -(gridSize || 0) / 4,
      y: -(gridSize || 0) / 4,
      width: gridSize,
      height: gridSize,
      fill: 'url(' + (backgroundFillId || '') + ')',
    });
  };
  Background.defaultProps = {
    backgroundFillId: '#grid',
    gridSize: 40960,
  };

  return Background;
})(React.Component);

exports['default'] = Background;
