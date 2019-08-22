"use strict";
exports.__esModule = true;
var React = require("react");
var enzyme_1 = require("enzyme");
var arrowhead_marker_1 = require("../../src/components/arrowhead-marker");
describe("ArrowheadMarker component", function () {
    var output = null;
    beforeEach(function () {
        output = enzyme_1.shallow(React.createElement(arrowhead_marker_1["default"], null));
    });
    describe("render method", function () {
        it("renders without props", function () {
            expect(output.props().id).toEqual("end-arrow");
            expect(output.props().viewBox).toEqual("0 -4 8 8");
            expect(output.props().refX).toEqual("4");
            expect(output.props().markerWidth).toEqual("8");
            expect(output.props().markerHeight).toEqual("8");
            expect(output.children().length).toEqual(1);
            var arrowPathProps = output
                .children()
                .first()
                .props();
            expect(arrowPathProps.className).toEqual("arrow");
            expect(arrowPathProps.d).toEqual("M0,-4L8,0L0,4");
        });
        it("renders with props", function () {
            output.setProps({
                edgeArrowSize: 3
            });
            expect(output.props().viewBox).toEqual("0 -1.5 3 3");
            expect(output.props().refX).toEqual("1.5");
            expect(output.props().markerWidth).toEqual("3");
            expect(output.props().markerHeight).toEqual("3");
            var arrowPathProps = output
                .children()
                .first()
                .props();
            expect(arrowPathProps.d).toEqual("M0,-1.5L3,0L0,1.5");
        });
        it("renders without an edgeArrowSize", function () {
            output.setProps({
                edgeArrowSize: null
            });
            expect(output.getElement()).toBeNull();
        });
    });
});
