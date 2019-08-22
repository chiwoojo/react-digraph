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
/*
  Zoom slider and zoom to fit controls for GraphView
*/
const React = require('react');
const html_react_parser_1 = require('html-react-parser');
// @ts-ignore - Cannot get definitions for specific SVGs.
const expand_svg_1 = require('@fortawesome/fontawesome-free/svgs/solid/expand.svg');
const steps = 100; // Slider steps
const parsedIcon = html_react_parser_1['default'](expand_svg_1['default']); //  parse SVG once
const GraphControls = /** @class */ (function(_super) {
  __extends(GraphControls, _super);

  function GraphControls() {
    const _this = (_super !== null && _super.apply(this, arguments)) || this;

    // Modify current zoom of graph-view
    _this.zoom = function(e) {
      const _a = _this.props,
        minZoom = _a.minZoom,
        maxZoom = _a.maxZoom;
      const sliderVal = e.target.value;
      const zoomLevelNext = _this.sliderToZoom(sliderVal);
      const delta = zoomLevelNext - _this.props.zoomLevel;

      if (zoomLevelNext <= (maxZoom || 0) && zoomLevelNext >= (minZoom || 0)) {
        _this.props.modifyZoom(delta);
      }
    };

    return _this;
  }
  // Convert slider val (0-steps) to original zoom value range
  GraphControls.prototype.sliderToZoom = function(val) {
    const _a = this.props,
      minZoom = _a.minZoom,
      maxZoom = _a.maxZoom;

    return (val * ((maxZoom || 0) - (minZoom || 0))) / steps + (minZoom || 0);
  };
  // Convert zoom val (minZoom-maxZoom) to slider range
  GraphControls.prototype.zoomToSlider = function(val) {
    const _a = this.props,
      minZoom = _a.minZoom,
      maxZoom = _a.maxZoom;

    return ((val - (minZoom || 0)) * steps) / ((maxZoom || 0) - (minZoom || 0));
  };
  GraphControls.prototype.render = function() {
    return React.createElement(
      'div',
      { className: 'graph-controls' },
      React.createElement(
        'div',
        { className: 'slider-wrapper' },
        React.createElement('span', null, '-'),
        React.createElement('input', {
          type: 'range',
          className: 'slider',
          min: this.zoomToSlider(this.props.minZoom || 0),
          max: this.zoomToSlider(this.props.maxZoom || 0),
          value: this.zoomToSlider(this.props.zoomLevel),
          onChange: this.zoom,
          step: '1',
        }),
        React.createElement('span', null, '+')
      ),
      React.createElement(
        'button',
        {
          type: 'button',
          className: 'slider-button',
          onMouseDown: this.props.zoomToFit,
        },
        parsedIcon
      )
    );
  };
  GraphControls.defaultProps = {
    maxZoom: 1.5,
    minZoom: 0.15,
  };

  return GraphControls;
})(React.Component);

exports['default'] = GraphControls;
