"use strict";
exports.__esModule = true;
var transformer_1 = require("../../../src/utilities/transformers/transformer");
describe("Transformer", function () {
    var output = null;
    describe("class", function () {
        it("is defined", function () {
            expect(transformer_1["default"]).toBeDefined();
        });
    });
    describe("transform method", function () {
        it("returns a default response", function () {
            var expected = {
                edges: [],
                nodes: []
            };
            var result = transformer_1["default"].transform();
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
    });
    describe("revert method", function () {
        it("mocks out the revert method", function () {
            var expected = {
                edges: [],
                nodes: []
            };
            var result = transformer_1["default"].revert(expected);
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
    });
});
