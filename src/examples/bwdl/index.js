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
const react_ace_1 = require('react-ace');

require('brace/mode/json');
require('brace/theme/monokai');
const graph_view_1 = require('../../components/graph-view');
const bwdl_transformer_1 = require('../../utilities/transformers/bwdl-transformer');
const sidebar_1 = require('../sidebar');
const bwdl_config_1 = require('./bwdl-config'); // Configures node/edge types
const bwdl_example_data_1 = require('./bwdl-example-data');
const bwdl_node_form_1 = require('./bwdl-node-form');
const Bwdl = /** @class */ (function(_super) {
  __extends(Bwdl, _super);

  function Bwdl(props) {
    const _this = _super.call(this, props) || this;

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
    _this.onSelectNode = function(node) {
      _this.setState({
        selected: node,
        selectedBwdlNode: node ? _this.state.bwdlJson.States[node.title] : null,
      });
    };
    _this.onCreateNode = function() {
      return;
    };
    _this.onUpdateNode = function() {
      return;
    };
    _this.onDeleteNode = function() {
      return;
    };
    _this.onSelectEdge = function() {
      return;
    };
    _this.onCreateEdge = function() {
      return;
    };
    _this.onSwapEdge = function() {
      return;
    };
    _this.onDeleteEdge = function() {
      return;
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
      selectedBwdlNode: null,
    };

    return _this;
  }
  Bwdl.prototype.renderLeftSidebar = function() {
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
  Bwdl.prototype.renderRightSidebar = function() {
    if (!this.state.selected) {
      return null;
    }

    return React.createElement(
      sidebar_1['default'],
      { direction: 'right', size: '100%' },
      React.createElement(
        'div',
        { className: 'selected-node-container' },
        React.createElement(bwdl_node_form_1['default'], {
          bwdlNode: this.state.selectedBwdlNode,
          bwdlNodeKey: this.state.selected.title,
          nextChoices: Object.keys(this.state.bwdlJson.States),
        })
      )
    );
  };
  Bwdl.prototype.renderGraph = function() {
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
      readOnly: true,
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
      layoutEngineType: this.state.layoutEngineType,
    });
  };
  Bwdl.prototype.render = function() {
    return React.createElement(
      'div',
      { id: 'bwdl-graph' },
      this.renderLeftSidebar(),
      React.createElement(
        'div',
        { className: 'graph-container' },
        this.renderGraph()
      ),
      this.state.selected && this.renderRightSidebar()
    );
  };

  return Bwdl;
})(React.Component);

exports['default'] = Bwdl;
