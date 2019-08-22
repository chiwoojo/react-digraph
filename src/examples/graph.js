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
let __extends =
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
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
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
var __assign =
  (this && this.__assign) ||
  function() {
    __assign =
      Object.assign ||
      function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) {t[p] = s[p];}
        }

        return t;
      };

    return __assign.apply(this, arguments);
  };

exports.__esModule = true;
/*
  Example usage of GraphView component
*/
let React = require('react');
let __1 = require('../');
let graph_config_1 = require('./graph-config');
// NOTE: Edges must have 'source' & 'target' attributes
// In a more realistic use case, the graph would probably originate
// elsewhere in the App or be generated from some other state upstream of this component.
let sample = {
  edges: [
    {
      handleText: '5',
      handleTooltipText: '5',
      source: 'start1',
      target: 'a1',
      type: graph_config_1.SPECIAL_EDGE_TYPE,
    },
    {
      handleText: '5',
      handleTooltipText: 'This edge connects Node A and Node B',
      source: 'a1',
      target: 'a2',
      type: graph_config_1.SPECIAL_EDGE_TYPE,
    },
    {
      handleText: '54',
      source: 'a2',
      target: 'a4',
      type: graph_config_1.EMPTY_EDGE_TYPE,
    },
    {
      handleText: '54',
      source: 'a1',
      target: 'a3',
      type: graph_config_1.EMPTY_EDGE_TYPE,
    },
    {
      handleText: '54',
      source: 'a3',
      target: 'a4',
      type: graph_config_1.EMPTY_EDGE_TYPE,
    },
    {
      handleText: '54',
      source: 'a1',
      target: 'a5',
      type: graph_config_1.EMPTY_EDGE_TYPE,
    },
    {
      handleText: '54',
      source: 'a4',
      target: 'a1',
      type: graph_config_1.EMPTY_EDGE_TYPE,
    },
    {
      handleText: '54',
      source: 'a1',
      target: 'a6',
      type: graph_config_1.EMPTY_EDGE_TYPE,
    },
    {
      handleText: '24',
      source: 'a1',
      target: 'a7',
      type: graph_config_1.EMPTY_EDGE_TYPE,
    },
  ],
  nodes: [
    {
      id: 'start1',
      title: 'Start (0)',
      type: graph_config_1.SPECIAL_TYPE,
    },
    {
      id: 'a1',
      title: 'Node A (1)',
      type: graph_config_1.SPECIAL_TYPE,
      x: 258.3976135253906,
      y: 331.9783248901367,
    },
    {
      id: 'a2',
      subtype: graph_config_1.SPECIAL_CHILD_SUBTYPE,
      title: 'Node B (2)',
      type: graph_config_1.EMPTY_TYPE,
      x: 593.9393920898438,
      y: 260.6060791015625,
    },
    {
      id: 'a3',
      title: 'Node C (3)',
      type: graph_config_1.EMPTY_TYPE,
      x: 237.5757598876953,
      y: 61.81818389892578,
    },
    {
      id: 'a4',
      title: 'Node D (4)',
      type: graph_config_1.EMPTY_TYPE,
      x: 600.5757598876953,
      y: 600.81818389892578,
    },
    {
      id: 'a5',
      title: 'Node E (5)',
      type: null,
      x: 50.5757598876953,
      y: 500.81818389892578,
    },
    {
      id: 'a6',
      title: 'Node E (6)',
      type: graph_config_1.SKINNY_TYPE,
      x: 300,
      y: 600,
    },
    {
      id: 'a7',
      title: 'Node F (7)',
      type: graph_config_1.POLY_TYPE,
      x: 0,
      y: 300,
    },
    {
      id: 'a8',
      title: 'Node G (8)',
      type: graph_config_1.COMPLEX_CIRCLE_TYPE,
      x: -200,
      y: 400,
    },
  ],
};

