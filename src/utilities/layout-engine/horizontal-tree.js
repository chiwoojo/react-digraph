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
const dagre = require('dagre');
const snap_to_grid_1 = require('./snap-to-grid');
const HorizontalTree = /** @class */ (function(_super) {
  __extends(HorizontalTree, _super);

  function HorizontalTree() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  HorizontalTree.prototype.adjustNodes = function(nodes, nodesMap) {
    const _a = this.graphViewProps,
      nodeKey = _a.nodeKey,
      nodeSize = _a.nodeSize;
    const size = (nodeSize || 1) * 1.5;
    const g = new dagre.graphlib.Graph();

    g.setGraph({ rankdir: 'LR' });
    g.setDefaultEdgeLabel(function() {
      return {};
    });
    nodes.forEach(function(node) {
      if (!nodesMap) {
        return;
      }

      const nodeId = node[nodeKey];
      const nodeKeyId = 'key-' + nodeId;
      const nodesMapNode = nodesMap[nodeKeyId];

      // prevent disconnected nodes from being part of the graph
      if (
        nodesMapNode.incomingEdges.length === 0 &&
        nodesMapNode.outgoingEdges.length === 0
      ) {
        return;
      }

      g.setNode(nodeKeyId, { width: size, height: size });
      nodesMapNode.outgoingEdges.forEach(function(edge) {
        g.setEdge(nodeKeyId, 'key-' + edge.target);
      });
    });
    dagre.layout(g);
    g.nodes().forEach(function(gNodeId) {
      const nodesMapNode = nodesMap[gNodeId];
      // gNode is the dagre representation
      const gNode = g.node(gNodeId);

      nodesMapNode.node.x = gNode.x;
      nodesMapNode.node.y = gNode.y;
    });

    return nodes;
  };

  return HorizontalTree;
})(snap_to_grid_1['default']);

exports['default'] = HorizontalTree;
