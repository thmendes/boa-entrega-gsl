const AWS = require('aws-sdk');

export const cognitoClient = new AWS.CognitoIdentityServiceProvider({
    apiVersion: "2016-04-19",
    region: process.env.REGION
});

export const cognitoUserPool = process.env.COGNITO_USER_POOL;
export const cognitoClientId = process.env.COGNITO_CLIENT_ID;
