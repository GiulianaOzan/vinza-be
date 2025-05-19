"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const express_1 = __importDefault(require("express"));
const handler_1 = require("@/error/handler");
function default_1() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    // Routes
    //   app.use('/api/items', itemRoutes);
    // Global error handler (should be after routes)
    app.use(handler_1.errorHandler);
    return app;
}
