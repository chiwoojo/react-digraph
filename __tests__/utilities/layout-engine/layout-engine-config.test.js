"use strict";
exports.__esModule = true;
var layout_engine_config_1 = require("../../../src/utilities/layout-engine/layout-engine-config");
describe("LayoutEngineConfig", function () {
    var output = null;
    describe("class", function () {
        it("is defined", function () {
            expect(layout_engine_config_1.LayoutEngines).toBeDefined();
            expect(layout_engine_config_1.LayoutEngines.None).toBeDefined();
            expect(layout_engine_config_1.LayoutEngines.SnapToGrid).toBeDefined();
            expect(layout_engine_config_1.LayoutEngines.VerticalTree).toBeDefined();
            expect(layout_engine_config_1.LayoutEngines.HorizontalTree).toBeDefined();
        });
    });
});
