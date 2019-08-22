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
const BwdlNodeForm = /** @class */ (function(_super) {
  __extends(BwdlNodeForm, _super);

  function BwdlNodeForm() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  BwdlNodeForm.prototype.renderNextOptions = function(value) {
    const nextChoices = this.props.nextChoices;
    // This function is defined and used locally to avoid tslint's jsx-no-lambda error.
    // It requires the local value variable, so it cannot be defined in the class.
    const handleChange = function(event) {
      event.target.value = value;
    };

    return React.createElement(
      'select',
      { defaultValue: value, onChange: handleChange },
      nextChoices.map(function(choice) {
        return React.createElement('option', { key: choice }, choice);
      })
    );
  };
  BwdlNodeForm.prototype.renderAndObjectArray = function(andObjectArray) {
    const _this = this;

    return andObjectArray.map(function(andObject, index) {
      return React.createElement(
        'div',
        { className: 'and-object', key: index },
        Object.keys(andObject).map(function(key) {
          return React.createElement(
            'div',
            { className: 'and-object-value', key: key },
            React.createElement('label', null, key, ':'),
            ' ',
            _this.renderKey(key, andObject[key])
          );
        })
      );
    });
  };
  BwdlNodeForm.prototype.renderChoicesOptions = function(value) {
    const _this = this;

    return value.map(function(choice, index) {
      return React.createElement(
        'div',
        { key: index, className: 'choices' },
        Object.keys(choice).map(function(choiceOption) {
          if (choiceOption === 'Next') {
            // "Next" option
            return React.createElement(
              'div',
              { key: choiceOption },
              React.createElement('label', null, 'Next:'),
              ' ',
              _this.renderNextOptions(choice[choiceOption])
            );
          } else if (Array.isArray(choice[choiceOption])) {
            // "And" array
            return React.createElement(
              'div',
              { key: choiceOption },
              React.createElement('label', null, choiceOption, ':'),
              ' ',
              _this.renderAndObjectArray(choice[choiceOption])
            );
          }

          // text option
          return React.createElement(
            'div',
            { key: choiceOption },
            React.createElement('label', null, choiceOption, ':'),
            ' ',
            choice[choiceOption]
          );
        })
      );
    });
  };
  BwdlNodeForm.prototype.renderKey = function(key, value) {
    const _this = this;

    if (key === 'Next') {
      return this.renderNextOptions(value);
    } else if (key === 'Choices') {
      return this.renderChoicesOptions(value);
    } else if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      return value;
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      return Object.keys(value).map(function(valueKey) {
        return React.createElement(
          'div',
          { key: valueKey, className: 'node-property node-sub-property' },
          React.createElement('label', null, valueKey, ':'),
          ' ',
          _this.renderKey(valueKey, value[valueKey])
        );
      });
    }

    return React.createElement('pre', null, JSON.stringify(value, null, 2));
  };
  BwdlNodeForm.prototype.render = function() {
    const _this = this;
    const _a = this.props,
      bwdlNode = _a.bwdlNode,
      bwdlNodeKey = _a.bwdlNodeKey;

    return React.createElement(
      'div',
      null,
      React.createElement('h2', null, bwdlNodeKey),
      Object.keys(bwdlNode).map(function(key) {
        return React.createElement(
          'div',
          { key: key, className: 'node-property' },
          React.createElement('label', null, key, ':'),
          ' ',
          _this.renderKey(key, bwdlNode[key])
        );
      })
    );
  };

  return BwdlNodeForm;
})(React.Component);

exports['default'] = BwdlNodeForm;
