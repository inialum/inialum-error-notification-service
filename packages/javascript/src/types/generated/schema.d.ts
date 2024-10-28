/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/api/v1/notify": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            /** @description Error message you want to notify */
            requestBody: {
                content: {
                    "application/json": components["schemas"]["Request"];
                };
            };
            responses: {
                /** @description Returns OK response if the notification is successful */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Response"];
                    };
                };
                /** @description Bad request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example Invalid request body */
                            message: string;
                            /** @example [
                             *       {
                             *         "code": "invalid_string",
                             *         "expected": "string",
                             *         "received": "undefined",
                             *         "path": [
                             *           "message"
                             *         ],
                             *         "message": "This field is required"
                             *       }
                             *     ] */
                            issues: {
                                code: string;
                                expected: string;
                                received: string;
                                path: string[];
                                message: string;
                            }[];
                        };
                    };
                };
                /** @description Internal server error or external API error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example Failed to notify error */
                            message: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        Response: {
            /** @example ok */
            status: string;
        };
        Request: {
            /** @example API Error */
            title: string;
            /** @example Error occurred in XXX function */
            description?: string;
            /** @example inialum-mail-service */
            service_name: string;
            /** @example production */
            environment: "local" | "staging" | "production";
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export type operations = Record<string, never>;