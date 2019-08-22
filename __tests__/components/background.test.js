"use strict";
exports.__esModule = true;
var React = require("react");
var enzyme_1 = require("enzyme");
var background_1 = require("../../src/components/background");
describe("Background component", function () {
    var output;
    var instance;
    beforeEach(function () {
        output = enzyme_1.shallow(React.createElement(background_1["default"], null));
        instance = output.instance();
    });
    describe("render method", function () {
        it("renders without props", function () {
            expect(output.props().className).toEqual("background");
            expect(output.props().x).toEqual(-10240);
            expect(output.props().y).toEqual(-10240);
            expect(output.props().width).toEqual(40960);
            expect(output.props().height).toEqual(40960);
            expect(output.props().fill).toEqual("url(#grid)");
        });
        it("renders with props", function () {
            output.setProps({
                backgroundFillId: "#test",
                gridSize: 400
            });
            expect(output.props().x).toEqual(-100);
            expect(output.props().y).toEqual(-100);
            expect(output.props().width).toEqual(400);
            expect(output.props().height).toEqual(400);
            expect(output.props().fill).toEqual("url(#test)");
        });
    });
    describe("renderBackground method", function () {
        it("uses the renderBackground callback", function () {
            var renderBackground = jasmine.createSpy().and.returnValue("test");
            output.setProps({
                gridSize: 1000,
                renderBackground: renderBackground
            });
            expect(renderBackground).toHaveBeenCalledWith(1000);
        });
    });
});
