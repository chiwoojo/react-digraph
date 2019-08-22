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
exports.__esModule = true;
const LayoutEngine = /** @class */ (function() {
  function LayoutEngine(graphViewProps) {
    this.graphViewProps = graphViewProps;
  }
  LayoutEngine.prototype.calculatePosition = function(node) {
    return node;
  };
  LayoutEngine.prototype.adjustNodes = function(nodes, nodesMap) {
    let node = null;

    for (let i = 0; i < nodes.length; i++) {
      node = nodes[i];
      const position = this.calculatePosition({
        x: node.x || 0,
        y: node.y || 0,
      });

      node.x = position.x;
      node.y = position.y;
    }

    return nodes;
  };
  LayoutEngine.prototype.getPositionForNode = function(node) {
    return this.calculatePosition(node);
  };

  return LayoutEngine;
})();

exports['default'] = LayoutEngine;
