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
const svg_intersections_1 = require('svg-intersections');
const kld_affine_1 = require('kld-affine');
const kld_intersections_1 = require('kld-intersections');
const graph_util_1 = require('../utilities/graph-util');
const Edge = /** @class */ (function(_super) {
  __extends(Edge, _super);

  function Edge(props) {
    const _this = _super.call(this, props) || this;

    _this.getEdgeHandleTranslation = function() {
      const data = _this.props.data;
      let pathDescription = _this.getPathDescription(data);

      pathDescription = pathDescription.replace(/^M/, '');
      pathDescription = pathDescription.replace(/L/, ',');
      const pathDescriptionArr = pathDescription.split(',');
      // [0] = src x, [1] = src y
      // [2] = trg x, [3] = trg y
      const diffX =
        parseFloat(pathDescriptionArr[2]) - parseFloat(pathDescriptionArr[0]);
      const diffY =
        parseFloat(pathDescriptionArr[3]) - parseFloat(pathDescriptionArr[1]);
      const x = parseFloat(pathDescriptionArr[0]) + diffX / 2;
      const y = parseFloat(pathDescriptionArr[1]) + diffY / 2;

      return 'translate(' + x + ', ' + y + ')';
    };
    _this.getEdgeHandleOffsetTranslation = function() {
      const offset = -(_this.props.edgeHandleSize || 0) / 2;

      return 'translate(' + offset + ', ' + offset + ')';
    };
    _this.getEdgeHandleRotation = function(negate) {
      if (negate === void 0) {
        negate = false;
      }

      let rotated = false;
      const src = _this.props.sourceNode;
      const trg = _this.props.targetNode;
      let theta = (Edge.getTheta(src, trg) * 180) / Math.PI;

      if (negate) {
        theta = -theta;
      }

      if (theta > 90 || theta < -90) {
        theta = theta + 180;
        rotated = true;
      }

      return ['rotate(' + theta + ')', rotated];
    };
    _this.getEdgeHandleTransformation = function() {
      const translation = _this.getEdgeHandleTranslation();
      const rotation = _this.props.rotateEdgeHandle
        ? _this.getEdgeHandleRotation()[0]
        : '';
      const offset = _this.getEdgeHandleOffsetTranslation();

      return translation + ' ' + rotation + ' ' + offset;
    };
    _this.edgeOverlayRef = React.createRef();

    return _this;
  }
  Edge.getTheta = function(pt1, pt2) {
    const xComp = (pt2.x || 0) - (pt1.x || 0);
    const yComp = (pt2.y || 0) - (pt1.y || 0);
    const theta = Math.atan2(yComp, xComp);

    return theta;
  };
  Edge.lineFunction = function(srcTrgDataArray) {
    // Provides API for curved lines using .curve() Example:
    // https://bl.ocks.org/d3indepth/64be9fc39a92ef074034e9a8fb29dcce
    return d3
      .line()
      .x(function(d) {
        return d.x;
      })
      .y(function(d) {
        return d.y;
      })(srcTrgDataArray);
  };
  Edge.getArrowSize = function(viewWrapperElem) {
    if (viewWrapperElem === void 0) {
      viewWrapperElem = document;
    }

    const defEndArrowElement = viewWrapperElem.querySelector(
      'defs>marker>.arrow'
    );

    return defEndArrowElement.getBoundingClientRect();
  };
  Edge.getEdgePathElement = function(edge, viewWrapperElem) {
    if (viewWrapperElem === void 0) {
      viewWrapperElem = document;
    }

    return viewWrapperElem.querySelector(
      '#edge-' +
        edge.source +
        '-' +
        edge.target +
        '-container>.edge-container>.edge>.edge-path'
    );
  };
  Edge.parsePathToXY = function(edgePathElement) {
    const response = {
      source: { x: 0, y: 0 },
      target: { x: 0, y: 0 },
    };

    if (edgePathElement) {
      let d = edgePathElement.getAttribute('d');

      d = d && d.replace(/^M/, '');
      d = d && d.replace(/L/, ',');
      const dArr = (d && d.split(',')) || [];
      const dArrNum = dArr.map(function(dimension) {
        return parseFloat(dimension);
      });

      if (dArr.length === 4) {
        response.source.x = dArrNum[0];
        response.source.y = dArrNum[1];
        response.target.x = dArrNum[2];
        response.target.y = dArrNum[3];
      }
    }

    return response;
  };
  Edge.getDefaultIntersectResponse = function() {
    return {
      xOff: 0,
      yOff: 0,
      intersect: {
        type: 'none',
        point: {
          x: 0,
          y: 0,
        },
      },
    };
  };
  Edge.getRotatedRectIntersect = function(
    defSvgRotatedRectElement,
    src,
    trg,
    includesArrow,
    viewWrapperElem
  ) {
    if (viewWrapperElem === void 0) {
      viewWrapperElem = document;
    }

    const response = Edge.getDefaultIntersectResponse();
    const arrowSize = Edge.getArrowSize(viewWrapperElem);
    const clientRect = defSvgRotatedRectElement.getBoundingClientRect();
    const widthAttr = defSvgRotatedRectElement.getAttribute('width');
    const heightAttr = defSvgRotatedRectElement.getAttribute('height');
    const w = widthAttr ? parseFloat(widthAttr) : clientRect.width;
    const h = heightAttr ? parseFloat(heightAttr) : clientRect.height;
    const trgX = trg.x || 0;
    const trgY = trg.y || 0;
    const srcX = src.x || 0;
    const srcY = src.y || 0;
    const top = trgY - h / 2;
    const bottom = trgY + h / 2;
    const left = trgX - w / 2;
    const right = trgX + w / 2;
    const line = svg_intersections_1.shape('line', {
      x1: srcX,
      y1: srcY,
      x2: trgX,
      y2: trgY,
    });
    // define rectangle
    const rect = {
      topLeft: new kld_affine_1.Point2D(left, top),
      bottomRight: new kld_affine_1.Point2D(right, bottom),
    };
    // convert rectangle corners to polygon (list of points)
    const poly = [
      rect.topLeft,
      new kld_affine_1.Point2D(rect.bottomRight.x, rect.topLeft.y),
      rect.bottomRight,
      new kld_affine_1.Point2D(rect.topLeft.x, rect.bottomRight.y),
    ];
    // find center point of rectangle
    const center = rect.topLeft.lerp(rect.bottomRight, 0.5);
    // get the rotation
    const transform = defSvgRotatedRectElement.getAttribute('transform');
    let rotate = transform
      ? transform.replace(/(rotate.[0-9]*.)|[^]/g, '$1')
      : null;
    let angle = 0;

    if (rotate) {
      // get the number
      rotate = rotate.replace(/^rotate\(|\)$/g, '');
      // define rotation in radians
      angle = (parseFloat(rotate) * Math.PI) / 180.0;
    }

    // create matrix for rotating around center of rectangle
    const rotation = kld_affine_1.Matrix2D.rotationAt(angle, center);
    // create new rotated polygon
    const rotatedPoly = poly.map(function(p) {
      return p.transform(rotation);
    });
    // find intersections
    const pathIntersect = kld_intersections_1.Intersection.intersectLinePolygon(
      line.params[0],
      line.params[1],
      rotatedPoly
    );

    if (pathIntersect.points.length > 0) {
      let arrowWidth = 0; //arrowSize.width;
      let arrowHeight = 0; //arrowSize.height;
      const xIntersect = pathIntersect.points[0].x;
      const yIntersect = pathIntersect.points[0].y;

      if (xIntersect > left && xIntersect < right && yIntersect > trgY) {
        // arrow points to the bottom of the node
        arrowHeight = arrowSize.height;
      } else if (xIntersect > left && xIntersect < right && yIntersect < trgY) {
        // arrow points to the top of the node
        arrowHeight = -arrowSize.height;
      } else if (yIntersect > top && yIntersect < bottom && xIntersect < trgX) {
        // arrow points to the left of the node
        arrowWidth = -arrowSize.width;
      } else {
        // arrow points to the right of the node
        arrowWidth = arrowSize.width;
      }

      response.xOff =
        trgX - xIntersect - (includesArrow ? arrowWidth / 1.25 : 0);
      response.yOff =
        trgY - yIntersect - (includesArrow ? arrowHeight / 1.25 : 0);
      response.intersect = pathIntersect.points[0];
    }

    return response;
  };
  Edge.getPathIntersect = function(
    defSvgPathElement,
    src,
    trg,
    includesArrow,
    viewWrapperElem
  ) {
    if (includesArrow === void 0) {
      includesArrow = true;
    }

    if (viewWrapperElem === void 0) {
      viewWrapperElem = document;
    }

    const response = Edge.getDefaultIntersectResponse();
    const arrowSize = Edge.getArrowSize(viewWrapperElem);
    // get the rectangular area around path
    const clientRect = defSvgPathElement.getBoundingClientRect();
    const w = clientRect.width;
    const h = clientRect.height;
    const trgX = trg.x || 0;
    const trgY = trg.y || 0;
    const srcX = src.x || 0;
    const srcY = src.y || 0;
    // calculate the positions of each corner relative to the trg position
    const top = trgY - h / 2;
    const bottom = trgY + h / 2;
    const left = trgX - w / 2;
    const right = trgX + w / 2;
    // modify the d property to add top and left to the x and y positions
    let d = defSvgPathElement.getAttribute('d');

    if (!/^M/.test(d)) {
      // doesn't look like what we expect.
      // TODO: add more use cases than simple moveTo commands
      return;
    }

    d = d.replace(/^M /, '');
    let dArr = d.split(/[ ,]+/);

    dArr = dArr.map(function(val, index) {
      let isEnd = false;

      if (/Z$/.test(val)) {
        val = val.replace(/Z$/, '');
        isEnd = true;
      }

      // index % 2 are x positions
      if (index % 2 === 0) {
        return parseFloat(val) + left + (isEnd ? 'Z' : '');
      }

      return parseFloat(val) + top + (isEnd ? 'Z' : '');
    });
    const pathIntersect = svg_intersections_1.intersect(
      svg_intersections_1.shape('path', { d: 'M ' + dArr.join(' ') }),
      svg_intersections_1.shape('line', {
        x1: srcX,
        y1: srcY,
        x2: trgX,
        y2: trgY,
      })
    );

    if (pathIntersect.points.length > 0) {
      let arrowWidth = 0; //arrowSize.width;
      let arrowHeight = 0; //arrowSize.height;
      const xIntersect = pathIntersect.points[0].x;
      const yIntersect = pathIntersect.points[0].y;
      let multiplier = 1;

      if (xIntersect > left && xIntersect < right) {
        const yIntersectDiff = yIntersect - trgY;

        multiplier = yIntersect < trgY ? -1 : 1;
        arrowHeight = arrowSize.height * multiplier;
        // Math.min is used to find a percentage of the arrow size
        // as the arrow approaches a horizontal or vertical vector
        // Math.abs is used to force the diff to be positive,
        // because we're using a multiplier instead and Math.min would choose a large
        // negative number as the minimum, which is undesirable.
        arrowHeight = arrowHeight * Math.min(Math.abs(yIntersectDiff), 1);
      }

      if (yIntersect > top && yIntersect < bottom) {
        const xIntersectDiff = xIntersect - trgX;

        multiplier = xIntersect < trgX ? -1 : 1;
        arrowWidth = arrowSize.width * multiplier;
        arrowWidth = arrowWidth * Math.min(Math.abs(xIntersectDiff), 1);
      }

      response.xOff =
        trgX - xIntersect - (includesArrow ? arrowWidth / 1.25 : 0);
      response.yOff =
        trgY - yIntersect - (includesArrow ? arrowHeight / 1.25 : 0);
      response.intersect = pathIntersect.points[0];
    }

    return response;
  };
  Edge.getCircleIntersect = function(
    defSvgCircleElement,
    src,
    trg,
    includesArrow,
    viewWrapperElem
  ) {
    if (includesArrow === void 0) {
      includesArrow = true;
    }

    if (viewWrapperElem === void 0) {
      viewWrapperElem = document;
    }

    const response = Edge.getDefaultIntersectResponse();
    const arrowSize = Edge.getArrowSize(viewWrapperElem);
    const arrowWidth = arrowSize.width;
    const arrowHeight = arrowSize.height;
    const clientRect = defSvgCircleElement.getBoundingClientRect();
    const parentElement = defSvgCircleElement.parentElement;
    let parentWidth = parentElement.getAttribute('width');
    let parentHeight = parentElement.getAttribute('width');

    if (parentWidth) {
      parentWidth = parseFloat(parentWidth);
    }

    if (parentHeight) {
      parentHeight = parseFloat(parentHeight);
    }

    const w = parentWidth ? parentWidth : clientRect.width;
    const h = parentHeight ? parentHeight : clientRect.height;
    const trgX = trg.x || 0;
    const trgY = trg.y || 0;
    const srcX = src.x || 0;
    const srcY = src.y || 0;
    // from the center of the node to the perimeter
    const arrowOffsetDiviser = 1.25;
    const offX = w / 2 + (includesArrow ? arrowWidth / arrowOffsetDiviser : 0);
    const offY = h / 2 + (includesArrow ? arrowHeight / arrowOffsetDiviser : 0);
    // Note: even though this is a circle function, we can use ellipse
    // because all circles are ellipses but not all ellipses are circles.
    const pathIntersect = svg_intersections_1.intersect(
      svg_intersections_1.shape('ellipse', {
        rx: offX,
        ry: offY,
        cx: trgX,
        cy: trgY,
      }),
      svg_intersections_1.shape('line', {
        x1: srcX,
        y1: srcY,
        x2: trgX,
        y2: trgY,
      })
    );

    if (pathIntersect.points.length > 0) {
      const xIntersect = pathIntersect.points[0].x;
      const yIntersect = pathIntersect.points[0].y;

      response.xOff = trgX - xIntersect;
      response.yOff = trgY - yIntersect;
      response.intersect = pathIntersect.points[0];
    }

    return response;
  };
  Edge.calculateOffset = function(
    nodeSize,
    src,
    trg,
    nodeKey,
    includesArrow,
    viewWrapperElem
  ) {
    if (includesArrow === void 0) {
      includesArrow = true;
    }

    if (viewWrapperElem === void 0) {
      viewWrapperElem = document;
    }

    let response = Edge.getDefaultIntersectResponse();

    if (!trg[nodeKey]) {
      return response;
    }

    // Note: document.getElementById is by far the fastest way to get a node.
    // compare 2.82ms for querySelector('#node-a2 use.node') vs
    // 0.31ms and 99us for document.getElementById()
    const nodeElem = document.getElementById('node-' + trg[nodeKey]);

    if (!nodeElem) {
      return response;
    }

    const trgNode = nodeElem.querySelector('use.node');

    // the test for trgNode.getAttributeNS makes sure we really have a node and not some other type of object
    if (!trgNode || (trgNode && !trgNode.getAttributeNS)) {
      return response;
    }

    const xlinkHref = trgNode.getAttributeNS(
      'http://www.w3.org/1999/xlink',
      'href'
    );

    if (!xlinkHref) {
      return response;
    }

    const defSvgRectElement = viewWrapperElem.querySelector(
      'defs>' + xlinkHref + ' rect:not([data-intersect-ignore=true])'
    );
    // Conditionally trying to select the element in other ways is faster than trying to
    // do the selection.
    const defSvgPathElement = !defSvgRectElement
      ? viewWrapperElem.querySelector(
          'defs>' + xlinkHref + ' path:not([data-intersect-ignore=true])'
        )
      : null;
    const defSvgCircleElement =
      !defSvgPathElement && !defSvgPathElement
        ? viewWrapperElem.querySelector(
            'defs>' +
              xlinkHref +
              ' circle:not([data-intersect-ignore=true]), defs>' +
              xlinkHref +
              ' ellipse:not([data-intersect-ignore=true]), defs>' +
              xlinkHref +
              ' polygon:not([data-intersect-ignore=true])'
          )
        : null;

    if (defSvgRectElement) {
      // it's a rectangle
      response = __assign(
        {},
        response,
        Edge.getRotatedRectIntersect(
          defSvgRectElement,
          src,
          trg,
          includesArrow,
          viewWrapperElem
        )
      );
    } else if (defSvgPathElement) {
      // it's a complex path
      response = __assign(
        {},
        response,
        Edge.getPathIntersect(
          defSvgPathElement,
          src,
          trg,
          includesArrow,
          viewWrapperElem
        )
      );
    } else {
      // it's a circle or some other type
      response = __assign(
        {},
        response,
        Edge.getCircleIntersect(
          defSvgCircleElement,
          src,
          trg,
          includesArrow,
          viewWrapperElem
        )
      );
    }

    return response;
  };
  Edge.getXlinkHref = function(edgeTypes, data) {
    if (data.type && edgeTypes[data.type]) {
      return edgeTypes[data.type].shapeId;
    } else if (edgeTypes.emptyEdge) {
      return edgeTypes.emptyEdge.shapeId;
    }

    return null;
  };
  Edge.prototype.getPathDescription = function(edge) {
    const _a = this.props,
      sourceNode = _a.sourceNode,
      targetNode = _a.targetNode,
      nodeKey = _a.nodeKey,
      nodeSize = _a.nodeSize,
      viewWrapperElem = _a.viewWrapperElem;
    const trgX = targetNode && targetNode.x ? targetNode.x : 0;
    const trgY = targetNode && targetNode.y ? targetNode.y : 0;
    const srcX = targetNode && sourceNode.x ? sourceNode.x : 0;
    const srcY = targetNode && sourceNode.y ? sourceNode.y : 0;
    // To calculate the offset for a specific node we use that node as the third parameter
    // and the accompanying node as the second parameter, representing where the line
    // comes from and where it's going to. Don't think of a line as a one-way arrow, but rather
    // a connection between two points. In this case, to obtain the offsets for the src we
    // write trg first, then src second. Vice versa to get the offsets for trg.
    const srcOff = Edge.calculateOffset(
      nodeSize || 0,
      targetNode,
      sourceNode,
      nodeKey,
      false,
      viewWrapperElem
    );
    const trgOff = Edge.calculateOffset(
      nodeSize || 0,
      sourceNode,
      targetNode,
      nodeKey,
      true,
      viewWrapperElem
    );
    const linePoints = [
      {
        x: srcX - srcOff.xOff,
        y: srcY - srcOff.yOff,
      },
      {
        x: trgX - trgOff.xOff,
        y: trgY - trgOff.yOff,
      },
    ];

    return Edge.lineFunction(linePoints);
  };
  Edge.prototype.renderHandleText = function(data) {
    return React.createElement(
      'text',
      {
        className: 'edge-text',
        textAnchor: 'middle',
        alignmentBaseline: 'central',
        transform: '' + this.getEdgeHandleTranslation(),
      },
      data.handleText
    );
  };
  Edge.prototype.renderLabelText = function(data) {
    const _a = this.getEdgeHandleRotation(),
      rotation = _a[0],
      isRotated = _a[1];
    const title = isRotated
      ? data.label_to + ' \u2194 ' + data.label_from
      : data.label_from + ' \u2194 ' + data.label_to;

    return React.createElement(
      'text',
      {
        className: 'edge-text',
        textAnchor: 'middle',
        alignmentBaseline: 'central',
        style: { fontSize: '11px', stroke: 'none', fill: 'black' },
        transform:
          this.getEdgeHandleTranslation() + ' ' + rotation + ' translate(0,-5)',
      },
      title
    );
  };
  Edge.prototype.render = function() {
    const _a = this.props,
      data = _a.data,
      edgeTypes = _a.edgeTypes,
      edgeHandleSize = _a.edgeHandleSize,
      viewWrapperElem = _a.viewWrapperElem;

    if (!viewWrapperElem) {
      return null;
    }

    const id = (data.source || '') + '_' + data.target;
    const className = graph_util_1['default'].classNames('edge', {
      selected: this.props.isSelected,
    });
    const edgeHandleTransformation = this.getEdgeHandleTransformation();

    // @ts-ignore
    return React.createElement(
      'g',
      {
        className: 'edge-container',
        'data-source': data.source,
        'data-target': data.target,
      },
      React.createElement(
        'g',
        { className: className },
        React.createElement('path', {
          className: 'edge-path',
          d: this.getPathDescription(data) || undefined,
        }),
        React.createElement('use', {
          xlinkHref: Edge.getXlinkHref(edgeTypes, data),
          width: edgeHandleSize,
          height: edgeHandleSize,
          transform: edgeHandleTransformation,
          style: { transform: edgeHandleTransformation },
        }),
        data.handleText && this.renderHandleText(data),
        data.label_from && data.label_to && this.renderLabelText(data)
      ),
      React.createElement(
        'g',
        { className: 'edge-mouse-handler' },
        React.createElement('title', null, data.handleTooltipText),
        React.createElement('path', {
          className: 'edge-overlay-path',
          ref: this.edgeOverlayRef,
          id: id,
          'data-source': data.source,
          'data-target': data.target,
          d: this.getPathDescription(data) || undefined,
        })
      )
    );
  };
  Edge.defaultProps = {
    edgeHandleSize: 50,
    isSelected: false,
    rotateEdgeHandle: true,
  };

  return Edge;
})(React.Component);

exports['default'] = Edge;
