"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var React = require("react");
var enzyme_1 = require("enzyme");
var edge_1 = require("../../src/components/edge");
var kld_intersections_1 = require("kld-intersections");
describe("Edge component", function () {
    var output;
    var data;
    var edgeTypes;
    var sourceNode;
    var targetNode;
    var isSelected;
    beforeEach(function () {
        data = {
            handleText: "test",
            source: "foo",
            target: "bar",
            type: "fake"
        };
        edgeTypes = {
            emptyEdge: {
                shapeId: "empty"
            },
            fake: {
                shapeId: "blah"
            }
        };
        sourceNode = {
            x: 10,
            y: 20
        };
        targetNode = {
            x: 100,
            y: 200
        };
        isSelected = false;
        output = enzyme_1.shallow(React.createElement(edge_1["default"], { data: data, edgeTypes: edgeTypes, sourceNode: sourceNode, targetNode: targetNode, isSelected: isSelected, viewWrapperElem: document.createElement("div") }));
    });
    describe("render method", function () {
        it("renders", function () {
            expect(output.props().className).toEqual("edge-container");
            expect(output.props()["data-source"]).toEqual("foo");
            expect(output.props()["data-target"]).toEqual("bar");
            var g = output
                .children()
                .find("g")
                .first();
            expect(g.props().className).toEqual("edge");
            var path = output.find("path").first();
            expect(path.props().className).toEqual("edge-path");
            expect(path.props().d).toEqual("M10,20L100,200");
            var use = output.find("use").first();
            expect(use.props().xlinkHref).toEqual("blah");
            expect(use.props().width).toEqual(50);
            expect(use.props().height).toEqual(50);
            expect(use.props().transform).toEqual("translate(55, 110) rotate(63.43494882292201) translate(-25, -25)");
            var handleText = output.find("text").first();
            expect(handleText.props().className).toEqual("edge-text");
            expect(handleText.props().textAnchor).toEqual("middle");
            expect(handleText.props().alignmentBaseline).toEqual("central");
            expect(handleText.props().transform).toEqual("translate(55, 110)");
            expect(handleText.text()).toEqual("test");
            var gMouseHandler = output
                .children()
                .find("g")
                .last();
            expect(gMouseHandler.props().className).toEqual("edge-mouse-handler");
            var pathMouseHandler = gMouseHandler.find("path").first();
            expect(pathMouseHandler.props().className).toEqual("edge-overlay-path");
            expect(pathMouseHandler.props().id).toEqual("foo_bar");
            expect(pathMouseHandler.props()["data-source"]).toEqual("foo");
            expect(pathMouseHandler.props()["data-target"]).toEqual("bar");
            expect(pathMouseHandler.props().d).toEqual("M10,20L100,200");
        });
        it("does not render handleText when there is none", function () {
            output.setProps({
                data: __assign({}, data, { handleText: undefined })
            });
            var handleText = output.find("text");
            expect(handleText.length).toEqual(0);
        });
    });
    describe("renderHandleText method", function () {
        it("returns a text element with the handleText inside", function () {
            var expectedData = {
                handleText: "Fake"
            };
            var handleText = output.instance().renderHandleText(expectedData);
            expect(handleText.props.className).toEqual("edge-text");
            expect(handleText.props.children).toEqual("Fake");
        });
    });
    describe("getPathDescription method", function () {
        it("returns a path description", function () {
            var pathDescription = output.instance().getPathDescription(data);
            expect(pathDescription).toEqual("M10,20L100,200");
        });
    });
    describe("getEdgeHandleTransformation method", function () {
        it("returns a translation, rotation, and offset", function () {
            var handleTransformation = output
                .instance()
                .getEdgeHandleTransformation(data);
            expect(handleTransformation).toEqual("translate(55, 110) rotate(63.43494882292201) translate(-25, -25)");
        });
    });
    describe("getEdgeHandleRotation method", function () {
        it("returns a rotation", function () {
            var handleRotation = output.instance().getEdgeHandleRotation()[0];
            expect(handleRotation).toEqual("rotate(63.43494882292201)");
        });
        it("negates the response", function () {
            var handleRotation = output.instance().getEdgeHandleRotation(true)[0];
            expect(handleRotation).toEqual("rotate(-63.43494882292201)");
        });
    });
    describe("getEdgeHandleOffsetTranslation method", function () {
        it("returns an offset translation", function () {
            var handleOffset = output.instance().getEdgeHandleOffsetTranslation();
            expect(handleOffset).toEqual("translate(-25, -25)");
        });
        it("returns an offset translation when the handleSize is not set", function () {
            output.setProps({
                edgeHandleSize: null
            });
            var handleOffset = output.instance().getEdgeHandleOffsetTranslation();
            expect(handleOffset).toEqual("translate(0, 0)");
        });
    });
    describe("getEdgeHandleTranslation method", function () {
        it("returns a translation", function () {
            var handleTranslation = output.instance().getEdgeHandleTranslation();
            expect(handleTranslation).toEqual("translate(55, 110)");
        });
    });
    describe("getXlinkHref static method", function () {
        it("returns a shapeId from the edge type", function () {
            var typeId = edge_1["default"].getXlinkHref(edgeTypes, data);
            expect(typeId).toEqual("blah");
        });
        it("returns a shapeId from the empty edge type", function () {
            data.type = "nomatch";
            var typeId = edge_1["default"].getXlinkHref(edgeTypes, data);
            expect(typeId).toEqual("empty");
        });
        it("returns null when there is no empty or matchin edge type", function () {
            data.type = "nomatch";
            delete edgeTypes.emptyEdge;
            var typeId = edge_1["default"].getXlinkHref(edgeTypes, data);
            expect(typeId).toEqual(null);
        });
    });
    describe("lineFunction static method", function () {
        it("returns a translation", function () {
            var line = edge_1["default"].lineFunction([sourceNode, targetNode]);
            expect(line).toEqual("M10,20L100,200");
        });
    });
    describe("getTheta static method", function () {
        it("returns the theta between two points", function () {
            var theta = edge_1["default"].getTheta(sourceNode, targetNode);
            expect(theta).toEqual(1.1071487177940904);
        });
        it("defaults the x and y to 0", function () {
            var sourceNode = {};
            var targetNode = {};
            var theta = edge_1["default"].getTheta(sourceNode, targetNode);
            expect(theta).toEqual(0);
        });
    });
    describe("getArrowSize static method", function () {
        it("finds the arrow in the view wrapper element", function () {
            var rect = {
                bottom: 10,
                height: 20,
                left: 30,
                right: 40,
                top: 50,
                width: 60
            };
            var boundingClientRectMock = jest.fn().mockImplementation(function () {
                return rect;
            });
            var viewWrapperElem = {
                querySelector: jest.fn().mockImplementation(function (selector) {
                    return {
                        getBoundingClientRect: boundingClientRectMock
                    };
                })
            };
            var size = edge_1["default"].getArrowSize(viewWrapperElem);
            expect(viewWrapperElem.querySelector).toHaveBeenCalledWith("defs>marker>.arrow");
            expect(size).toEqual(rect);
        });
        it("finds the arrow in the document", function () {
            var rect = {
                bottom: 10,
                height: 20,
                left: 30,
                right: 40,
                top: 50,
                width: 60
            };
            var boundingClientRectMock = jest.fn().mockImplementation(function () {
                return rect;
            });
            document.querySelector = jest.fn().mockImplementation(function (selector) {
                return {
                    getBoundingClientRect: boundingClientRectMock
                };
            });
            var size = edge_1["default"].getArrowSize();
            expect(document.querySelector).toHaveBeenCalledWith("defs>marker>.arrow");
            expect(size).toEqual(rect);
            document.querySelector.mockRestore();
        });
    });
    describe("getEdgePathElement static method", function () {
        it("returns the edge element from the viewWrapper", function () {
            var viewWrapperElem = {
                querySelector: jest.fn()
            };
            var fakeEdge = {
                source: "fake1",
                target: "fake2"
            };
            edge_1["default"].getEdgePathElement(fakeEdge, viewWrapperElem);
            expect(viewWrapperElem.querySelector).toHaveBeenCalledWith("#edge-fake1-fake2-container>.edge-container>.edge>.edge-path");
        });
        it("returns the edge element from the document", function () {
            document.querySelector = jest.fn();
            var fakeEdge = {
                source: "fake1",
                target: "fake2"
            };
            edge_1["default"].getEdgePathElement(fakeEdge);
            expect(document.querySelector).toHaveBeenCalledWith("#edge-fake1-fake2-container>.edge-container>.edge>.edge-path");
            document.querySelector.mockRestore();
        });
    });
    describe("parsePathToXY static method", function () {
        it("converts an SVG path d property to an object with source and target objects", function () {
            var edgePathElement = {
                getAttribute: jest.fn().mockReturnValue("M33,43L224,282")
            };
            var result = edge_1["default"].parsePathToXY(edgePathElement);
            var expected = {
                source: { x: 33, y: 43 },
                target: { x: 224, y: 282 }
            };
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
        it("returns an object with source and target at position 0", function () {
            var result = edge_1["default"].parsePathToXY();
            var expected = {
                source: { x: 0, y: 0 },
                target: { x: 0, y: 0 }
            };
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
        it("returns a default reponse when there is no d attribute", function () {
            var edgePathElement = {
                getAttribute: jest.fn().mockReturnValue("")
            };
            var result = edge_1["default"].parsePathToXY(edgePathElement);
            var expected = {
                source: { x: 0, y: 0 },
                target: { x: 0, y: 0 }
            };
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
    });
    describe("getDefaultIntersectResponse static method", function () {
        it("returns a default intersect object", function () {
            var result = edge_1["default"].getDefaultIntersectResponse();
            var expected = {
                xOff: 0,
                yOff: 0,
                intersect: {
                    type: "none",
                    point: {
                        x: 0,
                        y: 0
                    }
                }
            };
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
    });
    describe("getRotatedRectIntersect", function () {
        var viewWrapperElem;
        var rectElement;
        var source;
        var target;
        beforeEach(function () {
            var rect = {
                bottom: 10,
                height: 20,
                left: 30,
                right: 40,
                top: 50,
                width: 60
            };
            var boundingClientRectMock = jest.fn().mockImplementation(function () {
                return rect;
            });
            viewWrapperElem = {
                querySelector: jest.fn().mockImplementation(function (selector) {
                    return {
                        getBoundingClientRect: boundingClientRectMock
                    };
                })
            };
            rectElement = document.createElement("div");
            rectElement.setAttribute("height", 10);
            rectElement.setAttribute("width", 10);
            rectElement.getBoundingClientRect = jest.fn().mockReturnValue({
                width: 15,
                height: 15
            });
            source = new kld_intersections_1.Point2D(5, 10);
            target = new kld_intersections_1.Point2D(15, 20);
        });
        afterEach(function () {
            rectElement.getBoundingClientRect.mockRestore();
        });
        it("gets the intersect", function () {
            var result = edge_1["default"].getRotatedRectIntersect(rectElement, source, target, false, viewWrapperElem);
            var expected = {
                xOff: 5,
                yOff: 5,
                intersect: { x: 10, y: 15 }
            };
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
        it("does includes the arrow", function () {
            var result = edge_1["default"].getRotatedRectIntersect(rectElement, source, target, true, viewWrapperElem);
            var expected = {
                xOff: -43,
                yOff: 5,
                intersect: { x: 10, y: 15 }
            };
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
        it("uses the clientRect for width and height", function () {
            rectElement.removeAttribute("height");
            rectElement.removeAttribute("width");
            var result = edge_1["default"].getRotatedRectIntersect(rectElement, source, target, true, viewWrapperElem);
            var expected = {
                xOff: -40.5,
                yOff: 7.5,
                intersect: { x: 7.5, y: 12.5 }
            };
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
        it("uses 0 when trg and src do not have x and y", function () {
            source = new kld_intersections_1.Point2D();
            target = new kld_intersections_1.Point2D();
            var result = edge_1["default"].getRotatedRectIntersect(rectElement, source, target, true, viewWrapperElem);
            var expected = {
                xOff: 0,
                yOff: 0,
                intersect: { type: "none", point: { x: 0, y: 0 } }
            };
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
        it("handles rotates rectangles", function () {
            rectElement.setAttribute("transform", "rotate(45)");
            var result = edge_1["default"].getRotatedRectIntersect(rectElement, source, target, false, viewWrapperElem);
            var expected = {
                xOff: 3.535533905932736,
                yOff: 3.5355339059327378,
                intersect: { x: 11.464466094067264, y: 16.464466094067262 }
            };
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
        it("points at the bottom", function () {
            source = new kld_intersections_1.Point2D(5, 20);
            target = new kld_intersections_1.Point2D(5, 5);
            var result = edge_1["default"].getRotatedRectIntersect(rectElement, source, target, false, viewWrapperElem);
            var expected = {
                xOff: 0,
                yOff: -5,
                intersect: { x: 5, y: 10 }
            };
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
        it("points at the left", function () {
            source = new kld_intersections_1.Point2D(-5, 5);
            target = new kld_intersections_1.Point2D(5, 5);
            var result = edge_1["default"].getRotatedRectIntersect(rectElement, source, target, false, viewWrapperElem);
            var expected = {
                xOff: 5,
                yOff: 0,
                intersect: { x: 0, y: 5 }
            };
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
    });
    describe("getPathIntersect static method", function () {
        var viewWrapperElem;
        var rectElement;
        var source;
        var target;
        beforeEach(function () {
            var rect = {
                bottom: 10,
                height: 20,
                left: 30,
                right: 40,
                top: 50,
                width: 60
            };
            var boundingClientRectMock = jest.fn().mockImplementation(function () {
                return rect;
            });
            viewWrapperElem = {
                querySelector: jest.fn().mockImplementation(function (selector) {
                    return {
                        getBoundingClientRect: boundingClientRectMock
                    };
                })
            };
            rectElement = document.createElement("div");
            rectElement.setAttribute("height", 10);
            rectElement.setAttribute("width", 10);
            rectElement.getBoundingClientRect = jest.fn().mockReturnValue({
                width: 15,
                height: 15
            });
            source = new kld_intersections_1.Point2D(5, 10);
            target = new kld_intersections_1.Point2D(15, 20);
        });
        afterEach(function () {
            rectElement.getBoundingClientRect.mockRestore();
        });
        it("finds the intersect", function () {
            rectElement.setAttribute("d", "M 0 0 15 0 15 15 0 15Z");
            var result = edge_1["default"].getPathIntersect(rectElement, source, target, false, viewWrapperElem);
            var expected = {
                xOff: 7.5,
                yOff: 7.5,
                intersect: { x: 7.5, y: 12.5 }
            };
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
    });
    describe("getCircleIntersect static method", function () {
        var viewWrapperElem;
        var rectElement;
        var source;
        var target;
        beforeEach(function () {
            var rect = {
                bottom: 10,
                height: 20,
                left: 30,
                right: 40,
                top: 50,
                width: 60
            };
            var boundingClientRectMock = jest.fn().mockImplementation(function () {
                return rect;
            });
            viewWrapperElem = {
                querySelector: jest.fn().mockImplementation(function (selector) {
                    return {
                        getBoundingClientRect: boundingClientRectMock
                    };
                })
            };
            var parentElement = document.createElement("div");
            parentElement.setAttribute("width", 10);
            parentElement.setAttribute("height", 10);
            rectElement = document.createElement("div");
            rectElement.setAttribute("height", 10);
            rectElement.setAttribute("width", 10);
            rectElement.getBoundingClientRect = jest.fn().mockReturnValue({
                width: 15,
                height: 15
            });
            parentElement.appendChild(rectElement);
            source = new kld_intersections_1.Point2D(5, 10);
            target = new kld_intersections_1.Point2D(15, 20);
        });
        afterEach(function () {
            rectElement.getBoundingClientRect.mockRestore();
        });
        it("finds the intersect", function () {
            var result = edge_1["default"].getCircleIntersect(rectElement, source, target, false, viewWrapperElem);
            var expected = {
                xOff: 3.5355339059327378,
                yOff: 3.5355339059327378,
                intersect: { x: 11.464466094067262, y: 16.464466094067262 }
            };
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
    });
    describe("calculateOffset static method", function () {
        var viewWrapperElem;
        var source;
        var target;
        var defaultExpected;
        var rectElement;
        beforeEach(function () {
            // const rect = { bottom: 10, height: 20, left: 30, right: 40, top: 50, width: 60 };
            // const boundingClientRectMock = jest.fn().mockImplementation(() => {
            //   return rect;
            // });
            rectElement = document.createElement("div");
            rectElement.setAttribute("height", 10);
            rectElement.setAttribute("width", 10);
            rectElement.getBoundingClientRect = jest.fn().mockReturnValue({
                width: 15,
                height: 15
            });
            viewWrapperElem = {
                querySelector: jest.fn().mockImplementation(function (selector) {
                    return rectElement;
                })
            };
            source = new kld_intersections_1.Point2D(5, 10);
            source.id = "test";
            target = new kld_intersections_1.Point2D(15, 20);
            target.id = "test2";
            defaultExpected = {
                xOff: 0,
                yOff: 0,
                intersect: { type: "none", point: { x: 0, y: 0 } }
            };
        });
        it("returns the x and y offset", function () {
            var nodeSize = 50;
            var offsets = edge_1["default"].calculateOffset(nodeSize, sourceNode, targetNode);
            expect(offsets.xOff).toEqual(0);
            expect(offsets.yOff).toEqual(0);
        });
        it("returns a default response when there is no matching nodeKey", function () {
            source.id = "";
            target.id = "";
            var result = edge_1["default"].calculateOffset(15, source, target, "id", false, viewWrapperElem);
            var expected = defaultExpected;
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
        it("returns a default response when there is no matching node element", function () {
            var result = edge_1["default"].calculateOffset(15, source, target, "id", false, viewWrapperElem);
            var expected = {
                xOff: 0,
                yOff: 0,
                intersect: { type: "none", point: { x: 0, y: 0 } }
            };
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
        it("returns a default response when there is no matching target node", function () {
            var trgNode = {};
            var node = {
                querySelector: jest.fn().mockImplementation(function () {
                    return trgNode;
                })
            };
            document.getElementById = jest.fn().mockImplementation(function () {
                return node;
            });
            var result = edge_1["default"].calculateOffset(15, source, target, "id", false, viewWrapperElem);
            var expected = defaultExpected;
            expect(document.getElementById).toHaveBeenCalledWith("node-test2");
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
            document.getElementById.mockRestore();
        });
        it("returns a default response when there is no xlinkHref", function () {
            var trgNode = {
                getAttributeNS: jest.fn().mockImplementation(function () {
                    return null;
                })
            };
            var node = {
                querySelector: jest.fn().mockImplementation(function () {
                    return trgNode;
                })
            };
            document.getElementById = jest.fn().mockImplementation(function () {
                return node;
            });
            var result = edge_1["default"].calculateOffset(15, source, target, "id", false, viewWrapperElem);
            var expected = defaultExpected;
            expect(document.getElementById).toHaveBeenCalledWith("node-test2");
            expect(trgNode.getAttributeNS).toHaveBeenCalledWith("http://www.w3.org/1999/xlink", "href");
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
            document.getElementById.mockRestore();
        });
        it("gets a response for a rect element", function () {
            var trgNode = {
                getAttributeNS: jest.fn().mockImplementation(function () {
                    return "test";
                })
            };
            var node = {
                querySelector: jest.fn().mockImplementation(function () {
                    return trgNode;
                })
            };
            document.getElementById = jest.fn().mockImplementation(function () {
                return node;
            });
            var result = edge_1["default"].calculateOffset(15, source, target, "id", false, viewWrapperElem);
            var expected = {
                xOff: 5,
                yOff: 5,
                intersect: {
                    x: 10,
                    y: 15
                }
            };
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
            document.getElementById.mockRestore();
        });
    });
});
