import middy from "@middy/core";
import { APIGatewayProxyEvent } from "aws-lambda";
import { ApiGatewayMiddleware } from "../../middlewares/api-gateware.middleware";
import { cognitoClient, cognitoClientId, cognitoUserPool } from '../../commons/clients/cognito.client'
import { ICredentials } from "../../interfaces/credentials.interface";
import { buildErrorResponse, knownErrors } from '../../commons/utils/error.utils'

export const signin = middy(async function baseHandler(event: APIGatewayProxyEvent): Promise<any> {
    console.log('authRepository::signin');
    try {
        const credentials = event.body as unknown as ICredentials;
        console.log('credentials', JSON.stringify(credentials), 'cognitoUserPool', cognitoUserPool, 'cognitoClientId', cognitoClientId);
        let result = await cognitoClient.adminInitiateAuth({
            AuthFlow: 'ADMIN_NO_SRP_AUTH',
            ClientId: cognitoClientId,
            UserPoolId: cognitoUserPool,
            AuthParameters: {
                USERNAME: credentials.username,
                PASSWORD: credentials.password
            }
        }).promise()

        let user = await cognitoClient.adminGetUser({
            UserPoolId: cognitoUserPool,
            Username: credentials.username
        }).promise()

        Object.assign(result, user)
        return result;
    }
    catch (error) {
        console.log('authRepository::signin:::error', error);
        if (error.code == 'NotAuthorizedException') {
            console.log('authRepository::signin:::NotAuthorizedException');
            return buildErrorResponse(knownErrors.NOT_AUTHORIZED, [])
        } else {
            console.log('authRepository::signin:::internal error', error);
            return buildErrorResponse(knownErrors.INTERNAL, []);
        }
    }
})
    .use(ApiGatewayMiddleware);