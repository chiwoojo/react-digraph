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
const layout_engine_1 = require('./layout-engine');
const SnapToGrid = /** @class */ (function(_super) {
  __extends(SnapToGrid, _super);

  function SnapToGrid() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  SnapToGrid.prototype.calculatePosition = function(node) {
    const x = node.x,
      y = node.y;
    let gridSpacing = this.graphViewProps.gridSpacing;

    gridSpacing = gridSpacing || 10;
    const gridOffset = gridSpacing / 2;
    let newX = x || 0;
    let newY = y || 0;

    if (x && (x - gridOffset) % gridSpacing !== 0) {
      // Add (gridSpacing / 2) to account for the dot rendering.
      // Now the center of the node is on a dot.
      var multiplier = 1;

      if ((x - gridOffset) % gridSpacing < gridOffset) {
        multiplier = -1;
      }

      newX =
        gridSpacing * Math.round(x / gridSpacing) + gridOffset * multiplier;
    }

    if (y && (y - gridOffset) % gridSpacing !== 0) {
      // Add (gridSpacing / 2) to account for the dot rendering.
      // Now the center of the node is on a dot.
      var multiplier = 1;

      if ((y - gridOffset) % gridSpacing < gridOffset) {
        multiplier = -1;
      }

      newY =
        gridSpacing * Math.round(y / gridSpacing) + gridOffset * multiplier;
    }

    return {
      x: newX,
      y: newY,
    };
  };

  return SnapToGrid;
})(layout_engine_1['default']);

exports['default'] = SnapToGrid;
