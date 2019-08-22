"use strict";
exports.__esModule = true;
var d3 = require("d3");
var React = require("react");
var enzyme_1 = require("enzyme");
var node_1 = require("../../src/components/node");
var node_text_1 = require("../../src/components/node-text");
describe("Node component", function () {
    var output = null;
    var nodeData;
    var nodeTypes;
    var nodeSubtypes;
    var onNodeMouseEnter;
    var onNodeMouseLeave;
    var onNodeMove;
    var onNodeSelected;
    var onNodeUpdate;
    beforeEach(function () {
        nodeData = {
            uuid: "1",
            title: "Test",
            type: "emptyNode",
            x: 5,
            y: 10
        };
        nodeTypes = {
            emptyNode: {
                shapeId: "#test"
            }
        };
        nodeSubtypes = {};
        onNodeMouseEnter = jasmine.createSpy();
        onNodeMouseLeave = jasmine.createSpy();
        onNodeMove = jasmine.createSpy();
        onNodeSelected = jasmine.createSpy();
        onNodeUpdate = jasmine.createSpy();
        spyOn(document, "querySelector").and.returnValue({
            getAttribute: jasmine.createSpy().and.returnValue(100),
            getBoundingClientRect: jasmine.createSpy().and.returnValue({
                width: 0,
                height: 0
            })
        });
        // this gets around d3 being readonly, we need to customize the event object
        var globalEvent = {
            sourceEvent: {}
        };
        Object.defineProperty(d3, "event", {
            get: function () {
                return globalEvent;
            },
            set: function (event) {
                globalEvent = event;
            }
        });
        output = enzyme_1.shallow(React.createElement(node_1["default"], { data: nodeData, index: 0, id: "test-node", nodeKey: "uuid", nodeTypes: nodeTypes, nodeSubtypes: nodeSubtypes, nodeSize: 100, isSelected: false, onNodeMouseEnter: onNodeMouseEnter, onNodeMouseLeave: onNodeMouseLeave, onNodeMove: onNodeMove, onNodeSelected: onNodeSelected, onNodeUpdate: onNodeUpdate }));
    });
    describe("render method", function () {
        it("renders", function () {
            expect(output.props().className).toEqual("node emptyNode");
            expect(output.props().transform).toEqual("translate(5, 10)");
            var nodeShape = output.find(".shape > use");
            expect(nodeShape.props()["data-index"]).toEqual(0);
            expect(nodeShape.props().className).toEqual("node");
            expect(nodeShape.props().x).toEqual(-50);
            expect(nodeShape.props().y).toEqual(-50);
            expect(nodeShape.props().width).toEqual(100);
            expect(nodeShape.props().height).toEqual(100);
            expect(nodeShape.props().xlinkHref).toEqual("#test");
            var nodeText = output.find(node_text_1["default"]);
            expect(nodeText.length).toEqual(1);
        });
        it("calls handleMouseOver", function () {
            var event = {
                test: true
            };
            output
                .find("g.node")
                .props()
                .onMouseOver(event);
            expect(onNodeMouseEnter).toHaveBeenCalledWith(event, nodeData, true);
        });
        it("calls handleMouseOut", function () {
            var event = {
                test: true
            };
            output.setState({
                hovered: true
            });
            output
                .find("g.node")
                .props()
                .onMouseOut(event);
            expect(onNodeMouseLeave).toHaveBeenCalledWith(event, nodeData);
            expect(output.state().hovered).toEqual(false);
        });
    });
    describe("renderText method", function () {
        var renderNodeText;
        beforeEach(function () {
            renderNodeText = jasmine.createSpy().and.returnValue("success");
        });
        it("calls the renderNodeText callback", function () {
            output.setProps({
                renderNodeText: renderNodeText
            });
            var result = output.instance().renderText();
            expect(renderNodeText).toHaveBeenCalledWith(nodeData, "test-node", false);
            expect(result).toEqual("success");
        });
        it("creates its own NodeText element", function () {
            var result = output.instance().renderText();
            expect(renderNodeText).not.toHaveBeenCalled();
            expect(result.type.prototype.constructor.name).toEqual("NodeText");
        });
    });
    describe("renderShape method", function () {
        var renderNode;
        beforeEach(function () {
            renderNode = jasmine.createSpy().and.returnValue("success");
        });
        it("calls the renderNode callback", function () {
            output.setProps({
                renderNode: renderNode
            });
            var result = output.instance().renderShape();
            expect(renderNode).toHaveBeenCalledWith(output.instance().nodeRef, nodeData, "1", false, false);
            expect(result).toEqual("success");
        });
        it("returns a node shape without a subtype", function () {
            var result = enzyme_1.shallow(output.instance().renderShape());
            expect(renderNode).not.toHaveBeenCalledWith();
            expect(result.props().className).toEqual("shape");
            expect(result.props().height).toEqual(100);
            expect(result.props().width).toEqual(100);
            var nodeShape = result.find(".node");
            var nodeSubtypeShape = result.find(".subtype-shape");
            expect(nodeShape.length).toEqual(1);
            expect(nodeSubtypeShape.length).toEqual(0);
            expect(nodeShape.props()["data-index"]).toEqual(0);
            expect(nodeShape.props().className).toEqual("node");
            expect(nodeShape.props().x).toEqual(-50);
            expect(nodeShape.props().y).toEqual(-50);
            expect(nodeShape.props().width).toEqual(100);
            expect(nodeShape.props().height).toEqual(100);
            expect(nodeShape.props().xlinkHref).toEqual("#test");
        });
        it("returns a node shape with a subtype", function () {
            nodeData.subtype = "fake";
            nodeSubtypes.fake = {
                shapeId: "#blah"
            };
            output.setProps({
                data: nodeData,
                nodeSubtypes: nodeSubtypes
            });
            var result = enzyme_1.shallow(output.instance().renderShape());
            var nodeSubtypeShape = result.find(".subtype-shape");
            expect(nodeSubtypeShape.length).toEqual(1);
            expect(nodeSubtypeShape.props()["data-index"]).toEqual(0);
            expect(nodeSubtypeShape.props().className).toEqual("subtype-shape");
            expect(nodeSubtypeShape.props().x).toEqual(-50);
            expect(nodeSubtypeShape.props().y).toEqual(-50);
            expect(nodeSubtypeShape.props().width).toEqual(100);
            expect(nodeSubtypeShape.props().height).toEqual(100);
            expect(nodeSubtypeShape.props().xlinkHref).toEqual("#blah");
        });
    });
    describe("getNodeSubtypeXlinkHref method", function () {
        it("returns the shapeId from the nodeSubtypes object", function () {
            nodeData.subtype = "fake";
            nodeSubtypes.fake = {
                shapeId: "#blah"
            };
            var result = node_1["default"].getNodeSubtypeXlinkHref(nodeData, nodeSubtypes);
            expect(result).toEqual("#blah");
        });
        it("returns the emptyNode shapeId from the nodeSubtypes object", function () {
            nodeSubtypes.emptyNode = {
                shapeId: "#empty"
            };
            var result = node_1["default"].getNodeSubtypeXlinkHref(nodeData, nodeSubtypes);
            expect(result).toEqual("#empty");
        });
        it("returns null", function () {
            var result = node_1["default"].getNodeSubtypeXlinkHref(nodeData, nodeSubtypes);
            expect(result).toEqual(null);
        });
    });
    describe("getNodeTypeXlinkHref method", function () {
        beforeEach(function () {
            nodeData.type = "fake";
        });
        it("returns the shapeId from the nodeTypes object", function () {
            nodeTypes.fake = {
                shapeId: "#blah"
            };
            var result = node_1["default"].getNodeTypeXlinkHref(nodeData, nodeTypes);
            expect(result).toEqual("#blah");
        });
        it("returns the emptyNode shapeId from the nodeTypes object", function () {
            nodeTypes.emptyNode = {
                shapeId: "#empty"
            };
            var result = node_1["default"].getNodeTypeXlinkHref(nodeData, nodeTypes);
            expect(result).toEqual("#empty");
        });
        it("returns null", function () {
            delete nodeTypes.emptyNode;
            var result = node_1["default"].getNodeTypeXlinkHref(nodeData, nodeTypes);
            expect(result).toEqual(null);
        });
    });
    describe("handleMouseOut method", function () {
        it("sets hovered to false and calls the onNodeMouseLeave callback", function () {
            var event = {
                test: true
            };
            output.setState({
                hovered: true
            });
            output.instance().handleMouseOut(event);
            expect(output.state().hovered).toEqual(false);
            expect(onNodeMouseLeave).toHaveBeenCalledWith(event, nodeData);
        });
    });
    describe("handleMouseOver method", function () {
        it("calls the onNodeMouseEnter callback with the mouse down", function () {
            // need to set d3.event.buttons even though we're not testing it due to the mock
            // that we use above
            d3.event.buttons = 1;
            // this test cares about the passed-in event
            var event = {
                buttons: 1
            };
            output.setState({
                hovered: false
            });
            output.instance().handleMouseOver(event);
            expect(output.state().hovered).toEqual(false);
            expect(onNodeMouseEnter).toHaveBeenCalledWith(event, nodeData, false);
        });
        it("sets hovered to true when the mouse is not down", function () {
            var event = {
                buttons: 0
            };
            output.setState({
                hovered: false
            });
            output.instance().handleMouseOver(event);
            expect(output.state().hovered).toEqual(true);
            expect(onNodeMouseEnter).toHaveBeenCalledWith(event, nodeData, true);
        });
        it("sets hovered to true when the mouse is not down using d3 events", function () {
            d3.event = {
                buttons: 0
            };
            output.setState({
                hovered: false
            });
            var event = null;
            output.instance().handleMouseOver(event);
            expect(output.state().hovered).toEqual(true);
            expect(onNodeMouseEnter).toHaveBeenCalledWith(event, nodeData, true);
        });
    });
    describe("handleDragEnd method", function () {
        it("updates and selects the node using the callbacks", function () {
            output.instance().nodeRef = {
                current: {
                    parentElement: null
                }
            };
            // mock the event property
            d3.event = {
                sourceEvent: {
                    shiftKey: true
                }
            };
            output.instance().handleDragEnd();
            expect(onNodeUpdate).toHaveBeenCalledWith({ x: 5, y: 10 }, "1", true);
            expect(onNodeSelected).toHaveBeenCalledWith(nodeData, "1", true, {
                shiftKey: true
            });
        });
        it("moves the element back to the original DOM position", function () {
            var insertBefore = jasmine.createSpy();
            output.instance().nodeRef.current = {
                parentElement: "blah"
            };
            output.instance().oldSibling = {
                parentElement: {
                    insertBefore: insertBefore
                }
            };
            output.instance().handleDragEnd();
            expect(insertBefore).toHaveBeenCalledWith("blah", output.instance().oldSibling);
        });
    });
    describe("handleDragStart method", function () {
        var grandparent;
        var parentElement;
        beforeEach(function () {
            grandparent = {
                appendChild: jasmine.createSpy
            };
            parentElement = {
                nextSibling: "blah",
                parentElement: grandparent
            };
            output.instance().nodeRef.current = {
                parentElement: parentElement
            };
        });
        it("assigns an oldSibling so that the element can be put back", function () {
            output.instance().nodeRef.current = {
                parentElement: parentElement
            };
            output.instance().handleDragStart();
            expect(output.instance().oldSibling).toEqual("blah");
            expect(grandparent).toEqual(grandparent);
        });
        it("moves the element in the DOM", function () {
            output.instance().oldSibling = {};
            output.instance().handleDragStart();
            expect(grandparent).toEqual(grandparent);
        });
    });
    describe("handleMouseMove method", function () {
        it("calls the onNodeMove callback", function () {
            output.instance().handleMouseMove();
            expect(onNodeMove).not.toHaveBeenCalled();
        });
        it("calls the onNodeMove callback with the shiftKey pressed", function () {
            d3.event = {
                sourceEvent: {
                    buttons: 1,
                    shiftKey: true
                },
                x: 20,
                y: 50
            };
            output.instance().handleMouseMove();
            expect(onNodeMove).toHaveBeenCalledWith({ x: 20, y: 50 }, "1", true);
        });
        it("calls the onNodeMove callback with the shiftKey not pressed", function () {
            d3.event = {
                sourceEvent: {
                    buttons: 1,
                    shiftKey: false
                },
                x: 20,
                y: 50
            };
            output.instance().handleMouseMove();
            expect(onNodeMove).toHaveBeenCalledWith({ x: 20, y: 50 }, "1", false);
        });
        it("uses a layoutEngine to obtain a new position", function () {
            var layoutEngine = {
                getPositionForNode: jasmine.createSpy().and.callFake(function (newState) {
                    return {
                        x: 100,
                        y: 200
                    };
                })
            };
            output.setProps({
                layoutEngine: layoutEngine
            });
            d3.event = {
                sourceEvent: {
                    buttons: 1,
                    shiftKey: false
                },
                x: 20,
                y: 50
            };
            output.instance().handleMouseMove();
            expect(onNodeMove).toHaveBeenCalledWith({ x: 100, y: 200 }, "1", false);
        });
    });
});
