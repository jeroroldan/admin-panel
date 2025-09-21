"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const sales_controller_1 = require("./sales.controller");
const sales_service_1 = require("./sales.service");
describe('SalesController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [sales_controller_1.SalesController],
            providers: [sales_service_1.SalesService],
        }).compile();
        controller = module.get(sales_controller_1.SalesController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=sales.controller.spec.js.map