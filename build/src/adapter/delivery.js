"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAll = void 0;
const core_1 = __importDefault(require("@middy/core"));
const api_gateware_middleware_1 = require("../middlewares/api-gateware.middleware");
const error_utils_1 = require("../commons/utils/error.utils");
exports.listAll = (0, core_1.default)(async function baseHandler(event) {
    console.log('delivery::listAll');
    try {
        return { data: "data!" };
    }
    catch (error) {
        console.log('delivery::listAll::internal error', error);
        return (0, error_utils_1.buildErrorResponse)(error_utils_1.knownErrors.INTERNAL, []);
    }
})
    .use(api_gateware_middleware_1.ApiGatewayMiddleware);
//# sourceMappingURL=delivery.js.map