"use strict";
exports.__esModule = true;
var React = require("react");
var enzyme_1 = require("enzyme");
var graph_controls_1 = require("../../src/components/graph-controls");
describe("GraphControls component", function () {
    var output = null;
    var zoomToFit;
    var modifyZoom;
    beforeEach(function () {
        zoomToFit = jasmine.createSpy();
        modifyZoom = jasmine.createSpy();
        output = enzyme_1.shallow(React.createElement(graph_controls_1["default"], { zoomLevel: 0, zoomToFit: zoomToFit, modifyZoom: modifyZoom }));
    });
    describe("render method", function () {
        it("renders", function () {
            expect(output.props().className).toEqual("graph-controls");
            expect(output
                .children()
                .first()
                .props().className).toEqual("slider-wrapper");
            var rangeInput = output.find("input.slider");
            expect(rangeInput.length).toEqual(1);
            expect(rangeInput.props().type).toEqual("range");
            expect(rangeInput.props().min).toEqual(0);
            expect(rangeInput.props().max).toEqual(100);
            expect(rangeInput.props().value).toEqual(-11.11111111111111);
            expect(rangeInput.props().step).toEqual("1");
        });
        it("renders with a custom min and max zoom", function () {
            output.setProps({
                maxZoom: 0.9,
                minZoom: 0
            });
            var rangeInput = output.find("input.slider");
            expect(rangeInput.props().min).toEqual(0);
            expect(rangeInput.props().max).toEqual(100);
            expect(rangeInput.props().value).toEqual(0);
        });
        it("zooms on change", function () {
            var rangeInput = output.find("input");
            rangeInput.simulate("change", {
                target: {
                    value: 55
                }
            });
            expect(modifyZoom).toHaveBeenCalledWith(0.8925000000000001);
        });
    });
    describe("zoom method", function () {
        it("calls modifyZoom callback with the new zoom delta", function () {
            output.instance().zoom({
                target: {
                    value: 55
                }
            });
            expect(modifyZoom).toHaveBeenCalledWith(0.8925000000000001);
        });
        it("does not call modifyZoom callback when the zoom level is greater than max", function () {
            output.instance().zoom({
                target: {
                    value: 101
                }
            });
            expect(modifyZoom).not.toHaveBeenCalled();
        });
        it("does not call modifyZoom callback when the zoom level is less than min", function () {
            output.instance().zoom({
                target: {
                    value: -1
                }
            });
            expect(modifyZoom).not.toHaveBeenCalled();
        });
    });
    describe("zoomToSlider method", function () {
        it("converts a value to a decimal-based slider position", function () {
            var result = output.instance().zoomToSlider(10);
            expect(result).toEqual(729.6296296296296);
        });
    });
});
