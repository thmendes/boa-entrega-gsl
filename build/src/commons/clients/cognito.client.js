"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cognitoClientId = exports.cognitoUserPool = exports.cognitoClient = void 0;
const AWS = require('aws-sdk');
exports.cognitoClient = new AWS.CognitoIdentityServiceProvider({
    apiVersion: "2016-04-19",
    region: process.env.REGION
});
exports.cognitoUserPool = process.env.COGNITO_USER_POOL;
exports.cognitoClientId = process.env.COGNITO_CLIENT_ID;
//# sourceMappingURL=cognito.client.js.map