function generateSample(totalNodes) {
  let generatedSample = {
    edges: [],
    nodes: [],
  };
  var y = 0;
  var x = 0;
  let numNodes = totalNodes ? totalNodes : 0;

  // generate large array of nodes
  // These loops are fast enough. 1000 nodes = .45ms + .34ms
  // 2000 nodes = .86ms + .68ms
  // implying a linear relationship with number of nodes.
  for (var i = 1; i <= numNodes; i++) {
    if (i % 20 === 0) {
      y++;
      x = 0;
    } else {
      x++;
    }

    generatedSample.nodes.push({
      id: 'a' + i,
      title: 'Node ' + i,
      type:
        graph_config_1.nodeTypes[
          Math.floor(graph_config_1.nodeTypes.length * Math.random())
        ],
      x: 0 + 200 * x,
      y: 0 + 200 * y,
    });
  }
  // link each node to another node
  for (var i = 1; i < numNodes; i++) {
    generatedSample.edges.push({
      source: 'a' + i,
      target: 'a' + (i + 1),
      type:
        graph_config_1.edgeTypes[
          Math.floor(graph_config_1.edgeTypes.length * Math.random())
        ],
    }

  }
  return generatedSample;
}
let Graph = /** @class */ (function(_super) {
  __extends(Graph, _super);

  function Graph(props) {
    let _this = _super.call(this, props) || this;

    _this.makeItLarge = function() {
      var graph = _this.state.graph;
      var generatedSample = generateSample(_this.state.totalNodes);

      graph.nodes = generatedSample.nodes;
      graph.edges = generatedSample.edges;
      _this.setState(_this.state);
    };
    _this.addStartNode = function() {
      let graph = _this.state.graph;

      // using a new array like this creates a new memory reference
      // this will force a re-render
      graph.nodes = [
        {
          id: Date.now(),
          title: 'Node A',
          type: graph_config_1.SPECIAL_TYPE,
          x: 0,
          y: 0,
        },
      ].concat(_this.state.graph.nodes);
      _this.setState({
        graph: graph,
      });
    };
    _this.deleteStartNode = function() {
      let graph = _this.state.graph;

      graph.nodes.splice(0, 1);
      // using a new array like this creates a new memory reference
      // this will force a re-render
      graph.nodes = _this.state.graph.nodes.slice();
      _this.setState({
        graph: graph,
      });
    };
    _this.handleChange = function(event) {
      _this.setState(
        {
          totalNodes: parseInt(event.target.value || '0', 10),
        },
        _this.makeItLarge
      );
    };
    /*
     * Handlers/Interaction
     */
    // Called by 'drag' handler, etc..
    // to sync updates from D3 with the graph
    _this.onUpdateNode = function(viewNode) {
      var graph = _this.state.graph;
      let i = _this.getNodeIndex(viewNode);

      graph.nodes[i] = viewNode;
      _this.setState({ graph: graph });
    };
    // Node 'mouseUp' handler
    _this.onSelectNode = function(viewNode) {
      // Deselect events will send Null viewNode
      _this.setState({ selected: viewNode });
    };
    // Edge 'mouseUp' handler
    _this.onSelectEdge = function(viewEdge) {
      _this.setState({ selected: viewEdge });
    };
    // Updates the graph with a new node
    _this.onCreateNode = function(x, y) {
      let graph = _this.state.graph;
      // This is just an example - any sort of logic
      // could be used here to determine node type
      // There is also support for subtypes. (see 'sample' above)
      // The subtype geometry will underlay the 'type' geometry for a node
      var type =
        Math.random() < 0.25
          ? graph_config_1.SPECIAL_TYPE
          : graph_config_1.EMPTY_TYPE;
      var viewNode = {
        id: Date.now(),
        title: '',
        type: type,
        x: x,
        y: y,
      };

      graph.nodes = graph.nodes.concat([viewNode]);
      _this.setState({ graph: graph });
    };
    // Deletes a node from the graph
    _this.onDeleteNode = function(viewNode, nodeId, nodeArr) {
      var graph = _this.state.graph;
      // Delete any connected edges
      var newEdges = graph.edges.filter(function(edge, i) {
        return (
          edge.source !== viewNode[graph_config_1.NODE_KEY] &&
          edge.target !== viewNode[graph_config_1.NODE_KEY]
        );

      });
      graph.nodes = nodeArr;
      graph.edges = newEdges;
      _this.setState({ graph: graph, selected: null });
    };
    // Creates a new node between two edges
    _this.onCreateEdge = function(sourceViewNode, targetViewNode) {
      var graph = _this.state.graph;
      // This is just an example - any sort of logic
      // could be used here to determine edge type
      var type =
        sourceViewNode.type === graph_config_1.SPECIAL_TYPE
          ? graph_config_1.SPECIAL_EDGE_TYPE
          : graph_config_1.EMPTY_EDGE_TYPE;
      var viewEdge = {
        source: sourceViewNode[graph_config_1.NODE_KEY],
        target: targetViewNode[graph_config_1.NODE_KEY],
        type: type,
      };

      // Only add the edge when the source node is not the same as the target
      if (viewEdge.source !== viewEdge.target) {
        graph.edges = graph.edges.concat([viewEdge]);
        _this.setState({
          graph: graph,
          selected: viewEdge,
        });
      }
    };
    // Called when an edge is reattached to a different target.
    _this.onSwapEdge = function(sourceViewNode, targetViewNode, viewEdge) {
      var graph = _this.state.graph;
      let i = _this.getEdgeIndex(viewEdge);
      var edge = JSON.parse(JSON.stringify(graph.edges[i]));

      edge.source = sourceViewNode[graph_config_1.NODE_KEY];
      edge.target = targetViewNode[graph_config_1.NODE_KEY];
      graph.edges[i] = edge;
      // reassign the array reference if you want the graph to re-render a swapped edge
      graph.edges = graph.edges.slice();
      _this.setState({
        graph: graph,
        selected: edge,
      });
    };
    // Called when an edge is deleted
    _this.onDeleteEdge = function(viewEdge, edges) {
      let graph = _this.state.graph;

      graph.edges = edges;
      _this.setState({
        graph: graph,
        selected: null,
      });
    };
    _this.onUndo = function() {
      // Not implemented
      console.warn('Undo is not currently implemented in the example.');
      // Normally any add, remove, or update would record the action in an array.
      // In order to undo it one would simply call the inverse of the action performed. For instance, if someone
      // called onDeleteEdge with (viewEdge, i, edges) then an undelete would be a splicing the original viewEdge
      // into the edges array at position i.
    };
    _this.onCopySelected = function() {
      if (_this.state.selected.source) {
        console.warn(
          'Cannot copy selected edges, try selecting a node instead.'
        );
        return;
      }

      let x = _this.state.selected.x + 10;
      var y = _this.state.selected.y + 10;

      _this.setState({
        copiedNode: __assign({}, _this.state.selected, { x: x, y: y }),
      });
    };
    _this.onPasteSelected = function() {
      if (!_this.state.copiedNode) {
        console.warn(
          'No node is currently in the copy queue. Try selecting a node and copying it with Ctrl/Command-C'
        );
      }
      let graph = _this.state.graph;
      let newNode = __assign({}, _this.state.copiedNode, { id: Date.now() });

      graph.nodes = graph.nodes.concat([newNode]);
      _this.forceUpdate();
    };
    _this.handleChangeLayoutEngineType = function(event) {
      _this.setState({
        layoutEngineType: event.target.value,
      });
    };
    _this.onSelectPanNode = function(event) {
      if (_this.GraphView) {
        _this.GraphView.panToNode(event.target.value, true);
      }
    };
    _this.state = {
      copiedNode: null,
      graph: sample,
      layoutEngineType: undefined,
      selected: null,
      totalNodes: sample.nodes.length,
    };
    _this.GraphView = React.createRef();

    return _this;
  }
  // Helper to find the index of a given node
  Graph.prototype.getNodeIndex = function(searchNode) {
    return this.state.graph.nodes.findIndex(function(node) {
      return (
        node[graph_config_1.NODE_KEY] === searchNode[graph_config_1.NODE_KEY]
      );
    });
  };
  // Helper to find the index of a given edge
  Graph.prototype.getEdgeIndex = function(searchEdge) {
    return this.state.graph.edges.findIndex(function(edge) {
      return (
        edge.source === searchEdge.source && edge.target === searchEdge.target
      );
    });
  };
  // Given a nodeKey, return the corresponding node
  Graph.prototype.getViewNode = function(nodeKey) {
    var searchNode = {};

    searchNode[graph_config_1.NODE_KEY] = nodeKey;
    let i = this.getNodeIndex(searchNode);

    return this.state.graph.nodes[i];
  };
  /*
   * Render
   */
  Graph.prototype.render = function() {
    let _this = this;
    var _a = this.state.graph,
      nodes = _a.nodes,
      edges = _a.edges;
    var selected = this.state.selected;
    var NodeTypes = graph_config_1['default'].NodeTypes,
      NodeSubtypes = graph_config_1['default'].NodeSubtypes,
      EdgeTypes = graph_config_1['default'].EdgeTypes;

    return React.createElement(
      'div',
      { id: 'graph' },
      React.createElement(
        'div',
        { className: 'graph-header' },
        React.createElement(
          'button',
          { onClick: this.addStartNode },
          'Add Node'
        ),
        React.createElement(
          'button',
          { onClick: this.deleteStartNode },
          'Delete Node'
        ),
        React.createElement('input', {
          className: 'total-nodes',
          type: 'number',
          onBlur: this.handleChange,
          placeholder: this.state.totalNodes.toString(),
        }),
        React.createElement(
          'div',
          { className: 'layout-engine' },
          React.createElement('span', null, 'Layout Engine:'),
          React.createElement(
            'select',
            {
              name: 'layout-engine-type',
              onChange: this.handleChangeLayoutEngineType,
            },
            React.createElement('option', { value: undefined }, 'None'),
            React.createElement(
              'option',
              { value: 'SnapToGrid' },
              'Snap to Grid'
            ),
            React.createElement(
              'option',
              { value: 'VerticalTree' },
              'Vertical Tree'
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'pan-list' },
          React.createElement('span', null, 'Pan To:'),
          React.createElement(
            'select',
            { onChange: this.onSelectPanNode },
            nodes.map(function(node) {
              return React.createElement(
                'option',
                {
                  key: node[graph_config_1.NODE_KEY],
                  value: node[graph_config_1.NODE_KEY],
                },
                node.title
              );
            })
          )
        )
      ),
      React.createElement(__1.GraphView, {
        ref: function(el) {
          return (_this.GraphView = el);
        },
        nodeKey: graph_config_1.NODE_KEY,
        nodes: nodes,
        edges: edges,
        selected: selected,
        nodeTypes: NodeTypes,
        nodeSubtypes: NodeSubtypes,
        edgeTypes: EdgeTypes,
        onSelectNode: this.onSelectNode,
        onCreateNode: this.onCreateNode,
        onUpdateNode: this.onUpdateNode,
        onDeleteNode: this.onDeleteNode,
        onSelectEdge: this.onSelectEdge,
        onCreateEdge: this.onCreateEdge,
        onSwapEdge: this.onSwapEdge,
        onDeleteEdge: this.onDeleteEdge,
        onUndo: this.onUndo,
        onCopySelected: this.onCopySelected,
        onPasteSelected: this.onPasteSelected,
        layoutEngineType: this.state.layoutEngineType,
      })
    );

  };
  return Graph;
})(React.Component);

exports['default'] = Graph;
