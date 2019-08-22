"use strict";
exports.__esModule = true;
var React = require("react");
var enzyme_1 = require("enzyme");
var circle_1 = require("../../src/components/circle");
describe("Circle component", function () {
    var output = null;
    beforeEach(function () {
        output = enzyme_1.shallow(React.createElement(circle_1["default"], null));
    });
    describe("render method", function () {
        it("renders without props", function () {
            expect(output.props().className).toEqual("circle");
            expect(output.props().cx).toEqual(18);
            expect(output.props().cy).toEqual(18);
            expect(output.props().r).toEqual(2);
        });
        it("renders with props", function () {
            output.setProps({
                gridDotSize: 3,
                gridSpacing: 10
            });
            expect(output.props().className).toEqual("circle");
            expect(output.props().cx).toEqual(5);
            expect(output.props().cy).toEqual(5);
            expect(output.props().r).toEqual(3);
        });
    });
});
