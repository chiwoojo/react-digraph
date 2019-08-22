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
const ReactDOM = require('react-dom');

require('../styles/main.scss');
const layout_engine_config_1 = require('../utilities/layout-engine/layout-engine-config');
const background_1 = require('./background');
const defs_1 = require('./defs');
const edge_1 = require('./edge');
const graph_controls_1 = require('./graph-controls');
const graph_util_1 = require('../utilities/graph-util');
const node_1 = require('./node');
const node_type_guard_1 = require('../../type-guards/node-type-guard');
const edge_type_guard_1 = require('../../type-guards/edge-type-guard');
const GraphView = /** @class */ (function(_super) {
  __extends(GraphView, _super);

  function GraphView(props) {
    const _this = _super.call(this, props) || this;

    _this.removeOldEdges = function(prevEdges, edgesMap) {
      // remove old edges
      let edge = null;

      for (let i = 0; i < prevEdges.length; i++) {
        edge = prevEdges[i];

        // Check for deletions
        if (
          !edge.source ||
          !edge.target ||
          !edgesMap[edge.source + '_' + edge.target]
        ) {
          // remove edge
          _this.removeEdgeElement(edge.source, edge.target);
          continue;
        }
      }
    };
    _this.handleDelete = function(selected) {
      const _a = _this.props,
        canDeleteNode = _a.canDeleteNode,
        canDeleteEdge = _a.canDeleteEdge,
        readOnly = _a.readOnly;

      if (readOnly || !selected) {
        return;
      }

      if (
        node_type_guard_1.isNode(selected) &&
        canDeleteNode &&
        canDeleteNode(selected)
      ) {
        _this.deleteNode(selected);
      } else if (
        edge_type_guard_1.isEdge(selected) &&
        canDeleteEdge &&
        canDeleteEdge(selected)
      ) {
        _this.deleteEdge(selected);
      }
    };
    _this.handleWrapperKeydown = function(d) {
      const _a = _this.props,
        selected = _a.selected,
        onUndo = _a.onUndo,
        onCopySelected = _a.onCopySelected,
        onPasteSelected = _a.onPasteSelected;
      const _b = _this.state,
        focused = _b.focused,
        selectedNodeObj = _b.selectedNodeObj;

      // Conditionally ignore keypress events on the window
      if (!focused) {
        return;
      }

      switch (d.key) {
        case 'Delete':
        case 'Backspace':
          if (selectedNodeObj) {
            _this.handleDelete(selectedNodeObj.node || selected);
          }

          break;
        case 'z':
          if ((d.metaKey || d.ctrlKey) && onUndo) {
            onUndo();
          }

          break;
        case 'c':
          if (
            (d.metaKey || d.ctrlKey) &&
            selectedNodeObj.node &&
            onCopySelected
          ) {
            onCopySelected();
          }

          break;
        case 'v':
          if (
            (d.metaKey || d.ctrlKey) &&
            selectedNodeObj.node &&
            onPasteSelected
          ) {
            onPasteSelected();
          }

          break;
        default:
          break;
      }
    };
    _this.handleEdgeSelected = function(e) {
      const _a = e.target.dataset,
        source = _a.source,
        target = _a.target;
      let newState = {
        svgClicked: true,
        focused: true,
        selectedEdgeObj: _this.state.selectedEdgeObj,
      };

      if (source && target) {
        const edge = _this.getEdgeBySourceTarget(source, target);

        if (!edge) {
          return;
        }

        const originalArrIndex = edge.originalArrIndex;

        newState = __assign({}, newState, {
          selectedEdgeObj: {
            componentUpToDate: false,
            edge: _this.state.edges[originalArrIndex],
          },
        });
        _this.setState(newState);
        _this.props.onSelectEdge(_this.state.edges[originalArrIndex]);
      } else {
        _this.setState(newState);
      }
    };
    _this.handleSvgClicked = function(d, i) {
      const _a = _this.props,
        onBackgroundClick = _a.onBackgroundClick,
        onSelectNode = _a.onSelectNode,
        readOnly = _a.readOnly,
        onCreateNode = _a.onCreateNode;

      if (_this.isPartOfEdge(d3.event.target)) {
        _this.handleEdgeSelected(d3.event);

        return; // If any part of the edge is clicked, return
      }

      if (_this.state.selectingNode) {
        _this.setState({
          focused: true,
          selectingNode: false,
          svgClicked: true,
        });
      } else {
        if (!d3.event.shiftKey && onBackgroundClick) {
          var xycoords = d3.mouse(d3.event.target);

          onBackgroundClick(xycoords[0], xycoords[1], d3.event);
        }

        const previousSelection =
          (_this.state.selectedNodeObj && _this.state.selectedNodeObj.node) ||
          null;

        // de-select the current selection
        _this.setState({
          selectedNodeObj: null,
          focused: true,
          svgClicked: true,
        });
        onSelectNode(null);

        if (previousSelection) {
          _this.syncRenderNode(previousSelection);
        }

        if (!readOnly && d3.event.shiftKey) {
          var xycoords = d3.mouse(d3.event.target);

          onCreateNode(xycoords[0], xycoords[1], d3.event);
        }
      }
    };
    _this.handleDocumentClick = function(event) {
      // Ignore document click if it's in the SVGElement
      if (
        event &&
        event.target &&
        event.target.ownerSVGElement != null &&
        event.target.ownerSVGElement === _this.graphSvg.current
      ) {
        return;
      }

      _this.setState({
        documentClicked: true,
        focused: false,
        svgClicked: false,
      });
    };
    _this.handleNodeMove = function(position, nodeId, shiftKey) {
      const _a = _this.props,
        canCreateEdge = _a.canCreateEdge,
        readOnly = _a.readOnly;
      const nodeMapNode = _this.getNodeById(nodeId);

      if (!nodeMapNode) {
        return;
      }

      const node = nodeMapNode.node;

      if (readOnly) {
        return;
      }

      if (!shiftKey && !_this.state.draggingEdge) {
        // node moved
        node.x = position.x;
        node.y = position.y;
        // Update edges for node
        _this.renderConnectedEdgesFromNode(nodeMapNode, true);
        _this.asyncRenderNode(node);
      } else if (
        // @ts-ignore - please review history of why we are allowing nodeId instead of INode interface.
        (canCreateEdge && canCreateEdge(nodeId)) ||
        _this.state.draggingEdge
      ) {
        // render new edge
        _this.syncRenderEdge({ source: nodeId, targetPosition: position });
        _this.setState({ draggingEdge: true });
      }
    };
    _this.handleNodeUpdate = function(position, nodeId, shiftKey) {
      const _a = _this.props,
        onUpdateNode = _a.onUpdateNode,
        readOnly = _a.readOnly;

      if (readOnly) {
        return;
      }

      // Detect if edge is being drawn and link to hovered node
      // This will handle a new edge
      if (shiftKey) {
        _this.createNewEdge();
      } else {
        const nodeMap = _this.getNodeById(nodeId);

        if (nodeMap) {
          Object.assign(nodeMap.node, position);
          onUpdateNode(nodeMap.node);
        }
      }

      // force a re-render
      _this.setState({
        componentUpToDate: false,
        focused: true,
        // Setting hoveredNode to false here because the layout engine doesn't
        // fire the mouseLeave event when nodes are moved.
        hoveredNode: false,
        svgClicked: true,
      });
    };
    _this.handleNodeMouseEnter = function(event, data, hovered) {
      // hovered is false when creating edges
      if (hovered && !_this.state.hoveredNode) {
        _this.setState({
          hoveredNode: true,
          hoveredNodeData: data,
        });
      } else if (
        !hovered &&
        _this.state.hoveredNode &&
        _this.state.draggingEdge
      ) {
        _this.setState({
          edgeEndNode: data,
        });
      } else {
        _this.setState({
          hoveredNode: true,
          hoveredNodeData: data,
        });
      }
    };
    _this.handleNodeMouseLeave = function(event, data) {
      if (
        (d3.event &&
          d3.event.toElement &&
          graph_util_1['default'].findParent(d3.event.toElement, '.node')) ||
        (event &&
          event.relatedTarget &&
          graph_util_1['default'].findParent(event.relatedTarget, '.node')) ||
        (d3.event && d3.event.buttons === 1) ||
        (event && event.buttons === 1)
      ) {
        // still within a node
        return;
      }

      if (event && event.relatedTarget) {
        if (event.relatedTarget.classList.contains('edge-overlay-path')) {
          return;
        }

        _this.setState({ hoveredNode: false, edgeEndNode: null });
      }
    };
    _this.handleNodeSelected = function(node, nodeId, creatingEdge, event) {
      const newState = {
        componentUpToDate: false,
        selectedNodeObj: {
          nodeId: nodeId,
          node: node,
        },
      };

      _this.setState(newState);

      if (!creatingEdge) {
        _this.props.onSelectNode(node, event);
      }
    };
    _this.handleZoomStart = function() {
      // Zoom start events also handle edge clicks. We need to determine if an edge
      // was clicked and deal with that scenario.
      const sourceEvent = d3.event.sourceEvent;

      if (
        // graph can't be modified
        _this.props.readOnly ||
        // no sourceEvent, not an action on an element
        !sourceEvent ||
        // not a click event
        (sourceEvent && !sourceEvent.buttons) ||
        // not an edge click area
        (sourceEvent &&
          !sourceEvent.target.classList.contains('edge-overlay-path'))
      ) {
        return false;
      }

      // Clicked on the edge.
      const target = sourceEvent.target;
      const edgeId = target.id;
      const edge =
        _this.state.edgesMap && _this.state.edgesMap[edgeId]
          ? _this.state.edgesMap[edgeId].edge
          : null;

      // Only move edges if the arrow is dragged
      if (!_this.isArrowClicked(edge) || !edge) {
        return false;
      }

      _this.removeEdgeElement(edge.source, edge.target);
      _this.setState({ draggingEdge: true, draggedEdge: edge });
      _this.dragEdge(edge);
    };
    // View 'zoom' handler
    _this.handleZoom = function() {
      const draggingEdge = _this.state.draggingEdge;
      const transform = d3.event.transform;

      if (!draggingEdge) {
        d3.select(_this.view).attr('transform', transform);

        // prevent re-rendering on zoom
        if (_this.state.viewTransform !== transform) {
          _this.setState(
            {
              viewTransform: transform,
              draggedEdge: null,
              draggingEdge: false,
            },
            function() {
              // force the child components which are related to zoom level to update
              _this.renderGraphControls();
            }
          );
        }
      } else if (draggingEdge) {
        _this.dragEdge();

        return false;
      }
    };
    _this.handleZoomEnd = function() {
      const _a = _this.state,
        draggingEdge = _a.draggingEdge,
        draggedEdge = _a.draggedEdge,
        edgeEndNode = _a.edgeEndNode;
      const nodeKey = _this.props.nodeKey;

      if (!draggingEdge || !draggedEdge) {
        if (draggingEdge && !draggedEdge) {
          // This is a bad case, sometimes when the graph loses focus while an edge
          // is being created it doesn't set draggingEdge to false. This fixes that case.
          _this.setState({
            draggingEdge: false,
          });
        }

        return;
      }

      // Zoom start events also handle edge clicks. We need to determine if an edge
      // was clicked and deal with that scenario.
      const draggedEdgeCopy = __assign({}, _this.state.draggedEdge);

      // remove custom edge
      graph_util_1['default'].removeElementFromDom('edge-custom-container');
      _this.setState(
        {
          draggedEdge: null,
          draggingEdge: false,
          hoveredNode: false,
        },
        function() {
          // handle creating or swapping edges
          const sourceNodeById = _this.getNodeById(draggedEdge.source);
          const targetNodeById = _this.getNodeById(draggedEdge.target);

          if (!sourceNodeById || !targetNodeById) {
            return;
          }

          const sourceNode = sourceNodeById.node;

          if (
            edgeEndNode &&
            !_this.getEdgeBySourceTarget(
              draggedEdge.source,
              edgeEndNode[nodeKey]
            ) &&
            _this.canSwap(sourceNode, edgeEndNode, draggedEdge)
          ) {
            // determine the target node and update the edge
            draggedEdgeCopy.target = edgeEndNode[nodeKey];
            _this.syncRenderEdge(draggedEdgeCopy);
            _this.props.onSwapEdge(
              sourceNodeById.node,
              edgeEndNode,
              draggedEdge
            );
          } else {
            // this resets the dragged edge back to its original position.
            _this.syncRenderEdge(draggedEdge);
          }
        }
      );
    };
    // Zooms to contents of this.refs.entities
    _this.handleZoomToFit = function() {
      const entities = d3.select(_this.entities).node();

      if (!entities) {
        return;
      }

      const viewBBox = entities.getBBox ? entities.getBBox() : null;

      if (!viewBBox) {
        return;
      }

      _this.handleZoomToFitImpl(viewBBox, _this.props.zoomDur);
    };
    _this.handleZoomToFitImpl = function(viewBBox, zoomDur) {
      if (zoomDur === void 0) {
        zoomDur = 0;
      }

      if (!_this.viewWrapper.current) {
        return;
      }

      const parent = d3.select(_this.viewWrapper.current).node();
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      const minZoom = _this.props.minZoom || 0;
      const maxZoom = _this.props.maxZoom || 2;
      const next = {
        k: (minZoom + maxZoom) / 2,
        x: 0,
        y: 0,
      };

      if (viewBBox.width > 0 && viewBBox.height > 0) {
        // There are entities
        const dx = viewBBox.width;
        const dy = viewBBox.height;
        const x = viewBBox.x + viewBBox.width / 2;
        const y = viewBBox.y + viewBBox.height / 2;

        next.k = 0.9 / Math.max(dx / width, dy / height);

        if (next.k < minZoom) {
          next.k = minZoom;
        } else if (next.k > maxZoom) {
          next.k = maxZoom;
        }

        next.x = width / 2 - next.k * x;
        next.y = height / 2 - next.k * y;
      }

      _this.setZoom(next.k, next.x, next.y, zoomDur);
    };
    // Updates current viewTransform with some delta
    _this.modifyZoom = function(modK, modX, modY, dur) {
      if (modK === void 0) {
        modK = 0;
      }

      if (modX === void 0) {
        modX = 0;
      }

      if (modY === void 0) {
        modY = 0;
      }

      if (dur === void 0) {
        dur = 0;
      }

      const parent = d3.select(_this.viewWrapper.current).node();
      const center = {
        x: parent.clientWidth / 2,
        y: parent.clientHeight / 2,
      };
      const extent = _this.zoom.scaleExtent();
      const viewTransform = _this.state.viewTransform;
      const next = {
        k: viewTransform.k,
        x: viewTransform.x,
        y: viewTransform.y,
      };
      const targetZoom = next.k * (1 + modK);

      next.k = targetZoom;

      if (targetZoom < extent[0] || targetZoom > extent[1]) {
        return false;
      }

      const translate0 = {
        x: (center.x - next.x) / next.k,
        y: (center.y - next.y) / next.k,
      };
      const l = {
        x: translate0.x * next.k + next.x,
        y: translate0.y * next.k + next.y,
      };

      next.x += center.x - l.x + modX;
      next.y += center.y - l.y + modY;
      _this.setZoom(next.k, next.x, next.y, dur);

      return true;
    };
    _this.getNodeComponent = function(id, node) {
      const _a = _this.props,
        nodeTypes = _a.nodeTypes,
        nodeSubtypes = _a.nodeSubtypes,
        nodeSize = _a.nodeSize,
        renderNode = _a.renderNode,
        renderNodeText = _a.renderNodeText,
        nodeKey = _a.nodeKey,
        maxTitleChars = _a.maxTitleChars;

      return React.createElement(node_1['default'], {
        key: id,
        id: id,
        data: node,
        nodeTypes: nodeTypes,
        nodeSize: nodeSize,
        nodeKey: nodeKey,
        nodeSubtypes: nodeSubtypes,
        onNodeMouseEnter: _this.handleNodeMouseEnter,
        onNodeMouseLeave: _this.handleNodeMouseLeave,
        onNodeMove: _this.handleNodeMove,
        onNodeUpdate: _this.handleNodeUpdate,
        onNodeSelected: _this.handleNodeSelected,
        renderNode: renderNode,
        renderNodeText: renderNodeText,
        isSelected: _this.state.selectedNodeObj.node === node,
        layoutEngine: _this.layoutEngine,
        viewWrapperElem: _this.viewWrapper.current,
        centerNodeOnMove: _this.props.centerNodeOnMove,
        maxTitleChars: maxTitleChars,
      });
    };
    _this.renderNodes = function() {
      if (!_this.entities) {
        return;
      }

      _this.state.nodes.forEach(function(node, i) {
        _this.asyncRenderNode(node);
      });
    };
    _this.isEdgeSelected = function(edge) {
      return (
        !!_this.state.selectedEdgeObj &&
        !!_this.state.selectedEdgeObj.edge &&
        _this.state.selectedEdgeObj.edge.source === edge.source &&
        _this.state.selectedEdgeObj.edge.target === edge.target
      );
    };
    _this.getEdgeComponent = function(edge) {
      const sourceNodeMapNode = _this.getNodeById(edge.source);
      const sourceNode = sourceNodeMapNode ? sourceNodeMapNode.node : null;
      const targetNodeMapNode = _this.getNodeById(edge.target);
      const targetNode = targetNodeMapNode ? targetNodeMapNode.node : null;
      const targetPosition = edge.targetPosition;
      const _a = _this.props,
        edgeTypes = _a.edgeTypes,
        edgeHandleSize = _a.edgeHandleSize,
        nodeSize = _a.nodeSize,
        nodeKey = _a.nodeKey;

      return React.createElement(edge_1['default'], {
        data: edge,
        edgeTypes: edgeTypes,
        edgeHandleSize: edgeHandleSize,
        nodeSize: nodeSize,
        sourceNode: sourceNode,
        targetNode: targetNode || targetPosition,
        nodeKey: nodeKey,
        viewWrapperElem: _this.viewWrapper.current,
        isSelected: _this.isEdgeSelected(edge),
        rotateEdgeHandle: _this.props.rotateEdgeHandle,
      });
    };
    _this.renderEdge = function(id, element, edge, nodeMoving) {
      if (nodeMoving === void 0) {
        nodeMoving = false;
      }

      if (!_this.entities) {
        return null;
      }

      let containerId = id + '-container';
      const customContainerId = id + '-custom-container';
      const draggedEdge = _this.state.draggedEdge;
      const afterRenderEdge = _this.props.afterRenderEdge;
      let edgeContainer = document.getElementById(containerId);

      if (nodeMoving && edgeContainer) {
        edgeContainer.style.display = 'none';
        containerId = id + '-custom-container';
        edgeContainer = document.getElementById(containerId);
      } else if (edgeContainer) {
        const customContainer = document.getElementById(customContainerId);

        edgeContainer.style.display = '';

        if (customContainer) {
          customContainer.remove();
        }
      }

      if (!edgeContainer && edge !== draggedEdge) {
        const newSvgEdgeContainer = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'g'
        );

        newSvgEdgeContainer.id = containerId;
        _this.entities.appendChild(newSvgEdgeContainer);
        // @ts-ignore - edgeContainer is now SVGElement.
        edgeContainer = newSvgEdgeContainer;
      }

      // ReactDOM.render replaces the insides of an element This renders the element
      // into the edgeContainer
      if (edgeContainer) {
        ReactDOM.render(element, edgeContainer);

        if (afterRenderEdge) {
          return afterRenderEdge(
            id,
            element,
            edge,
            edgeContainer,
            _this.isEdgeSelected(edge)
          );
        }
      }
    };
    _this.asyncRenderEdge = function(edge, nodeMoving) {
      if (nodeMoving === void 0) {
        nodeMoving = false;
      }

      if (!edge.source || !edge.target) {
        return;
      }

      const timeoutId = 'edges-' + edge.source + '-' + edge.target;

      cancelAnimationFrame(_this.edgeTimeouts[timeoutId]);
      _this.edgeTimeouts[timeoutId] = requestAnimationFrame(function() {
        _this.syncRenderEdge(edge, nodeMoving);
      });
    };
    _this.renderEdges = function() {
      const _a = _this.state,
        edges = _a.edges,
        draggingEdge = _a.draggingEdge;

      if (!_this.entities || draggingEdge) {
        return;
      }

      for (let i = 0; i < edges.length; i++) {
        _this.asyncRenderEdge(edges[i]);
      }
    };
    _this.nodeTimeouts = {};
    _this.edgeTimeouts = {};
    _this.renderNodesTimeout = null;
    _this.renderEdgesTimeout = null;
    _this.viewWrapper = React.createRef();
    _this.graphControls = React.createRef();
    _this.graphSvg = React.createRef();

    if (props.layoutEngineType) {
      _this.layoutEngine = new layout_engine_config_1.LayoutEngines[
        props.layoutEngineType
      ](props);
    }

    _this.state = {
      componentUpToDate: false,
      draggedEdge: null,
      draggingEdge: false,
      edgeEndNode: null,
      edges: [],
      edgesMap: {},
      hoveredNode: false,
      hoveredNodeData: null,
      nodes: [],
      nodesMap: {},
      selectedEdgeObj: null,
      selectedNodeObj: null,
      selectingNode: false,
      documentClicked: false,
      svgClicked: false,
      focused: true,
    };

    return _this;
  }
  GraphView.getDerivedStateFromProps = function(nextProps, prevState) {
    const edges = nextProps.edges,
      nodeKey = nextProps.nodeKey;
    let nodes = nextProps.nodes;
    const nodesMap = graph_util_1['default'].getNodesMap(nodes, nodeKey);
    const edgesMap = graph_util_1['default'].getEdgesMap(edges);

    graph_util_1['default'].linkNodesAndEdges(nodesMap, edges);
    const selectedNodeMap =
      nextProps.selected && nodesMap['key-' + nextProps.selected[nodeKey]]
        ? nodesMap['key-' + nextProps.selected[nodeKey]]
        : null;
    const selectedEdgeMap =
      nextProps.selected &&
      edgesMap[nextProps.selected.source + '_' + nextProps.selected.target]
        ? edgesMap[nextProps.selected.source + '_' + nextProps.selected.target]
        : null;

    // Handle layoutEngine on initial render
    if (
      prevState.nodes.length === 0 &&
      nextProps.layoutEngineType &&
      layout_engine_config_1.LayoutEngines[nextProps.layoutEngineType]
    ) {
      const layoutEngine = new layout_engine_config_1.LayoutEngines[
        nextProps.layoutEngineType
      ](nextProps);
      const newNodes = layoutEngine.adjustNodes(nodes, nodesMap);

      nodes = newNodes;
    }

    const nextState = {
      componentUpToDate: true,
      edges: edges,
      edgesMap: edgesMap,
      nodes: nodes,
      nodesMap: nodesMap,
      readOnly: nextProps.readOnly,
      selectedEdgeObj: {
        edge: selectedEdgeMap ? selectedEdgeMap.edge : null,
      },
      selectedNodeObj: {
        nodeId: selectedNodeMap ? nextProps.selected[nodeKey] : null,
        node: selectedNodeMap ? selectedNodeMap.node : null,
      },
      selectionChanged: false,
    };

    return nextState;
  };
  GraphView.prototype.componentDidMount = function() {
    const _this = this;
    const _a = this.props,
      initialBBox = _a.initialBBox,
      zoomDelay = _a.zoomDelay,
      minZoom = _a.minZoom,
      maxZoom = _a.maxZoom;

    // TODO: can we target the element rather than the document?
    document.addEventListener('keydown', this.handleWrapperKeydown);
    document.addEventListener('click', this.handleDocumentClick);
    this.zoom = d3
      .zoom()
      .filter(this.zoomFilter)
      .scaleExtent([minZoom || 0, maxZoom || 0])
      .on('start', this.handleZoomStart)
      .on('zoom', this.handleZoom)
      .on('end', this.handleZoomEnd);
    d3.select(this.viewWrapper.current)
      .on('touchstart', this.containZoom)
      .on('touchmove', this.containZoom)
      .on('click', this.handleSvgClicked) // handle element click in the element components
      .select('svg')
      .call(this.zoom);
    this.selectedView = d3.select(this.view);

    if (initialBBox) {
      // If initialBBox is set, we don't compute the zoom and don't do any transition.
      this.handleZoomToFitImpl(initialBBox, 0);
      this.renderView();

      return;
    }

    // On the initial load, the 'view' <g> doesn't exist until componentDidMount.
    // Manually render the first view.
    this.renderView();
    setTimeout(function() {
      if (_this.viewWrapper.current != null) {
        _this.handleZoomToFit();
      }
    }, zoomDelay);
  };
  GraphView.prototype.componentWillUnmount = function() {
    document.removeEventListener('keydown', this.handleWrapperKeydown);
    document.removeEventListener('click', this.handleDocumentClick);
  };
  GraphView.prototype.shouldComponentUpdate = function(nextProps, nextState) {
    if (
      nextProps.nodes !== this.props.nodes ||
      nextProps.edges !== this.props.edges ||
      !nextState.componentUpToDate ||
      nextProps.selected !== this.props.selected ||
      nextProps.readOnly !== this.props.readOnly ||
      nextProps.layoutEngineType !== this.props.layoutEngineType
    ) {
      return true;
    }

    return false;
  };
  GraphView.prototype.componentDidUpdate = function(prevProps, prevState) {
    const _a = this.state,
      nodesMap = _a.nodesMap,
      edgesMap = _a.edgesMap,
      nodes = _a.nodes,
      selectedNodeObj = _a.selectedNodeObj,
      selectedEdgeObj = _a.selectedEdgeObj;
    const layoutEngineType = this.props.layoutEngineType;

    if (
      layoutEngineType &&
      layout_engine_config_1.LayoutEngines[layoutEngineType]
    ) {
      this.layoutEngine = new layout_engine_config_1.LayoutEngines[
        layoutEngineType
      ](this.props);
      const newNodes = this.layoutEngine.adjustNodes(nodes, nodesMap);

      this.setState({
        nodes: newNodes,
      });
    }

    const forceReRender = prevProps.layoutEngineType !== layoutEngineType;

    // Note: the order is intentional
    // remove old edges
    this.removeOldEdges(prevState.edges, edgesMap);
    // remove old nodes
    this.removeOldNodes(prevState.nodes, prevState.nodesMap, nodesMap);
    // add new nodes
    this.addNewNodes(
      this.state.nodes,
      prevState.nodesMap,
      selectedNodeObj,
      prevState.selectedNodeObj,
      forceReRender
    );
    // add new edges
    this.addNewEdges(
      this.state.edges,
      prevState.edgesMap,
      selectedEdgeObj,
      prevState.selectedEdgeObj,
      forceReRender
    );
    this.setState({
      componentUpToDate: true,
    });
  };
  GraphView.prototype.getNodeById = function(id, nodesMap) {
    const nodesMapVar = nodesMap || this.state.nodesMap;

    return nodesMapVar ? nodesMapVar['key-' + (id || '')] : null;
  };
  GraphView.prototype.getEdgeBySourceTarget = function(source, target) {
    return this.state.edgesMap
      ? this.state.edgesMap[source + '_' + target]
      : null;
  };
  GraphView.prototype.deleteEdgeBySourceTarget = function(source, target) {
    if (this.state.edgesMap && this.state.edgesMap[source + '_' + target]) {
      delete this.state.edgesMap[source + '_' + target];
    }
  };
  GraphView.prototype.addNewNodes = function(
    nodes,
    oldNodesMap,
    selectedNode,
    prevSelectedNode,
    forceRender
  ) {
    const _this = this;

    if (forceRender === void 0) {
      forceRender = false;
    }

    if (this.state.draggingEdge) {
      return;
    }

    const nodeKey = this.props.nodeKey;
    let node = null;
    let prevNode = null;

    graph_util_1['default'].yieldingLoop(nodes.length, 50, function(i) {
      node = nodes[i];
      prevNode = _this.getNodeById(node[nodeKey], oldNodesMap);

      // if there was a previous node and it changed
      if (
        prevNode != null &&
        (!graph_util_1['default'].isEqual(prevNode.node, node) ||
          (selectedNode.node !== prevSelectedNode.node &&
            ((selectedNode.node &&
              node[nodeKey] === selectedNode.node[nodeKey]) ||
              (prevSelectedNode.node &&
                node[nodeKey] === prevSelectedNode.node[nodeKey]))))
      ) {
        // Updated node
        _this.asyncRenderNode(node);
      } else if (forceRender || !prevNode) {
        // New node
        _this.asyncRenderNode(node);
      }
    });
  };
  GraphView.prototype.removeOldNodes = function(
    prevNodes,
    prevNodesMap,
    nodesMap
  ) {
    const _this = this;
    const nodeKey = this.props.nodeKey;
    const _loop_1 = function(i) {
      const prevNode = prevNodes[i];
      const nodeId = prevNode[nodeKey];

      // Check for deletions
      if (this_1.getNodeById(nodeId, nodesMap)) {
        return 'continue';
      }

      const prevNodeMapNode = this_1.getNodeById(nodeId, prevNodesMap);

      // remove all outgoing edges
      prevNodeMapNode.outgoingEdges.forEach(function(edge) {
        _this.removeEdgeElement(edge.source, edge.target);
      });
      // remove all incoming edges
      prevNodeMapNode.incomingEdges.forEach(function(edge) {
        _this.removeEdgeElement(edge.source, edge.target);
      });
      // remove node
      // The timeout avoids a race condition
      setTimeout(function() {
        graph_util_1['default'].removeElementFromDom(
          'node-' + nodeId + '-container'
        );
      });
    };
    var this_1 = this;

    // remove old nodes
    for (let i = 0; i < prevNodes.length; i++) {
      _loop_1(i);
    }
  };
  GraphView.prototype.addNewEdges = function(
    edges,
    oldEdgesMap,
    selectedEdge,
    prevSelectedEdge,
    forceRender
  ) {
    const _this = this;

    if (forceRender === void 0) {
      forceRender = false;
    }

    if (!this.state.draggingEdge) {
      let edge_2 = null;

      graph_util_1['default'].yieldingLoop(edges.length, 50, function(i) {
        edge_2 = edges[i];

        if (!edge_2.source || !edge_2.target) {
          return;
        }

        const prevEdge = oldEdgesMap[edge_2.source + '_' + edge_2.target];

        if (
          forceRender ||
          !prevEdge || // selection change
          !graph_util_1['default'].isEqual(prevEdge.edge, edge_2) ||
          ((selectedEdge.edge && edge_2 === selectedEdge.edge) ||
            (prevSelectedEdge.edge && prevSelectedEdge.edge))
        ) {
          // new edge
          _this.asyncRenderEdge(edge_2);
        }
      });
    }
  };
  GraphView.prototype.removeEdgeElement = function(source, target) {
    const id = source + '-' + target;

    graph_util_1['default'].removeElementFromDom('edge-' + id + '-container');
  };
  GraphView.prototype.canSwap = function(sourceNode, hoveredNode, swapEdge) {
    return (
      hoveredNode &&
      sourceNode !== hoveredNode &&
      (swapEdge.source !== sourceNode[this.props.nodeKey] ||
        swapEdge.target !== hoveredNode[this.props.nodeKey])
    );
  };
  GraphView.prototype.deleteNode = function(selectedNode) {
    const nodeKey = this.props.nodeKey;
    const nodes = this.state.nodes;
    const nodeId = selectedNode[nodeKey];
    // delete from local state
    const newNodesArr = nodes.filter(function(node) {
      return node[nodeKey] !== nodeId;
    });

    this.setState({
      componentUpToDate: false,
      hoveredNode: false,
    });
    // remove from UI
    graph_util_1['default'].removeElementFromDom(
      'node-' + nodeId + '-container'
    );
    // inform consumer
    this.props.onSelectNode(null);
    this.props.onDeleteNode(selectedNode, nodeId, newNodesArr);
  };
  GraphView.prototype.deleteEdge = function(selectedEdge) {
    const edges = this.state.edges;

    if (!selectedEdge.source || !selectedEdge.target) {
      return;
    }

    const newEdgesArr = edges.filter(function(edge) {
      return !(
        edge.source === selectedEdge.source &&
        edge.target === selectedEdge.target
      );
    });

    if (selectedEdge.source && selectedEdge.target) {
      this.deleteEdgeBySourceTarget(selectedEdge.source, selectedEdge.target);
    }

    this.setState({
      componentUpToDate: false,
      edges: newEdgesArr,
    });

    // remove from UI
    if (selectedEdge.source && selectedEdge.target) {
      // remove extra custom containers just in case.
      graph_util_1['default'].removeElementFromDom(
        'edge-' +
          selectedEdge.source +
          '-' +
          selectedEdge.target +
          '-custom-container'
      );
      graph_util_1['default'].removeElementFromDom(
        'edge-' + selectedEdge.source + '-' + selectedEdge.target + '-container'
      );
    }

    // inform consumer
    this.props.onDeleteEdge(selectedEdge, newEdgesArr);
  };
  GraphView.prototype.isPartOfEdge = function(element) {
    return !!graph_util_1['default'].findParent(element, '.edge-container');
  };
  GraphView.prototype.createNewEdge = function() {
    const _a = this.props,
      canCreateEdge = _a.canCreateEdge,
      nodeKey = _a.nodeKey,
      onCreateEdge = _a.onCreateEdge;
    const _b = this.state,
      edgesMap = _b.edgesMap,
      edgeEndNode = _b.edgeEndNode,
      hoveredNodeData = _b.hoveredNodeData;

    if (!hoveredNodeData) {
      return;
    }

    graph_util_1['default'].removeElementFromDom('edge-custom-container');

    if (edgeEndNode) {
      const mapId1 = hoveredNodeData[nodeKey] + '_' + edgeEndNode[nodeKey];
      const mapId2 = edgeEndNode[nodeKey] + '_' + hoveredNodeData[nodeKey];

      if (
        edgesMap &&
        hoveredNodeData !== edgeEndNode &&
        canCreateEdge &&
        canCreateEdge(hoveredNodeData, edgeEndNode) &&
        !edgesMap[mapId1] &&
        !edgesMap[mapId2]
      ) {
        this.setState({
          componentUpToDate: false,
          draggedEdge: null,
          draggingEdge: false,
        });
        // we expect the parent website to set the selected property to the new edge when it's created
        onCreateEdge(hoveredNodeData, edgeEndNode);
      } else {
        // make the system understand that the edge creation process is done even though it didn't work.
        this.setState({
          edgeEndNode: null,
          draggingEdge: false,
        });
      }
    }
  };
  // One can't attach handlers to 'markers' or obtain them from the event.target
  // If the click occurs within a certain radius of edge target, assume the click
  // occurred on the arrow
  GraphView.prototype.isArrowClicked = function(edge) {
    const edgeArrowSize = this.props.edgeArrowSize;
    const eventTarget = d3.event.sourceEvent.target;
    const arrowSize = edgeArrowSize || 0;

    if (!edge || eventTarget.tagName !== 'path') {
      return false; // If the handle is clicked
    }

    const xycoords = d3.mouse(eventTarget);

    if (!edge.target) {
      return false;
    }

    const source = {
      x: xycoords[0],
      y: xycoords[1],
    };
    const edgeCoords = edge_1['default'].parsePathToXY(
      edge_1['default'].getEdgePathElement(edge, this.viewWrapper.current)
    );

    // the arrow is clicked if the xycoords are within edgeArrowSize of edgeCoords.target[x,y]
    return (
      source.x < edgeCoords.target.x + arrowSize &&
      source.x > edgeCoords.target.x - arrowSize &&
      source.y < edgeCoords.target.y + arrowSize &&
      source.y > edgeCoords.target.y - arrowSize
    );
  };
  GraphView.prototype.zoomFilter = function() {
    if (d3.event.button || d3.event.ctrlKey) {
      return false;
    }

    return true;
  };
  // Keeps 'zoom' contained
  GraphView.prototype.containZoom = function() {
    const stop = d3.event.button || d3.event.ctrlKey;

    if (stop) {
      d3.event.stopImmediatePropagation(); // stop zoom
    }
  };
  GraphView.prototype.getMouseCoordinates = function() {
    let mouseCoordinates = [0, 0];

    if (this.selectedView) {
      mouseCoordinates = d3.mouse(this.selectedView.node());
    }

    return mouseCoordinates;
  };
  GraphView.prototype.dragEdge = function(draggedEdge) {
    const _a = this.props,
      nodeSize = _a.nodeSize,
      nodeKey = _a.nodeKey;

    draggedEdge = draggedEdge || this.state.draggedEdge;

    if (!draggedEdge) {
      return;
    }

    const mouseCoordinates = this.getMouseCoordinates();
    const targetPosition = {
      x: mouseCoordinates[0],
      y: mouseCoordinates[1],
    };
    const off = edge_1['default'].calculateOffset(
      nodeSize,
      this.getNodeById(draggedEdge.source).node,
      targetPosition,
      nodeKey
    );

    targetPosition.x += off.xOff;
    targetPosition.y += off.yOff;
    this.syncRenderEdge({
      source: draggedEdge.source,
      targetPosition: targetPosition,
    });
    this.setState({
      draggedEdge: draggedEdge,
      draggingEdge: true,
    });
  };
  // Programmatically resets zoom
  GraphView.prototype.setZoom = function(k, x, y, dur) {
    if (k === void 0) {
      k = 1;
    }

    if (x === void 0) {
      x = 0;
    }

    if (y === void 0) {
      y = 0;
    }

    if (dur === void 0) {
      dur = 0;
    }

    const t = d3.zoomIdentity.translate(x, y).scale(k);

    d3.select(this.viewWrapper.current)
      .select('svg')
      .transition()
      .duration(dur)
      .call(this.zoom.transform, t);
  };
  // Renders 'graph' into view element
  GraphView.prototype.renderView = function() {
    // Update the view w/ new zoom/pan
    this.selectedView.attr('transform', this.state.viewTransform);
    clearTimeout(this.renderNodesTimeout);
    this.renderNodesTimeout = setTimeout(this.renderNodes);
  };
  GraphView.prototype.asyncRenderNode = function(node) {
    const _this = this;
    const nodeKey = this.props.nodeKey;
    const timeoutId = 'nodes-' + node[nodeKey];

    cancelAnimationFrame(this.nodeTimeouts[timeoutId]);
    this.nodeTimeouts[timeoutId] = requestAnimationFrame(function() {
      _this.syncRenderNode(node);
    });
  };
  GraphView.prototype.syncRenderNode = function(node) {
    const nodeKey = this.props.nodeKey;
    const id = 'node-' + node[nodeKey];
    const element = this.getNodeComponent(id, node);
    const nodesMapNode = this.getNodeById(node[nodeKey]);

    this.renderNode(id, element);

    if (nodesMapNode) {
      this.renderConnectedEdgesFromNode(nodesMapNode);
    }
  };
  GraphView.prototype.renderNode = function(id, element) {
    if (!this.entities) {
      return null;
    }

    const containerId = id + '-container';
    let nodeContainer = document.getElementById(containerId);

    if (!nodeContainer) {
      nodeContainer = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'g'
      );
      nodeContainer.id = containerId;
      this.entities.appendChild(nodeContainer);
    }

    // ReactDOM.render replaces the insides of an element This renders the element
    // into the nodeContainer
    const anyElement = element;

    ReactDOM.render(anyElement, nodeContainer);
  };
  GraphView.prototype.renderConnectedEdgesFromNode = function(
    node,
    nodeMoving
  ) {
    const _this = this;

    if (nodeMoving === void 0) {
      nodeMoving = false;
    }

    if (this.state.draggingEdge) {
      return;
    }

    node.incomingEdges.forEach(function(edge) {
      _this.asyncRenderEdge(edge, nodeMoving);
    });
    node.outgoingEdges.forEach(function(edge) {
      _this.asyncRenderEdge(edge, nodeMoving);
    });
  };
  GraphView.prototype.syncRenderEdge = function(edge, nodeMoving) {
    if (nodeMoving === void 0) {
      nodeMoving = false;
    }

    if (!edge.source) {
      return;
    }

    // We have to use the 'custom' id when we're drawing a new node
    const idVar = edge.target ? edge.source + '-' + edge.target : 'custom';
    const id = 'edge-' + idVar;
    const element = this.getEdgeComponent(edge);

    this.renderEdge(id, element, edge, nodeMoving);
  };
  /*
   * GraphControls is a special child component. To maximize responsiveness we disable
   * rendering on zoom level changes, but this component still needs to update.
   * This function ensures that it updates into the container quickly upon zoom changes
   * without causing a full GraphView render.
   */
  GraphView.prototype.renderGraphControls = function() {
    const _a = this.props,
      showGraphControls = _a.showGraphControls,
      minZoom = _a.minZoom,
      maxZoom = _a.maxZoom;
    const viewTransform = this.state.viewTransform;

    if (!showGraphControls || !this.viewWrapper) {
      return;
    }

    const graphControlsWrapper = this.viewWrapper.current.ownerDocument.getElementById(
      'react-digraph-graph-controls-wrapper'
    );

    if (!graphControlsWrapper) {
      return;
    }

    ReactDOM.render(
      React.createElement(graph_controls_1['default'], {
        ref: this.graphControls,
        minZoom: minZoom,
        maxZoom: maxZoom,
        zoomLevel: viewTransform ? viewTransform.k : 1,
        zoomToFit: this.handleZoomToFit,
        modifyZoom: this.modifyZoom,
      }),
      graphControlsWrapper
    );
  };
  GraphView.prototype.render = function() {
    const _this = this;
    const _a = this.props,
      edgeArrowSize = _a.edgeArrowSize,
      gridSpacing = _a.gridSpacing,
      gridDotSize = _a.gridDotSize,
      nodeTypes = _a.nodeTypes,
      nodeSubtypes = _a.nodeSubtypes,
      edgeTypes = _a.edgeTypes,
      renderDefs = _a.renderDefs,
      gridSize = _a.gridSize,
      backgroundFillId = _a.backgroundFillId,
      renderBackground = _a.renderBackground;

    return React.createElement(
      'div',
      { className: 'view-wrapper', ref: this.viewWrapper },
      React.createElement(
        'svg',
        { className: 'graph', ref: this.graphSvg },
        React.createElement(defs_1['default'], {
          edgeArrowSize: edgeArrowSize,
          gridSpacing: gridSpacing,
          gridDotSize: gridDotSize,
          nodeTypes: nodeTypes,
          nodeSubtypes: nodeSubtypes,
          edgeTypes: edgeTypes,
          renderDefs: renderDefs,
        }),
        React.createElement(
          'g',
          {
            className: 'view',
            ref: function(el) {
              return (_this.view = el);
            },
          },
          React.createElement(background_1['default'], {
            gridSize: gridSize,
            backgroundFillId: backgroundFillId,
            renderBackground: renderBackground,
          }),
          React.createElement('g', {
            className: 'entities',
            ref: function(el) {
              return (_this.entities = el);
            },
          })
        )
      ),
      React.createElement('div', {
        id: 'react-digraph-graph-controls-wrapper',
        className: 'graph-controls-wrapper',
      })
    );
  };
  /* Imperative API */
  GraphView.prototype.panToEntity = function(entity, zoom) {
    const viewTransform = this.state.viewTransform;
    const parent = this.viewWrapper.current;
    const entityBBox = entity ? entity.getBBox() : null;
    const maxZoom = this.props.maxZoom || 2;

    if (!parent || !entityBBox) {
      return;
    }

    const width = parent.clientWidth;
    const height = parent.clientHeight;
    const next = {
      k: viewTransform.k,
      x: 0,
      y: 0,
    };
    const x = entityBBox.x + entityBBox.width / 2;
    const y = entityBBox.y + entityBBox.height / 2;

    if (zoom) {
      next.k =
        0.9 / Math.max(entityBBox.width / width, entityBBox.height / height);

      if (next.k > maxZoom) {
        next.k = maxZoom;
      }
    }

    next.x = width / 2 - next.k * x;
    next.y = height / 2 - next.k * y;
    this.setZoom(next.k, next.x, next.y, this.props.zoomDur);
  };
  GraphView.prototype.panToNode = function(id, zoom) {
    if (zoom === void 0) {
      zoom = false;
    }

    if (!this.entities) {
      return;
    }

    const node = this.entities.querySelector('#node-' + id + '-container');

    this.panToEntity(node, zoom);
  };
  GraphView.prototype.panToEdge = function(source, target, zoom) {
    if (zoom === void 0) {
      zoom = false;
    }

    if (!this.entities) {
      return;
    }

    const edge = this.entities.querySelector(
      '#edge-' + source + '-' + target + '-container'
    );

    this.panToEntity(edge, zoom);
  };
  GraphView.defaultProps = {
    canCreateEdge: function(startNode, endNode) {
      return true;
    },
    canDeleteEdge: function() {
      return true;
    },
    canDeleteNode: function() {
      return true;
    },
    edgeArrowSize: 8,
    gridSpacing: 36,
    layoutEngineType: 'None',
    maxZoom: 1.5,
    minZoom: 0.15,
    nodeSize: 154,
    readOnly: false,
    showGraphControls: true,
    zoomDelay: 1000,
    zoomDur: 750,
    rotateEdgeHandle: true,
    centerNodeOnMove: true,
  };

  return GraphView;
})(React.Component);

exports['default'] = GraphView;
