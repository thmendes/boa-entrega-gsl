const jwk = require('jsonwebtoken');
import { verify, decode } from "jsonwebtoken";
import { cognitoUserPool } from '../../commons/clients/cognito.client'
const jwkToPem = require('jwk-to-pem');
const request = require('request');

const iss = `https://cognito-idp.us-east-1.amazonaws.com/${cognitoUserPool}`;

// Generate policy to allow this user on this API:
const generatePolicy = (principalId, effect, resource) => {
    const authResponse = {} as any;
    authResponse.principalId = principalId;
    if (effect && resource) {
        const policyDocument = {} as any;
        policyDocument.Version = '2012-10-17';
        policyDocument.Statement = [];
        const statementOne = {} as any;
        statementOne.Action = 'execute-api:Invoke';
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    return authResponse;
};

export const authorizer = (event, context, cb) => {
    console.log('Auth function invoked');
    if (event.authorizationToken) {
        // Remove 'bearer ' from token:
        const token = event.authorizationToken.substring(7);
        // Make a request to the iss + .well-known/jwks.json URL:
        request(
            { url: `${iss}/.well-known/jwks.json`, json: true },
            (error, response, body) => {
                if (error || response.statusCode !== 200) {
                    console.log('Request error:', error);
                    cb('Unauthorized');
                }
                const keys = body;
                // Based on the JSON of `jwks` create a Pem:
                const k = keys.keys[0];
                const jwkArray = {
                    kty: k.kty,
                    n: k.n,
                    e: k.e,
                };
                const pem = jwkToPem(jwkArray);

                // Verify the token:
                verify(token, pem, { issuer: iss }, (err, decoded) => {
                    if (err) {
                        console.log('Unauthorized user:', err.message);
                        cb('Unauthorized');
                    } else {
                        console.log(decode(token))
                        cb(null, generatePolicy(decoded.sub, 'Allow', event.methodArn));
                    }
                });
            });
    } else {
        console.log('No authorizationToken found in the header.');
        cb('Unauthorized');
    }
};