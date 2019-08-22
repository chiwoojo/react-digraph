"use strict";
exports.__esModule = true;
var d3 = require("d3");
var React = require("react");
var react_dom_1 = require("react-dom");
var enzyme_1 = require("enzyme");
var background_1 = require("../../src/components/background");
var defs_1 = require("../../src/components/defs");
var graph_util_1 = require("../../src/utilities/graph-util");
var graph_view_1 = require("../../src/components/graph-view");
jest.mock("react-dom", function () {
    return {};
});
describe("GraphView component", function () {
    var output = null;
    var nodes;
    var edges;
    var nodeTypes;
    var nodeSubtypes;
    var edgeTypes;
    var selected;
    var onDeleteNode;
    var onSelectNode;
    var onCreateNode;
    var onCreateEdge;
    var onDeleteEdge;
    var onUpdateNode;
    var onSwapEdge;
    var onSelectEdge;
    var instance;
    var nodeKey;
    beforeEach(function () {
        nodes = [];
        edges = [];
        nodeTypes = {};
        nodeSubtypes = {};
        edgeTypes = {};
        selected = null;
        nodeKey = "id";
        onDeleteNode = jasmine.createSpy();
        onSelectNode = jasmine.createSpy();
        onCreateNode = jasmine.createSpy();
        onCreateEdge = jasmine.createSpy();
        onDeleteEdge = jasmine.createSpy();
        onUpdateNode = jasmine.createSpy();
        onSwapEdge = jasmine.createSpy();
        onSelectEdge = jasmine.createSpy();
        react_dom_1["default"].render = jasmine.createSpy();
        spyOn(document, "querySelector").and.returnValue({
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
        var globalMouse = {};
        Object.defineProperty(d3, "mouse", {
            get: function () {
                return globalMouse;
            },
            set: function (mouse) {
                globalMouse = mouse;
            }
        });
        output = enzyme_1.shallow(React.createElement(graph_view_1["default"], { nodes: nodes, edges: edges, nodeKey: nodeKey, nodeTypes: nodeTypes, nodeSubtypes: nodeSubtypes, edgeTypes: edgeTypes, selected: selected, onDeleteNode: onDeleteNode, onDeleteEdge: onDeleteEdge, onSelectNode: onSelectNode, onSelectEdge: onSelectEdge, onCreateNode: onCreateNode, onCreateEdge: onCreateEdge, onUpdateNode: onUpdateNode, onSwapEdge: onSwapEdge }));
        instance = output.instance();
    });
    describe("render method", function () {
        it("renders", function () {
            expect(output.props().className).toEqual("view-wrapper");
            expect(output.find(".graph-controls-wrapper").length).toEqual(1);
            var graph = output.find(".graph");
            expect(graph.length).toEqual(1);
            var defs = graph.find(defs_1["default"]);
            expect(defs.length).toEqual(1);
            expect(defs.props().edgeArrowSize).toEqual(8);
            expect(defs.props().gridSpacing).toEqual(36);
            expect(defs.props().gridDotSize).toEqual(2);
            expect(defs.props().nodeTypes).toEqual(nodeTypes);
            expect(defs.props().nodeSubtypes).toEqual(nodeSubtypes);
            expect(defs.props().edgeTypes).toEqual(edgeTypes);
            expect(defs.props().renderDefs).toBeDefined();
            var view = graph.find(".view");
            var entities = view.find(".entities");
            expect(entities.length).toEqual(1);
            var background = view.find(background_1["default"]);
            expect(background.length).toEqual(1);
        });
    });
    describe("renderGraphControls method", function () {
        beforeEach(function () {
            instance.viewWrapper = {
                current: document.createElement("div")
            };
            instance.viewWrapper.current.width = 500;
            instance.viewWrapper.current.height = 500;
            var graphControlsWrapper = document.createElement("g");
            graphControlsWrapper.id = "react-digraph-graph-controls-wrapper";
            graphControlsWrapper.classList.add("graph-controls-wrapper");
            instance.viewWrapper.current.appendChild(graphControlsWrapper);
            spyOn(document, "getElementById").and.returnValue(graphControlsWrapper);
        });
        it("does nothing when showGraphControls is false", function () {
            output.setProps({
                showGraphControls: false
            });
            instance.renderGraphControls();
            expect(react_dom_1["default"].render).not.toHaveBeenCalled();
            output.setProps({
                showGraphControls: true
            });
        });
        it("uses ReactDOM.render to async render the GraphControls", function () {
            output.setState({
                viewTransform: {
                    k: 0.6
                }
            });
            instance.renderGraphControls();
            expect(react_dom_1["default"].render).toHaveBeenCalled();
        });
    });
    describe("renderEdges method", function () {
        beforeEach(function () {
            spyOn(instance, "asyncRenderEdge");
        });
        it("does nothing when there are no entities", function () {
            instance.entities = null;
            instance.renderEdges();
            expect(instance.asyncRenderEdge).not.toHaveBeenCalled();
        });
        it("does nothing while dragging an edge", function () {
            output.setState({
                draggingEdge: true
            });
            instance.entities = [];
            instance.renderEdges();
            expect(instance.asyncRenderEdge).not.toHaveBeenCalled();
        });
        it("calls asyncRenderEdge for each edge", function () {
            output.setProps({
                edges: [
                    {
                        source: "b",
                        target: "a"
                    },
                    {
                        source: "c",
                        target: "a"
                    }
                ]
            });
            // modifying the edges will call renderEdges, we need to reset this count.
            instance.asyncRenderEdge.calls.reset();
            instance.entities = [];
            instance.renderEdges();
            expect(instance.asyncRenderEdge).toHaveBeenCalledTimes(2);
        });
    });
    describe("syncRenderEdge method", function () {
        beforeEach(function () {
            spyOn(instance, "renderEdge");
            spyOn(instance, "getEdgeComponent").and.returnValue("blah");
        });
        it("sets up a renderEdge call synchronously", function () {
            var expectedEdge = {
                source: "a",
                target: "b"
            };
            instance.syncRenderEdge(expectedEdge);
            expect(instance.renderEdge).toHaveBeenCalledWith("edge-a-b", "blah", expectedEdge, false);
        });
        it("uses a custom idVar", function () {
            var expectedEdge = {
                source: "a"
            };
            instance.syncRenderEdge(expectedEdge);
            expect(instance.renderEdge).toHaveBeenCalledWith("edge-custom", "blah", expectedEdge, false);
        });
    });
    describe("asyncRenderEdge method", function () {
        beforeEach(function () {
            jest.spyOn(window, "requestAnimationFrame").mockImplementation(function (cb) {
                cb();
                return true;
            });
        });
        afterEach(function () {
            window.requestAnimationFrame.mockRestore();
        });
        it("renders asynchronously", function () {
            spyOn(instance, "syncRenderEdge");
            var edge = {
                source: "a",
                target: "b"
            };
            instance.asyncRenderEdge(edge);
            expect(instance.edgeTimeouts["edges-a-b"]).toBeDefined();
            expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
            expect(instance.syncRenderEdge).toHaveBeenCalledWith(edge, false);
        });
    });
    describe("renderEdge method", function () {
        beforeEach(function () {
            instance.entities = {
                appendChild: jasmine.createSpy()
            };
            react_dom_1["default"].render = jasmine.createSpy();
        });
        it("appends an edge element into the entities element", function () {
            var element = document.createElement("g");
            var edge = {
                source: "a",
                target: "b"
            };
            instance.renderEdge("test", element, edge);
            expect(instance.entities.appendChild).toHaveBeenCalled();
        });
        it("replaces an edge in an existing container", function () {
            var element = document.createElement("g");
            var container = document.createElement("g");
            container.id = "test-container";
            spyOn(document, "getElementById").and.returnValue(container);
            var edge = {
                source: "a",
                target: "b"
            };
            instance.renderEdge("test", element, edge);
            expect(instance.entities.appendChild).not.toHaveBeenCalled();
            expect(react_dom_1["default"].render).toHaveBeenCalledWith(element, container);
        });
    });
    describe("getEdgeComponent method", function () {
        beforeEach(function () {
            nodes = [{ id: "a" }, { id: "b" }];
        });
        it("returns an Edge component", function () {
            var edge = {
                source: "a",
                target: "b"
            };
            output.setProps({
                nodes: nodes
            });
            var result = instance.getEdgeComponent(edge);
            expect(result.type.prototype.constructor.name).toEqual("Edge");
            expect(result.props.data).toEqual(edge);
            expect(result.props.sourceNode).toEqual(nodes[0]);
            expect(result.props.targetNode).toEqual(nodes[1]);
        });
        it("handles missing nodes", function () {
            var edge = {
                source: "a",
                target: "b"
            };
            var result = instance.getEdgeComponent(edge);
            expect(result.type.prototype.constructor.name).toEqual("Edge");
            expect(result.props.data).toEqual(edge);
            expect(result.props.sourceNode).toEqual(null);
            expect(result.props.targetNode).toEqual(undefined);
        });
        it("handles a targetPosition", function () {
            var edge = {
                source: "a",
                targetPosition: { x: 0, y: 10 }
            };
            output.setProps({
                nodes: nodes
            });
            var result = instance.getEdgeComponent(edge);
            expect(result.type.prototype.constructor.name).toEqual("Edge");
            expect(result.props.data).toEqual(edge);
            expect(result.props.sourceNode).toEqual(nodes[0]);
            expect(result.props.targetNode).toEqual({ x: 0, y: 10 });
        });
    });
    describe("renderNodes method", function () {
        beforeEach(function () {
            spyOn(instance, "asyncRenderNode");
            nodes = [{ id: "a" }, { id: "b" }];
            output.setProps({
                nodes: nodes
            });
        });
        it("returns early when there are no entities", function () {
            // asyncRenderNode gets called when new nodes are added. Reset the calls.
            instance.asyncRenderNode.calls.reset();
            instance.renderNodes();
            expect(instance.asyncRenderNode).not.toHaveBeenCalled();
        });
        it("calls asynchronously renders each node", function () {
            instance.asyncRenderNode.calls.reset();
            instance.entities = [];
            instance.renderNodes();
            expect(instance.asyncRenderNode).toHaveBeenCalledTimes(2);
        });
    });
    describe("isEdgeSelected method", function () {
        var edge;
        beforeEach(function () {
            edge = {
                source: "a",
                target: "b"
            };
            edges.push(edge);
        });
        it("returns true when the edge is selected", function () {
            selected = edge;
            output.setProps({
                edges: edges,
                selected: selected
            });
            var result = instance.isEdgeSelected(edge);
            expect(result).toEqual(true);
        });
        it("returns false when the edge is not selected", function () {
            selected = {
                source: "b",
                target: "c"
            };
            output.setProps({
                edges: edges,
                selected: selected
            });
            var result = instance.isEdgeSelected(edge);
            expect(result).toEqual(false);
        });
    });
    describe("syncRenderNode method", function () {
        it("renders a node and connected edges", function () {
            var node = { id: "a" };
            var nodesProp = [node];
            output.setProps({
                nodeKey: nodeKey,
                nodes: nodesProp
            });
            spyOn(instance, "renderNode");
            spyOn(instance, "renderConnectedEdgesFromNode");
            instance.syncRenderNode(node, 0);
            expect(instance.renderNode).toHaveBeenCalledWith("node-a", expect.any(Object));
            expect(instance.renderConnectedEdgesFromNode).toHaveBeenCalled();
        });
    });
    describe("asyncRenderNode method", function () {
        beforeEach(function () {
            jest.spyOn(window, "requestAnimationFrame").mockImplementation(function (cb) {
                cb();
                return true;
            });
        });
        afterEach(function () {
            window.requestAnimationFrame.mockRestore();
        });
        it("renders asynchronously", function () {
            spyOn(instance, "syncRenderNode");
            var node = { id: "a" };
            instance.asyncRenderNode(node);
            expect(instance.nodeTimeouts["nodes-a"]).toBeDefined();
            expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
            expect(instance.syncRenderNode).toHaveBeenCalledWith(node);
        });
    });
    describe("renderConnectedEdgesFromNode method", function () {
        var node;
        beforeEach(function () {
            spyOn(instance, "asyncRenderEdge");
            node = {
                id: "a",
                incomingEdges: [{ source: "b", target: "a" }],
                outgoingEdges: [{ source: "a", target: "c" }]
            };
        });
        it("does nothing while dragging an edge", function () {
            output.setState({
                draggingEdge: true
            });
            instance.renderConnectedEdgesFromNode(node);
            expect(instance.asyncRenderEdge).not.toHaveBeenCalled();
        });
        it("renders edges for incoming and outgoing edges", function () {
            instance.renderConnectedEdgesFromNode(node);
            expect(instance.asyncRenderEdge).toHaveBeenCalledTimes(2);
        });
    });
    describe("renderNode method", function () {
        beforeEach(function () {
            instance.entities = {
                appendChild: jasmine.createSpy()
            };
            react_dom_1["default"].render = jasmine.createSpy();
        });
        it("appends a node element into the entities element", function () {
            var element = document.createElement("g");
            instance.renderNode("test", element);
            expect(instance.entities.appendChild).toHaveBeenCalled();
        });
        it("replaces a node in an existing container", function () {
            var element = document.createElement("g");
            var container = document.createElement("g");
            container.id = "test-container";
            spyOn(document, "getElementById").and.returnValue(container);
            instance.renderNode("test", element);
            expect(instance.entities.appendChild).not.toHaveBeenCalled();
            expect(react_dom_1["default"].render).toHaveBeenCalledWith(element, container);
        });
    });
    describe("getNodeComponent method", function () {
        var node;
        beforeEach(function () {
            node = { id: "a" };
        });
        it("returns a Node", function () {
            var result = instance.getNodeComponent("test", node, 0);
            expect(result.type.prototype.constructor.name).toEqual("Node");
            expect(result.props.id).toEqual("test");
            expect(result.props.data).toEqual(node);
            expect(result.props.isSelected).toEqual(false);
        });
        it("returns a selected node", function () {
            output.setProps({
                nodes: [node],
                selected: node
            });
            var result = instance.getNodeComponent("test", node, 0);
            expect(result.props.isSelected).toEqual(true);
        });
    });
    describe("renderView method", function () {
        it("sets up the view and calls renderNodes asynchronously", function () {
            jest.useFakeTimers();
            jest.clearAllTimers();
            spyOn(instance, "renderNodes");
            output.setState({
                viewTransform: "test"
            });
            instance.selectedView = d3.select(document.createElement("g"));
            instance.renderView();
            jest.runAllTimers();
            expect(instance.renderNodes).toHaveBeenCalled();
            expect(instance.selectedView.attr("transform")).toEqual("test");
        });
    });
    // TODO: figure out how to mock d3 for this test
    // describe('setZoom method', () => {
    //   it('zooms to a specified value', () => {
    //     instance.setZoom(0.5, 5, 10, 100);
    //     // expect(d3.zoomIdentity.translate.scale).toHaveBeenCalledWith(0.5);
    //   });
    // });
    describe("modifyZoom", function () {
        beforeEach(function () {
            spyOn(instance, "setZoom");
            instance.viewWrapper = {
                current: document.createElement("div")
            };
            instance.viewWrapper.current.width = 500;
            instance.viewWrapper.current.height = 500;
            instance.setState({
                viewTransform: {
                    k: 0.4,
                    x: 50,
                    y: 50
                }
            });
        });
        it("modifies the zoom", function () {
            instance.modifyZoom(0.1, 5, 10, 100);
            expect(instance.setZoom).toHaveBeenCalledWith(0.44000000000000006, 55, 60, 100);
        });
        it("does nothing when targetZoom is too small", function () {
            instance.modifyZoom(-100, 5, 10, 100);
            expect(instance.setZoom).not.toHaveBeenCalled();
        });
        it("does nothing when targetZoom is too large", function () {
            instance.modifyZoom(100, 5, 10, 100);
            expect(instance.setZoom).not.toHaveBeenCalled();
        });
        it("uses defaults", function () {
            instance.modifyZoom();
            expect(instance.setZoom).toHaveBeenCalledWith(0.4, 50, 50, 0);
        });
    });
    describe("handleZoomToFit method", function () {
        beforeEach(function () {
            spyOn(instance, "setZoom");
            instance.viewWrapper = {
                current: document.createElement("div")
            };
            // this gets around instance.viewWrapper.client[Var] being readonly, we need to customize the object
            var globalWidth = 0;
            Object.defineProperty(instance.viewWrapper.current, "clientWidth", {
                get: function () {
                    return globalWidth;
                },
                set: function (clientWidth) {
                    globalWidth = clientWidth;
                }
            });
            var globalHeight = 0;
            Object.defineProperty(instance.viewWrapper.current, "clientHeight", {
                get: function () {
                    return globalHeight;
                },
                set: function (clientHeight) {
                    globalHeight = clientHeight;
                }
            });
            instance.viewWrapper.current.clientWidth = 500;
            instance.viewWrapper.current.clientHeight = 500;
            instance.setState({
                viewTransform: {
                    k: 0.4,
                    x: 50,
                    y: 50
                }
            });
            instance.entities = document.createElement("g");
            instance.entities.getBBox = jasmine
                .createSpy()
                .and.returnValue({ width: 400, height: 300, x: 5, y: 10 });
        });
        it("modifies the zoom to fit the elements", function () {
            instance.handleZoomToFit();
            expect(instance.entities.getBBox).toHaveBeenCalled();
            expect(instance.setZoom).toHaveBeenCalledWith(1.125, 19.375, 70, 750);
        });
        it("uses defaults for minZoom and maxZoom", function () {
            output.setProps({
                maxZoom: null,
                minZoom: null,
                zoomDur: 100
            });
            instance.handleZoomToFit();
            expect(instance.setZoom).toHaveBeenCalledWith(1.125, 19.375, 70, 100);
        });
        it("does not modify the zoom", function () {
            instance.entities.getBBox.and.returnValue({
                width: 0,
                height: 0,
                x: 5,
                y: 5
            });
            instance.handleZoomToFit();
            expect(instance.setZoom).toHaveBeenCalledWith(0.825, 0, 0, 750);
        });
        it("uses the maxZoom when k is greater than max", function () {
            instance.entities.getBBox.and.returnValue({
                width: 5,
                height: 5,
                x: 5,
                y: 5
            });
            instance.handleZoomToFit();
            expect(instance.setZoom).toHaveBeenCalledWith(1.5, 238.75, 238.75, 750);
        });
        it("uses the minZoom when k is less than min", function () {
            instance.entities.getBBox.and.returnValue({
                width: 10000,
                height: 10000,
                x: 5,
                y: 5
            });
            instance.handleZoomToFit();
            expect(instance.setZoom).toHaveBeenCalledWith(0.15, -500.75, -500.75, 750);
        });
    });
    describe("handleZoomEnd method", function () {
        beforeEach(function () {
            spyOn(graph_util_1["default"], "removeElementFromDom");
            spyOn(instance, "canSwap").and.returnValue(false);
            spyOn(instance, "syncRenderEdge");
            output.setProps({
                edges: [{ source: "a", target: "b" }],
                nodes: [{ id: "a" }, { id: "b" }, { id: "c" }]
            });
        });
        it("does nothing when not dragging an edge", function () {
            instance.handleZoomEnd();
            expect(graph_util_1["default"].removeElementFromDom).not.toHaveBeenCalled();
        });
        it("does nothing when there is no dragged edge object", function () {
            output.setState({
                draggingEdge: true
            });
            instance.handleZoomEnd();
            expect(graph_util_1["default"].removeElementFromDom).not.toHaveBeenCalled();
        });
        it("drags an edge", function () {
            instance.canSwap.and.returnValue(true);
            var draggedEdge = {
                source: "a",
                target: "b"
            };
            output.setState({
                draggedEdge: draggedEdge,
                draggingEdge: true,
                edgeEndNode: { id: "c" }
            });
            instance.handleZoomEnd();
            expect(graph_util_1["default"].removeElementFromDom).toHaveBeenCalled();
            expect(output.state().draggedEdge).toEqual(null);
            expect(output.state().draggingEdge).toEqual(false);
            expect(instance.syncRenderEdge).toHaveBeenCalled();
            expect(onSwapEdge).toHaveBeenCalled();
        });
        it("handles swapping the edge to a different node", function () {
            instance.canSwap.and.returnValue(true);
            var draggedEdge = {
                source: "a",
                target: "b"
            };
            output.setState({
                draggedEdge: draggedEdge,
                draggingEdge: true,
                edgeEndNode: { id: "c" }
            });
            instance.handleZoomEnd();
            expect(instance.syncRenderEdge).toHaveBeenCalledWith({
                source: "a",
                target: "c"
            });
        });
    });
    describe("handleZoom method", function () {
        beforeEach(function () {
            spyOn(instance, "dragEdge");
            spyOn(instance, "renderGraphControls");
            d3.event = {
                transform: "test"
            };
            instance.view = document.createElement("g");
        });
        it("handles the zoom event when a node is not hovered nor an edge is being dragged", function () {
            instance.handleZoom();
            expect(instance.renderGraphControls).toHaveBeenCalled();
            expect(instance.dragEdge).not.toHaveBeenCalled();
        });
        it("does nothing when the zoom level hasn't changed", function () {
            output.setState({
                viewTransform: "test"
            });
            instance.handleZoom();
            expect(instance.renderGraphControls).not.toHaveBeenCalled();
            expect(instance.dragEdge).not.toHaveBeenCalled();
        });
        it("deals with dragging an edge", function () {
            output.setState({
                draggingEdge: true
            });
            instance.handleZoom();
            expect(instance.renderGraphControls).not.toHaveBeenCalled();
            expect(instance.dragEdge).toHaveBeenCalled();
        });
        it("zooms when a node is hovered", function () {
            output.setState({
                hoveredNode: {}
            });
            instance.handleZoom();
            expect(instance.renderGraphControls).toHaveBeenCalled();
            expect(instance.dragEdge).not.toHaveBeenCalled();
        });
    });
    describe("dragEdge method", function () {
        var draggedEdge;
        beforeEach(function () {
            draggedEdge = {
                source: "a",
                target: "b"
            };
            spyOn(instance, "syncRenderEdge");
            instance.selectedView = d3.select(document.createElement("g"));
            d3.mouse = jasmine.createSpy().and.returnValue([5, 15]);
            output.setProps({
                nodes: [{ id: "a", x: 5, y: 10 }, { id: "b", x: 10, y: 20 }]
            });
            output.setState({
                draggedEdge: draggedEdge
            });
        });
        it("does nothing when an edge is not dragged", function () {
            output.setState({
                draggedEdge: null
            });
            instance.dragEdge();
            expect(instance.syncRenderEdge).not.toHaveBeenCalled();
        });
        it("drags the edge", function () {
            instance.dragEdge();
            expect(instance.syncRenderEdge).toHaveBeenCalledWith({
                source: draggedEdge.source,
                targetPosition: { x: 5, y: 15 }
            });
        });
    });
    describe("handleZoomStart method", function () {
        var edge;
        beforeEach(function () {
            spyOn(instance, "dragEdge");
            spyOn(instance, "isArrowClicked").and.returnValue(true);
            spyOn(instance, "removeEdgeElement");
            edge = { source: "a", target: "b" };
            output.setProps({
                edges: [edge]
            });
            d3.event = {
                sourceEvent: {
                    target: {
                        classList: {
                            contains: jasmine.createSpy().and.returnValue(true)
                        },
                        id: "a_b"
                    },
                    buttons: 0
                }
            };
        });
        it("does nothing when the graph is readOnly", function () {
            output.setProps({
                readOnly: true
            });
            instance.handleZoomStart();
            expect(instance.dragEdge).not.toHaveBeenCalled();
        });
        it("does nothing when there is no sourceEvent", function () {
            d3.event = {
                sourceEvent: null
            };
            instance.handleZoomStart();
            expect(instance.dragEdge).not.toHaveBeenCalled();
        });
        it("does nothing when the sourceEvent is not an edge", function () {
            d3.event.sourceEvent.target.classList.contains.and.returnValue(false);
            instance.handleZoomStart();
            expect(instance.dragEdge).not.toHaveBeenCalled();
        });
        it("does nothing if the arrow wasn't clicked", function () {
            instance.isArrowClicked.and.returnValue(false);
            instance.handleZoomStart();
            expect(instance.dragEdge).not.toHaveBeenCalled();
        });
        it("does nothing if there is no edge", function () {
            d3.event.sourceEvent.target.id = "fake";
            instance.handleZoomStart();
            expect(instance.dragEdge).not.toHaveBeenCalled();
        });
        it("drags the edge", function () {
            d3.event.sourceEvent.buttons = 2;
            instance.handleZoomStart();
            expect(output.state().draggedEdge).toEqual(edge);
            expect(instance.dragEdge).toHaveBeenCalled();
        });
    });
    describe("panToEntity method", function () {
        var entity = document.createElement("g");
        entity.getBBox = jasmine
            .createSpy()
            .and.returnValue({ width: 400, height: 300, x: 5, y: 10 });
        beforeEach(function () {
            spyOn(instance, "setZoom");
            instance.viewWrapper = {
                current: document.createElement("div")
            };
            // this gets around instance.viewWrapper.client[Var] being readonly, we need to customize the object
            var globalWidth = 0;
            Object.defineProperty(instance.viewWrapper.current, "clientWidth", {
                get: function () {
                    return globalWidth;
                },
                set: function (clientWidth) {
                    globalWidth = clientWidth;
                }
            });
            var globalHeight = 0;
            Object.defineProperty(instance.viewWrapper.current, "clientHeight", {
                get: function () {
                    return globalHeight;
                },
                set: function (clientHeight) {
                    globalHeight = clientHeight;
                }
            });
            instance.viewWrapper.current.clientWidth = 500;
            instance.viewWrapper.current.clientHeight = 500;
            instance.setState({
                viewTransform: {
                    k: 0.4,
                    x: 50,
                    y: 50
                }
            });
            instance.entities = document.createElement("g");
            instance.entities.appendChild(entity);
        });
        it("modifies the zoom to pan to the element", function () {
            instance.panToEntity(entity, false);
            expect(entity.getBBox).toHaveBeenCalled();
            expect(instance.setZoom).toHaveBeenCalledWith(0.4, 168, 186, 750);
        });
        it("modifies the zoom to pan and zoom to the element", function () {
            instance.panToEntity(entity, true);
            expect(entity.getBBox).toHaveBeenCalled();
            expect(instance.setZoom).toHaveBeenCalledWith(1.125, 19.375, 70, 750);
        });
    });
    describe("panToNode method", function () {
        var entity = document.createElement("g");
        entity.id = "node-a1-container";
        beforeEach(function () {
            instance.panToEntity = jest.fn();
            instance.entities = document.createElement("g");
            instance.entities.appendChild(entity);
        });
        it("calls panToEntity on the appropriate node", function () {
            instance.panToNode("a1");
            expect(instance.panToEntity).toHaveBeenCalledWith(entity, false);
        });
    });
    describe("panToEdge method", function () {
        var entity = document.createElement("g");
        entity.id = "edge-a1-a2-container";
        beforeEach(function () {
            instance.panToEntity = jest.fn();
            instance.entities = document.createElement("g");
            instance.entities.appendChild(entity);
        });
        it("calls panToEntity on the appropriate edge", function () {
            instance.panToEdge("a1", "a2");
            expect(instance.panToEntity).toHaveBeenCalledWith(entity, false);
        });
    });
});
