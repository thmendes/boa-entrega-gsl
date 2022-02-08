"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signin = void 0;
const core_1 = __importDefault(require("@middy/core"));
const api_gateware_middleware_1 = require("../../middlewares/api-gateware.middleware");
const cognito_client_1 = require("../../commons/clients/cognito.client");
const error_utils_1 = require("../../commons/utils/error.utils");
exports.signin = (0, core_1.default)(async function baseHandler(event) {
    console.log('authRepository::signin');
    try {
        const credentials = event.body;
        let result = await cognito_client_1.cognitoClient.adminInitiateAuth({
            AuthFlow: 'ADMIN_NO_SRP_AUTH',
            ClientId: cognito_client_1.cognitoClientId,
            UserPoolId: cognito_client_1.cognitoUserPool,
            AuthParameters: {
                USERNAME: credentials.username,
                PASSWORD: credentials.password
            }
        }).promise();
        let user = await cognito_client_1.cognitoClient.adminGetUser({
            UserPoolId: cognito_client_1.cognitoUserPool,
            Username: credentials.username
        }).promise();
        Object.assign(result, user);
        return result;
    }
    catch (error) {
        console.log('authRepository::signin:::error', error);
        if (error.code == 'NotAuthorizedException') {
            console.log('authRepository::signin:::NotAuthorizedException');
            return (0, error_utils_1.buildErrorResponse)(error_utils_1.knownErrors.NOT_AUTHORIZED, []);
        }
        else {
            console.log('authRepository::signin:::internal error', error);
            return (0, error_utils_1.buildErrorResponse)(error_utils_1.knownErrors.INTERNAL, []);
        }
    }
})
    .use(api_gateware_middleware_1.ApiGatewayMiddleware);
//# sourceMappingURL=signin.js.map