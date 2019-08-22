"use strict";
exports.__esModule = true;
var bwdl_transformer_1 = require("../../../src/utilities/transformers/bwdl-transformer");
describe("BwdlTransformer", function () {
    var output = null;
    describe("class", function () {
        it("is defined", function () {
            expect(bwdl_transformer_1["default"]).toBeDefined();
        });
    });
    describe("transform static method", function () {
        it("returns a default response when the input has no states", function () {
            var input = {};
            var expected = {
                edges: [],
                nodes: []
            };
            var result = bwdl_transformer_1["default"].transform(input);
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
        it("returns a default node edge array for a single State node", function () {
            var input = {
                StartAt: "test",
                States: {
                    test: {}
                }
            };
            var expected = {
                edges: [],
                nodes: [
                    {
                        title: "test",
                        x: 0,
                        y: 0
                    }
                ]
            };
            var result = bwdl_transformer_1["default"].transform(input);
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
        it("handles Choice nodes", function () {
            var input = {
                StartAt: "test",
                States: {
                    test: {
                        Type: "Choice",
                        Choices: [
                            {
                                Next: "test2"
                            }
                        ]
                    },
                    test2: {}
                }
            };
            var expected = {
                edges: [
                    {
                        source: "test",
                        target: "test2"
                    }
                ],
                nodes: [
                    {
                        title: "test",
                        type: "Choice",
                        x: 0,
                        y: 0
                    },
                    {
                        title: "test2",
                        x: 0,
                        y: 0
                    }
                ]
            };
            var result = bwdl_transformer_1["default"].transform(input);
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
        it("handles a Choice node with a Default value", function () {
            var input = {
                StartAt: "test",
                States: {
                    test: {
                        Type: "Choice",
                        Choices: [],
                        Default: "test2"
                    },
                    test2: {}
                }
            };
            var expected = {
                edges: [
                    {
                        source: "test",
                        target: "test2"
                    }
                ],
                nodes: [
                    {
                        title: "test",
                        type: "Choice",
                        x: 0,
                        y: 0
                    },
                    {
                        title: "test2",
                        x: 0,
                        y: 0
                    }
                ]
            };
            var result = bwdl_transformer_1["default"].transform(input);
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
        it("handles a regular node with a Next property", function () {
            var input = {
                StartAt: "test",
                States: {
                    test: {
                        Type: "Default",
                        Next: "test2"
                    },
                    test2: {}
                }
            };
            var expected = {
                edges: [
                    {
                        source: "test",
                        target: "test2"
                    }
                ],
                nodes: [
                    {
                        title: "test",
                        type: "Default",
                        x: 0,
                        y: 0
                    },
                    {
                        title: "test2",
                        x: 0,
                        y: 0
                    }
                ]
            };
            var result = bwdl_transformer_1["default"].transform(input);
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
        it("returns a default set when does not have a current node", function () {
            var input = {
                StartAt: "test",
                States: {}
            };
            var expected = {
                edges: [],
                nodes: []
            };
            var result = bwdl_transformer_1["default"].transform(input);
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
    });
    describe("revert static method", function () {
        it("returns the input", function () {
            var input = {
                test: true
            };
            var result = bwdl_transformer_1["default"].revert(input);
            expect(JSON.stringify(result)).toEqual(JSON.stringify(input));
        });
    });
});
