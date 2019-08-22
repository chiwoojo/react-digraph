"use strict";
exports.__esModule = true;
var layout_engine_1 = require("../../../src/utilities/layout-engine/layout-engine");
describe("LayoutEngine", function () {
    var output = null;
    describe("class", function () {
        it("is defined", function () {
            expect(layout_engine_1["default"]).toBeDefined();
        });
    });
    describe("calculatePosition method", function () {
        it("returns the node with no changes", function () {
            var layoutEngine = new layout_engine_1["default"]();
            var position = { x: 1, y: 2 };
            var newPosition = layoutEngine.calculatePosition(position);
            expect(newPosition).toEqual(position);
        });
    });
    describe("getPositionForNode method", function () {
        it("does not modify the node", function () {
            var layoutEngine = new layout_engine_1["default"]();
            var node = { x: 1, y: 2 };
            var newPosition = layoutEngine.getPositionForNode(node);
            expect(newPosition).toEqual(node);
        });
    });
});
