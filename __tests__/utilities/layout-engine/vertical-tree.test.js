"use strict";
exports.__esModule = true;
var vertical_tree_1 = require("../../../src/utilities/layout-engine/vertical-tree");
describe("VerticalTree", function () {
    var output = null;
    describe("class", function () {
        it("is defined", function () {
            expect(vertical_tree_1["default"]).toBeDefined();
        });
        it("instantiates", function () {
            var verticalTree = new vertical_tree_1["default"]();
        });
    });
    describe("calculatePosition method", function () {
        it("adjusts the node position to be centered on a grid space", function () {
            var verticalTree = new vertical_tree_1["default"]({
                nodeKey: "id",
                nodeSize: 10
            });
            var nodes = [{ id: "test", x: 9, y: 8 }, { id: "test1", x: 4, y: 7 }];
            var nodesMap = {
                "key-test": {
                    incomingEdges: [],
                    outgoingEdges: [
                        {
                            source: "test",
                            target: "test1"
                        }
                    ],
                    node: nodes[0]
                },
                "key-test1": {
                    incomingEdges: [
                        {
                            source: "test",
                            target: "test1"
                        }
                    ],
                    outgoingEdges: [],
                    node: nodes[0]
                }
            };
            var newNodes = verticalTree.adjustNodes(nodes, nodesMap);
            var expected = [
                { id: "test", x: 7.5, y: 72.5 },
                { id: "test1", x: 4, y: 7 }
            ];
            expect(JSON.stringify(newNodes)).toEqual(JSON.stringify(expected));
        });
        it("does nothing when there is no nodeMap", function () {
            var verticalTree = new vertical_tree_1["default"]({
                nodeKey: "id",
                nodeSize: 10
            });
            var nodes = [{ id: "test", x: 9, y: 8 }];
            var newNodes = verticalTree.adjustNodes(nodes);
            var expected = [{ id: "test", x: 9, y: 8 }];
            expect(JSON.stringify(newNodes)).toEqual(JSON.stringify(expected));
        });
        it("does nothing on disconnected nodes", function () {
            var verticalTree = new vertical_tree_1["default"]({
                nodeKey: "id",
                nodeSize: 10
            });
            var nodes = [{ id: "test", x: 9, y: 8 }];
            var nodesMap = {
                "key-test": {
                    incomingEdges: [],
                    outgoingEdges: [],
                    node: nodes[0]
                }
            };
            var newNodes = verticalTree.adjustNodes(nodes, nodesMap);
            var expected = [{ id: "test", x: 9, y: 8 }];
            expect(JSON.stringify(newNodes)).toEqual(JSON.stringify(expected));
        });
        it("uses a default nodeSize", function () {
            var verticalTree = new vertical_tree_1["default"]({
                nodeKey: "id"
            });
            var nodes = [{ id: "test", x: 9, y: 8 }, { id: "test1", x: 4, y: 7 }];
            var nodesMap = {
                "key-test": {
                    incomingEdges: [],
                    outgoingEdges: [
                        {
                            source: "test",
                            target: "test1"
                        }
                    ],
                    node: nodes[0]
                },
                "key-test1": {
                    incomingEdges: [
                        {
                            source: "test",
                            target: "test1"
                        }
                    ],
                    outgoingEdges: [],
                    node: nodes[0]
                }
            };
            var newNodes = verticalTree.adjustNodes(nodes, nodesMap);
            var expected = [
                { id: "test", x: 0.75, y: 52.25 },
                { id: "test1", x: 4, y: 7 }
            ];
            expect(JSON.stringify(newNodes)).toEqual(JSON.stringify(expected));
        });
    });
});
