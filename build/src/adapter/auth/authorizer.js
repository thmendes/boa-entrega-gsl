"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizer = void 0;
const jwk = require('jsonwebtoken');
const jsonwebtoken_1 = require("jsonwebtoken");
const cognito_client_1 = require("../../commons/clients/cognito.client");
const jwkToPem = require('jwk-to-pem');
const request = require('request');
const iss = `https://cognito-idp.us-east-1.amazonaws.com/${cognito_client_1.cognitoUserPool}`;
const generatePolicy = (principalId, effect, resource) => {
    const authResponse = {};
    authResponse.principalId = principalId;
    if (effect && resource) {
        const policyDocument = {};
        policyDocument.Version = '2012-10-17';
        policyDocument.Statement = [];
        const statementOne = {};
        statementOne.Action = 'execute-api:Invoke';
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    return authResponse;
};
const authorizer = (event, context, cb) => {
    console.log('Auth function invoked');
    if (event.authorizationToken) {
        const token = event.authorizationToken.substring(7);
        request({ url: `${iss}/.well-known/jwks.json`, json: true }, (error, response, body) => {
            if (error || response.statusCode !== 200) {
                console.log('Request error:', error);
                cb('Unauthorized');
            }
            const keys = body;
            const k = keys.keys[0];
            const jwkArray = {
                kty: k.kty,
                n: k.n,
                e: k.e,
            };
            const pem = jwkToPem(jwkArray);
            (0, jsonwebtoken_1.verify)(token, pem, { issuer: iss }, (err, decoded) => {
                if (err) {
                    console.log('Unauthorized user:', err.message);
                    cb('Unauthorized');
                }
                else {
                    console.log((0, jsonwebtoken_1.decode)(token));
                    cb(null, generatePolicy(decoded.sub, 'Allow', event.methodArn));
                }
            });
        });
    }
    else {
        console.log('No authorizationToken found in the header.');
        cb('Unauthorized');
    }
};
exports.authorizer = authorizer;
//# sourceMappingURL=authorizer.js.map