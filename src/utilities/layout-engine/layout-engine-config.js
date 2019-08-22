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
const none_1 = require('./none');
const snap_to_grid_1 = require('./snap-to-grid');
const vertical_tree_1 = require('./vertical-tree');
const horizontal_tree_1 = require('./horizontal-tree');

exports.LayoutEngines = {
  None: none_1['default'],
  SnapToGrid: snap_to_grid_1['default'],
  VerticalTree: vertical_tree_1['default'],
  HorizontalTree: horizontal_tree_1['default'],
};
