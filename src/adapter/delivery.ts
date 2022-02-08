import middy from "@middy/core";
import { APIGatewayProxyEvent } from "aws-lambda";
import { ApiGatewayMiddleware } from "../middlewares/api-gateware.middleware";
import { buildErrorResponse, knownErrors } from '../commons/utils/error.utils'

export const listAll = middy(async function baseHandler(event: APIGatewayProxyEvent): Promise<any> {
    console.log('delivery::listAll');
    try {
        return { data: "data!" };
    }
    catch (error) {
        console.log('delivery::listAll::internal error', error);
        return buildErrorResponse(knownErrors.INTERNAL, []);
    }
})
    .use(ApiGatewayMiddleware);