"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGatewayMiddleware = void 0;
const cors = (headers) => {
    const allowedHeaders = '*';
    const allowedMethods = process.env.CORS_ALLOW_METHODS || 'GET, POST, PUT, PATCH, DELETE, OPTIONS';
    const allowedOrigin = '*';
    return {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': allowedMethods,
        'Access-Control-Allow-Headers': allowedHeaders,
    };
};
const successStatusCode = 200;
const errorStatusCode = 500;
exports.ApiGatewayMiddleware = ({
    after: async (request) => {
        request.response = !request.response ? { statusCode: successStatusCode, body: null } : {
            statusCode: request.response.statusCode || successStatusCode,
            body: JSON.stringify(request.response.body || request.response.statusCode ? null : request.response),
            headers: {
                ...(request.response ? request.response.headers : {}),
                ...cors(request.event.headers),
            },
        };
    },
    onError: async (request) => {
        const { message, details } = request.error;
        const isValidation = Array.isArray(details);
        const body = JSON.stringify(isValidation ? { isValidation: true, details, message } : { message });
        const statusCode = isValidation ? 422 : errorStatusCode;
        request.response = {
            body,
            statusCode,
            headers: {
                ...(request.response ? request.response.headers : {}),
                ...cors(request.event.headers),
            },
        };
    }
});
//# sourceMappingURL=api-gateware.middleware.js.map