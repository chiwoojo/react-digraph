"use strict";
exports.__esModule = true;
var snap_to_grid_1 = require("../../../src/utilities/layout-engine/snap-to-grid");
describe("SnapToGrid", function () {
    var output = null;
    describe("class", function () {
        it("is defined", function () {
            expect(snap_to_grid_1["default"]).toBeDefined();
        });
        it("instantiates", function () {
            var snapToGrid = new snap_to_grid_1["default"]();
        });
    });
    describe("calculatePosition method", function () {
        it("adjusts the node position to be centered on a grid space", function () {
            var snapToGrid = new snap_to_grid_1["default"]({
                gridSpacing: 10
            });
            var newPosition = snapToGrid.calculatePosition({ x: 9, y: 8 });
            var expected = { x: 5, y: 5 };
            expect(JSON.stringify(newPosition)).toEqual(JSON.stringify(expected));
        });
        it("uses the default grid spacing", function () {
            var snapToGrid = new snap_to_grid_1["default"]({});
            var newPosition = snapToGrid.calculatePosition({ x: 9, y: 8 });
            var expected = { x: 5, y: 5 };
            expect(JSON.stringify(newPosition)).toEqual(JSON.stringify(expected));
        });
        it("defaults the x and y to 0 when they are not present", function () {
            var snapToGrid = new snap_to_grid_1["default"]({
                gridSpacing: 10
            });
            var newPosition = snapToGrid.calculatePosition({});
            var expected = { x: 0, y: 0 };
            expect(JSON.stringify(newPosition)).toEqual(JSON.stringify(expected));
        });
        it("moves the positions in the reverse direction", function () {
            var snapToGrid = new snap_to_grid_1["default"]({
                gridSpacing: 10
            });
            var newPosition = snapToGrid.calculatePosition({ x: 11, y: 11 });
            var expected = { x: 15, y: 15 };
            expect(JSON.stringify(newPosition)).toEqual(JSON.stringify(expected));
        });
    });
});
