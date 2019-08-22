"use strict";
exports.__esModule = true;
var React = require("react");
var enzyme_1 = require("enzyme");
var arrowhead_marker_1 = require("../../src/components/arrowhead-marker");
var background_pattern_1 = require("../../src/components/background-pattern");
var defs_1 = require("../../src/components/defs");
var dropshadow_filter_1 = require("../../src/components/dropshadow-filter");
describe("Circle component", function () {
    var output;
    var nodeTypes;
    var nodeSubtypes;
    var edgeTypes;
    beforeEach(function () {
        nodeTypes = {
            testType: {
                shape: React.createElement("circle", { id: "nodeTypeCircle" })
            }
        };
        nodeSubtypes = {
            testSubtype: {
                shape: React.createElement("rect", { id: "nodeSubtypeRect" })
            }
        };
        edgeTypes = {
            testEdgeType: {
                shape: React.createElement("path", { id: "edgePath" })
            }
        };
        output = enzyme_1.shallow(React.createElement(defs_1["default"], { nodeTypes: nodeTypes, nodeSubtypes: nodeSubtypes, edgeTypes: edgeTypes }));
    });
    describe("render method", function () {
        it("renders without optional props", function () {
            expect(output.find("circle").length).toEqual(1);
            expect(output.find("rect").length).toEqual(1);
            expect(output.find("path").length).toEqual(1);
            expect(output.find(arrowhead_marker_1["default"]).length).toEqual(1);
            expect(output.find(arrowhead_marker_1["default"]).props().edgeArrowSize).toEqual(8);
            expect(output.find(background_pattern_1["default"]).length).toEqual(1);
            expect(output.find(dropshadow_filter_1["default"]).length).toEqual(1);
        });
        it("renders with optional props", function () {
            output.setProps({
                edgeArrowSize: 4,
                gridDotSize: 3,
                gridSpacing: 10
            });
            expect(output.find(arrowhead_marker_1["default"]).props().edgeArrowSize).toEqual(4);
            expect(output.find(background_pattern_1["default"]).props().gridSpacing).toEqual(10);
            expect(output.find(background_pattern_1["default"]).props().gridDotSize).toEqual(3);
        });
        it("uses the renderDefs prop callback", function () {
            output.setProps({
                renderDefs: function () {
                    return React.createElement("ellipse", { id: "renderDefsEllipse" });
                }
            });
            expect(output.find("ellipse").length).toEqual(1);
            expect(output.find("ellipse").props().id).toEqual("renderDefsEllipse");
        });
    });
});
