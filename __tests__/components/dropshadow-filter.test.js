"use strict";
exports.__esModule = true;
var React = require("react");
var enzyme_1 = require("enzyme");
var dropshadow_filter_1 = require("../../src/components/dropshadow-filter");
describe("DropshadowFilter component", function () {
    var output = null;
    beforeEach(function () {
        output = enzyme_1.shallow(React.createElement(dropshadow_filter_1["default"], null));
    });
    describe("render method", function () {
        it("renders", function () {
            expect(output.props().id).toEqual("dropshadow");
            expect(output.props().height).toEqual("130%");
            var feGaussianBlur = output.find("feGaussianBlur");
            expect(feGaussianBlur.props()["in"]).toEqual("SourceAlpha");
            expect(feGaussianBlur.props().stdDeviation).toEqual("3");
            var feOffset = output.find("feOffset");
            expect(feOffset.props().dx).toEqual("2");
            expect(feOffset.props().dy).toEqual("2");
            expect(feOffset.props().result).toEqual("offsetblur");
            var feFuncA = output.find("feComponentTransfer>feFuncA");
            expect(feFuncA.props().type).toEqual("linear");
            expect(feFuncA.props().slope).toEqual("0.1");
            var feMergeNode = output.find("feMerge>feMergeNode");
            expect(feMergeNode.length).toEqual(2);
            expect(feMergeNode.last().props()["in"]).toEqual("SourceGraphic");
        });
    });
});
