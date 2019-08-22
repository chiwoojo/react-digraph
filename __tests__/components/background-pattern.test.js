"use strict";
exports.__esModule = true;
var React = require("react");
var enzyme_1 = require("enzyme");
var background_pattern_1 = require("../../src/components/background-pattern");
describe("BackgroundPattern component", function () {
    var output = null;
    beforeEach(function () {
        output = enzyme_1.shallow(React.createElement(background_pattern_1["default"], null));
    });
    describe("render method", function () {
        it("renders without props", function () {
            expect(output.props().id).toEqual("grid");
            expect(output.props().width).toEqual(undefined);
            expect(output.props().height).toEqual(undefined);
            expect(output.props().patternUnits).toEqual("userSpaceOnUse");
        });
        it("renders with props", function () {
            output.setProps({
                gridDotSize: 3,
                gridSpacing: 10
            });
            expect(output.props().width).toEqual(10);
            expect(output.props().height).toEqual(10);
            expect(output.children().length).toEqual(1);
            var circleProps = output
                .children()
                .first()
                .props();
            expect(circleProps.gridSpacing).toEqual(10);
            expect(circleProps.gridDotSize).toEqual(3);
        });
    });
});
