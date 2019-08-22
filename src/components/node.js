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
const d3 = require('d3');
const React = require('react');
const edge_1 = require('./edge');
const graph_util_1 = require('../utilities/graph-util');
const node_text_1 = require('./node-text');
const Node = /** @class */ (function(_super) {
  __extends(Node, _super);

  function Node(props) {
    const _this = _super.call(this, props) || this;

    _this.handleMouseMove = function() {
      const mouseButtonDown = d3.event.sourceEvent.buttons === 1;
      const shiftKey = d3.event.sourceEvent.shiftKey;
      const _a = _this.props,
        nodeSize = _a.nodeSize,
        layoutEngine = _a.layoutEngine,
        nodeKey = _a.nodeKey,
        viewWrapperElem = _a.viewWrapperElem;

      if (!mouseButtonDown) {
        return;
      }

      // While the mouse is down, this function handles all mouse movement
      const newState = {
        x: d3.event.x,
        y: d3.event.y,
        pointerOffset: undefined,
      };

      if (!_this.props.centerNodeOnMove) {
        newState.pointerOffset = _this.state.pointerOffset || {
          x: d3.event.x - _this.props.data.x,
          y: d3.event.y - _this.props.data.y,
        };
        newState.x -= newState.pointerOffset.x;
        newState.y -= newState.pointerOffset.y;
      }

      if (shiftKey) {
        _this.setState({ drawingEdge: true });
        // draw edge
        // undo the target offset subtraction done by Edge
        const off = edge_1['default'].calculateOffset(
          nodeSize,
          _this.props.data,
          newState,
          nodeKey,
          true,
          viewWrapperElem
        );

        newState.x += off.xOff;
        newState.y += off.yOff;
        // now tell the graph that we're actually drawing an edge
      } else if (!_this.state.drawingEdge && layoutEngine) {
        // move node using the layout engine
        Object.assign(newState, layoutEngine.getPositionForNode(newState));
      }

      _this.setState(newState);
      // Never use this.props.index because if the nodes array changes order
      // then this function could move the wrong node.
      _this.props.onNodeMove(newState, _this.props.data[nodeKey], shiftKey);
    };
    _this.handleDragStart = function() {
      if (!_this.nodeRef.current) {
        return;
      }

      if (!_this.oldSibling) {
        _this.oldSibling = _this.nodeRef.current.parentElement.nextSibling;
      }

      // Moves child to the end of the element stack to re-arrange the z-index
      _this.nodeRef.current.parentElement.parentElement.appendChild(
        _this.nodeRef.current.parentElement
      );
    };
    _this.handleDragEnd = function() {
      if (!_this.nodeRef.current) {
        return;
      }

      const _a = _this.state,
        x = _a.x,
        y = _a.y,
        drawingEdge = _a.drawingEdge;
      const _b = _this.props,
        data = _b.data,
        nodeKey = _b.nodeKey,
        onNodeSelected = _b.onNodeSelected,
        onNodeUpdate = _b.onNodeUpdate;
      const sourceEvent = d3.event.sourceEvent;

      _this.setState({
        mouseDown: false,
        drawingEdge: false,
        pointerOffset: null,
      });

      if (_this.oldSibling && _this.oldSibling.parentElement) {
        _this.oldSibling.parentElement.insertBefore(
          _this.nodeRef.current.parentElement,
          _this.oldSibling
        );
      }

      const shiftKey = sourceEvent.shiftKey;

      onNodeUpdate({ x: x, y: y }, data[nodeKey], shiftKey || drawingEdge);
      onNodeSelected(data, data[nodeKey], shiftKey || drawingEdge, sourceEvent);
    };
    _this.handleMouseOver = function(event) {
      // Detect if mouse is already down and do nothing.
      let hovered = false;

      if (
        (d3.event && d3.event.buttons !== 1) ||
        (event && event.buttons !== 1)
      ) {
        hovered = true;
        _this.setState({ hovered: hovered });
      }

      _this.props.onNodeMouseEnter(event, _this.props.data, hovered);
    };
    _this.handleMouseOut = function(event) {
      // Detect if mouse is already down and do nothing. Sometimes the system lags on
      // drag and we don't want the mouseOut to fire while the user is moving the
      // node around
      _this.setState({ hovered: false });
      _this.props.onNodeMouseLeave(event, _this.props.data);
    };
    _this.state = {
      drawingEdge: false,
      hovered: false,
      mouseDown: false,
      selected: false,
      x: props.data.x || 0,
      y: props.data.y || 0,
      pointerOffset: null,
    };
    _this.nodeRef = React.createRef();

    return _this;
  }
  Node.getDerivedStateFromProps = function(nextProps, prevState) {
    return {
      selected: nextProps.isSelected,
      x: nextProps.data.x,
      y: nextProps.data.y,
    };
  };
  Node.prototype.componentDidMount = function() {
    const dragFunction = d3
      .drag()
      .on('drag', this.handleMouseMove)
      .on('start', this.handleDragStart)
      .on('end', this.handleDragEnd);

    d3.select(this.nodeRef.current)
      .on('mouseout', this.handleMouseOut)
      .call(dragFunction);
  };
  Node.getNodeTypeXlinkHref = function(data, nodeTypes) {
    if (data.type && nodeTypes[data.type]) {
      return nodeTypes[data.type].shapeId;
    } else if (nodeTypes.emptyNode) {
      return nodeTypes.emptyNode.shapeId;
    }

    return null;
  };
  Node.getNodeSubtypeXlinkHref = function(data, nodeSubtypes) {
    if (data.subtype && nodeSubtypes && nodeSubtypes[data.subtype]) {
      return nodeSubtypes[data.subtype].shapeId;
    } else if (nodeSubtypes && nodeSubtypes.emptyNode) {
      return nodeSubtypes.emptyNode.shapeId;
    }

    return null;
  };
  Node.prototype.renderShape = function() {
    const _a = this.props,
      renderNode = _a.renderNode,
      data = _a.data,
      index = _a.index,
      nodeTypes = _a.nodeTypes,
      nodeSubtypes = _a.nodeSubtypes,
      nodeKey = _a.nodeKey;
    const _b = this.state,
      hovered = _b.hovered,
      selected = _b.selected;
    const props = {
      height: this.props.nodeSize || 0,
      width: this.props.nodeSize || 0,
    };
    const nodeShapeContainerClassName = graph_util_1['default'].classNames(
      'shape'
    );
    const nodeClassName = graph_util_1['default'].classNames('node', {
      selected: selected,
      hovered: hovered,
    });
    const nodeSubtypeClassName = graph_util_1['default'].classNames(
      'subtype-shape',
      {
        selected: this.state.selected,
      }
    );
    const nodeTypeXlinkHref = Node.getNodeTypeXlinkHref(data, nodeTypes) || '';
    const nodeSubtypeXlinkHref =
      Node.getNodeSubtypeXlinkHref(data, nodeSubtypes) || '';
    // get width and height defined on def element
    const defSvgNodeElement = nodeTypeXlinkHref
      ? document.querySelector('defs>' + nodeTypeXlinkHref)
      : null;
    const nodeWidthAttr = defSvgNodeElement
      ? defSvgNodeElement.getAttribute('width')
      : 0;
    const nodeHeightAttr = defSvgNodeElement
      ? defSvgNodeElement.getAttribute('height')
      : 0;

    props.width = nodeWidthAttr ? parseInt(nodeWidthAttr, 10) : props.width;
    props.height = nodeHeightAttr ? parseInt(nodeHeightAttr, 10) : props.height;

    if (renderNode) {
      // Originally: graphView, domNode, datum, index, elements.
      return renderNode(this.nodeRef, data, data[nodeKey], selected, hovered);
    } else {
      return React.createElement(
        'g',
        __assign({ className: nodeShapeContainerClassName }, props),
        !!data.subtype &&
          React.createElement('use', {
            'data-index': index,
            className: nodeSubtypeClassName,
            x: -props.width / 2,
            y: -props.height / 2,
            width: props.width,
            height: props.height,
            xlinkHref: nodeSubtypeXlinkHref,
          }),
        React.createElement('use', {
          'data-index': index,
          className: nodeClassName,
          x: -props.width / 2,
          y: -props.height / 2,
          width: props.width,
          height: props.height,
          xlinkHref: nodeTypeXlinkHref,
        })
      );
    }
  };
  Node.prototype.renderText = function() {
    const _a = this.props,
      data = _a.data,
      id = _a.id,
      nodeTypes = _a.nodeTypes,
      renderNodeText = _a.renderNodeText,
      isSelected = _a.isSelected,
      maxTitleChars = _a.maxTitleChars;

    if (renderNodeText) {
      return renderNodeText(data, id, isSelected);
    }

    return React.createElement(node_text_1['default'], {
      data: data,
      nodeTypes: nodeTypes,
      isSelected: this.state.selected,
      maxTitleChars: maxTitleChars,
    });
  };
  Node.prototype.render = function() {
    const _a = this.state,
      x = _a.x,
      y = _a.y,
      hovered = _a.hovered,
      selected = _a.selected;
    const _b = this.props,
      opacity = _b.opacity,
      id = _b.id,
      data = _b.data;
    const className = graph_util_1['default'].classNames('node', data.type, {
      hovered: hovered,
      selected: selected,
    });

    return React.createElement(
      'g',
      {
        className: className,
        onMouseOver: this.handleMouseOver,
        onMouseOut: this.handleMouseOut,
        id: id,
        ref: this.nodeRef,
        opacity: opacity,
        transform: 'translate(' + x + ', ' + y + ')',
        style: { transform: 'matrix(1, 0, 0, 1, ' + x + ', ' + y + ')' },
      },
      this.renderShape(),
      this.renderText()
    );
  };
  Node.defaultProps = {
    isSelected: false,
    nodeSize: 154,
    maxTitleChars: 12,
    onNodeMouseEnter: function() {
      return;
    },
    onNodeMouseLeave: function() {
      return;
    },
    onNodeMove: function() {
      return;
    },
    onNodeSelected: function() {
      return;
    },
    onNodeUpdate: function() {
      return;
    },
    centerNodeOnMove: true,
  };

  return Node;
})(React.Component);

exports['default'] = Node;
