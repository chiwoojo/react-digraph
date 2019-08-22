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
var __assign =
  (this && this.__assign) ||
  function() {
    __assign =
      Object.assign ||
      function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (const p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) {
              t[p] = s[p];
            }
          }
        }

        return t;
      };

    return __assign.apply(this, arguments);
  };

exports.__esModule = true;
const React = require('react');
const react_ace_1 = require('react-ace');

require('brace/mode/json');
require('brace/theme/monokai');
const graph_view_1 = require('../../components/graph-view');
const bwdl_transformer_1 = require('../../utilities/transformers/bwdl-transformer');
const sidebar_1 = require('../sidebar');
const bwdl_config_1 = require('./bwdl-config'); // Configures node/edge types
const bwdl_example_data_1 = require('./bwdl-example-data');
const BwdlEditable = /** @class */ (function(_super) {
  __extends(BwdlEditable, _super);

  function BwdlEditable(props) {
    const _this = _super.call(this, props) || this;

    _this.onSelectNode = function(node) {
      _this.setState({
        selected: node,
      });
    };
    _this.onCreateNode = function(x, y) {
      const newBwdlJson = __assign({}, _this.state.bwdlJson);

      newBwdlJson.States['New Item ' + Date.now()] = {
        Type: bwdl_config_1.EMPTY_TYPE,
        x: x,
        y: y,
      };
      _this.setState({
        bwdlJson: newBwdlJson,
        bwdlText: JSON.stringify(newBwdlJson, null, 2),
      });
      _this.updateBwdl();
    };
    _this.onUpdateNode = function(node) {
      return;
    };
    _this.onDeleteNode = function(selected, nodeId, nodes) {
      const newBwdlJson = __assign({}, _this.state.bwdlJson);

      delete newBwdlJson.States[selected.title];
      _this.setState({
        bwdlJson: newBwdlJson,
        bwdlText: JSON.stringify(newBwdlJson, null, 2),
      });
      _this.updateBwdl();
    };
    _this.onSelectEdge = function(edge) {
      _this.setState({
        selected: edge,
      });
    };
    _this.onCreateEdge = function(sourceNode, targetNode) {
      _this.linkEdge(sourceNode, targetNode);
    };
    _this.onSwapEdge = function(sourceNode, targetNode, edge) {
      _this.linkEdge(sourceNode, targetNode, edge);
    };
    _this.onDeleteEdge = function(selectedEdge, edges) {
      const newBwdlJson = __assign({}, _this.state.bwdlJson);
      const sourceNodeBwdl = newBwdlJson.States[selectedEdge.source];

      if (sourceNodeBwdl.Choices) {
        sourceNodeBwdl.Choices = sourceNodeBwdl.Choices.filter(function(
          choice
        ) {
          return choice.Next !== selectedEdge.target;
        });
      } else {
        delete sourceNodeBwdl.Next;
      }

      _this.setState({
        bwdlJson: newBwdlJson,
        bwdlText: JSON.stringify(newBwdlJson, null, 2),
      });
      _this.updateBwdl();
    };
    _this.onCopySelected = function() {
      const _a = _this.state,
        selected = _a.selected,
        bwdlJson = _a.bwdlJson;

      if (!selected) {
        return;
      }

      const original = bwdlJson.States[selected.title];
      const newItem = JSON.parse(JSON.stringify(original));

      _this.setState({
        copiedNode: newItem,
      });
    };
    _this.onPasteSelected = function() {
      const _a = _this.state,
        copiedNode = _a.copiedNode,
        bwdlJson = _a.bwdlJson;

      bwdlJson.States['New Item ' + Date.now()] = copiedNode;
      const newBwdlJson = __assign({}, bwdlJson);

      _this.setState({
        bwdlJson: newBwdlJson,
        bwdlText: JSON.stringify(newBwdlJson, null, 2),
      });
      _this.updateBwdl();
    };
    _this.updateBwdl = function() {
      const transformed = bwdl_transformer_1['default'].transform(
        _this.state.bwdlJson
      );

      _this.setState({
        edges: transformed.edges,
        nodes: transformed.nodes,
      });
    };
    _this.handleTextAreaChange = function(value, event) {
      let input = null;
      const bwdlText = value;

      _this.setState({
        bwdlText: bwdlText,
      });
      try {
        input = JSON.parse(bwdlText);
      } catch (e) {
        return;
      }
      _this.setState({
        bwdlJson: input,
      });
      _this.updateBwdl();
    };
    const transformed = bwdl_transformer_1['default'].transform(
      bwdl_example_data_1['default']
    );

    _this.state = {
      bwdlJson: bwdl_example_data_1['default'],
      bwdlText: JSON.stringify(bwdl_example_data_1['default'], null, 2),
      copiedNode: null,
      edges: transformed.edges,
      layoutEngineType: 'VerticalTree',
      nodes: transformed.nodes,
      selected: null,
    };

    return _this;
  }
  BwdlEditable.prototype.linkEdge = function(sourceNode, targetNode, edge) {
    const newBwdlJson = __assign({}, this.state.bwdlJson);
    const sourceNodeBwdl = newBwdlJson.States[sourceNode.title];

    if (sourceNodeBwdl.Type === 'Choice') {
      const newChoice = {
        Next: targetNode.title,
      };

      if (sourceNodeBwdl.Choices) {
        // check if swapping edge
        let swapped_1 = false;

        if (edge) {
          sourceNodeBwdl.Choices.forEach(function(choice) {
            if (edge && choice.Next === edge.target) {
              choice.Next = targetNode.title;
              swapped_1 = true;
            }
          });
        }

        if (!swapped_1) {
          sourceNodeBwdl.Choices.push(newChoice);
        }
      } else {
        sourceNodeBwdl.Choices = [newChoice];
      }
    } else {
      sourceNodeBwdl.Next = targetNode.title;
    }

    this.setState({
      bwdlJson: newBwdlJson,
      bwdlText: JSON.stringify(newBwdlJson, null, 2),
    });
    this.updateBwdl();
  };
  BwdlEditable.prototype.onUndo = function() {
    alert('Undo is not supported yet.');
  };
  BwdlEditable.prototype.renderSidebar = function() {
    return React.createElement(
      sidebar_1['default'],
      { direction: 'left', size: '100%' },
      React.createElement(
        'div',
        null,
        React.createElement(react_ace_1['default'], {
          mode: 'json',
          theme: 'monokai',
          onChange: this.handleTextAreaChange,
          name: 'bwdl-editor',
          width: '100%',
          height: '100%',
          fontSize: 14,
          editorProps: { $blockScrolling: true },
          highlightActiveLine: true,
          showPrintMargin: true,
          showGutter: true,
          setOptions: {
            showLineNumbers: true,
            tabSize: 2,
          },
          value: this.state.bwdlText,
        })
      )
    );
  };
  BwdlEditable.prototype.renderGraph = function() {
    const _this = this;
    const _a = this.state,
      nodes = _a.nodes,
      edges = _a.edges,
      selected = _a.selected;
    const NodeTypes = bwdl_config_1['default'].NodeTypes,
      NodeSubtypes = bwdl_config_1['default'].NodeSubtypes,
      EdgeTypes = bwdl_config_1['default'].EdgeTypes;

    return React.createElement(graph_view_1['default'], {
      ref: function(el) {
        return (_this.GraphView = el);
      },
      nodeKey: bwdl_config_1.NODE_KEY,
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
    });
  };
  BwdlEditable.prototype.render = function() {
    return React.createElement(
      'div',
      { id: 'bwdl-editable-graph' },
      this.renderSidebar(),
      React.createElement(
        'div',
        { className: 'graph-container' },
        this.renderGraph()
      )
    );
  };

  return BwdlEditable;
})(React.Component);

exports['default'] = BwdlEditable;
