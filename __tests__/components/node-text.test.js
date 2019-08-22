"use strict";
exports.__esModule = true;
var React = require("react");
var enzyme_1 = require("enzyme");
var node_text_1 = require("../../src/components/node-text");
describe("NodeText component", function () {
    var output = null;
    var nodeData;
    var nodeTypes;
    beforeEach(function () {
        nodeData = {
            title: "Test",
            type: "fake"
        };
        nodeTypes = {
            fake: {
                typeText: "Fake"
            }
        };
        output = enzyme_1.shallow(React.createElement(node_text_1["default"], { data: nodeData, nodeTypes: nodeTypes, isSelected: false }));
    });
    describe("render method", function () {
        it("renders", function () {
            expect(output.props().className).toEqual("node-text");
            var tspan = output.find("tspan");
            expect(tspan.at(0).text()).toEqual("Fake");
            expect(tspan.at(1).text()).toEqual("Test");
            expect(tspan.at(1).props().x).toEqual(0);
            expect(tspan.at(1).props().dy).toEqual(18);
            var title = output.find("title");
            expect(title.at(0).text()).toEqual("Test");
        });
        it("renders as selected", function () {
            output.setProps({
                isSelected: true
            });
            expect(output.props().className).toEqual("node-text selected");
        });
        it("does not render a title element when there is no title", function () {
            nodeData.title = null;
            output.setProps({
                nodeData: nodeData
            });
            var tspan = output.find("tspan");
            var title = output.find("title");
            expect(tspan.length).toEqual(1);
            expect(title.length).toEqual(0);
        });
        it("truncates node title characters when maxTitleChars is supplied", function () {
            output.setProps({
                maxTitleChars: 2
            });
            var tspan = output.find("tspan");
            expect(tspan.at(1).text()).toEqual("Te");
        });
    });
    describe("getTypeText method", function () {
        it("returns the node typeText", function () {
            var result = output.instance().getTypeText(nodeData, nodeTypes);
            expect(result).toEqual("Fake");
        });
        it("returns the emptyNode typeText", function () {
            nodeData.type = "notFound";
            nodeTypes.emptyNode = {
                typeText: "Empty"
            };
            var result = output.instance().getTypeText(nodeData, nodeTypes);
            expect(result).toEqual("Empty");
        });
        it("returns null when the type is not available and there is no emptyNode", function () {
            nodeData.type = "notFound";
            var result = output.instance().getTypeText(nodeData, nodeTypes);
            expect(result).toEqual(null);
        });
    });
});
