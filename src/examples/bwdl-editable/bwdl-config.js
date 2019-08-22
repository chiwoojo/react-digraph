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
/*
  Example config for GraphView component
*/
const React = require('react');

exports.NODE_KEY = 'title'; // Key used to identify nodes
// These keys are arbitrary (but must match the config)
// However, GraphView renders text differently for empty types
// so this has to be passed in if that behavior is desired.
exports.EMPTY_TYPE = 'empty'; // Empty node type
exports.CHOICE_TYPE = 'Choice';
exports.TASK_TYPE = 'Task';
exports.PASS_TYPE = 'Pass';
exports.WAIT_TYPE = 'Wait';
exports.TERMINATOR_TYPE = 'Terminator';
exports.SPECIAL_CHILD_SUBTYPE = 'specialChild';
exports.EMPTY_EDGE_TYPE = 'emptyEdge';
exports.SPECIAL_EDGE_TYPE = 'specialEdge';
exports.nodeTypes = [
  exports.EMPTY_TYPE,
  exports.CHOICE_TYPE,
  exports.TASK_TYPE,
  exports.PASS_TYPE,
  exports.WAIT_TYPE,
  exports.TERMINATOR_TYPE,
];
exports.edgeTypes = [exports.EMPTY_EDGE_TYPE, exports.SPECIAL_EDGE_TYPE];
const EmptyShape = React.createElement(
  'symbol',
  { viewBox: '0 0 100 100', id: 'empty', width: '100', height: '100' },
  React.createElement('circle', { cx: '50', cy: '50', r: '45' })
);
const ChoiceShape = React.createElement(
  'symbol',
  { viewBox: '0 0 100 100', id: 'choice', width: '100', height: '100' },
  React.createElement('rect', {
    transform: 'translate(50, 5) rotate(45)',
    width: '65',
    height: '65',
  })
);
const TaskShape = React.createElement(
  'symbol',
  { viewBox: '0 0 100 100', id: 'task', width: '100', height: '100' },
  React.createElement('polygon', { points: '50,5 20,98 95,37 5,37 80,98' })
);
const PassShape = React.createElement(
  'symbol',
  { viewBox: '0 0 100 100', id: 'pass', width: '100', height: '100' },
  React.createElement('rect', {
    transform: 'translate(7.5, 10)',
    width: '85',
    height: '85',
  })
);
const WaitShape = React.createElement(
  'symbol',
  { viewBox: '0 0 100 100', id: 'wait', width: '100', height: '100' },
  React.createElement('circle', {
    cx: '50',
    cy: '50',
    r: '45',
    transform: 'translate(0, 2)',
  })
);
const TerminatorShape = React.createElement(
  'symbol',
  { viewBox: '0 0 100 100', id: 'terminator', width: '100', height: '100' },
  React.createElement('rect', {
    width: '80',
    height: '80',
    rx: '15',
    ry: '15',
    transform: 'translate(10, 10)',
  })
);
const SpecialChildShape = React.createElement(
  'symbol',
  { viewBox: '0 0 100 100', id: 'specialChild' },
  React.createElement('rect', { x: '2.5', y: '0', width: '95', height: '97.5' })
);
const EmptyEdgeShape = React.createElement(
  'symbol',
  { viewBox: '0 0 50 50', id: 'emptyEdge' },
  React.createElement('circle', {
    cx: '25',
    cy: '25',
    r: '8',
    fill: 'currentColor',
  })
);
const SpecialEdgeShape = React.createElement(
  'symbol',
  { viewBox: '0 0 50 50', id: 'specialEdge' },
  React.createElement('rect', {
    transform: 'rotate(45)',
    x: '27.5',
    y: '-7.5',
    width: '15',
    height: '15',
    fill: 'currentColor',
  })
);

exports['default'] = {
  EdgeTypes: {
    emptyEdge: {
      shape: EmptyEdgeShape,
      shapeId: '#emptyEdge',
    },
    specialEdge: {
      shape: SpecialEdgeShape,
      shapeId: '#specialEdge',
    },
  },
  NodeSubtypes: {
    specialChild: {
      shape: SpecialChildShape,
      shapeId: '#specialChild',
    },
  },
  NodeTypes: {
    Choice: {
      shape: ChoiceShape,
      shapeId: '#choice',
      typeText: 'Choice',
    },
    emptyNode: {
      shape: EmptyShape,
      shapeId: '#empty',
      typeText: 'None',
    },
    Pass: {
      shape: PassShape,
      shapeId: '#pass',
      typeText: 'Pass',
    },
    Task: {
      shape: TaskShape,
      shapeId: '#task',
      typeText: 'Task',
    },
    Terminator: {
      shape: TerminatorShape,
      shapeId: '#terminator',
      typeText: 'Terminator',
    },
    Wait: {
      shape: WaitShape,
      shapeId: '#wait',
      typeText: 'Wait',
    },
  },
};
