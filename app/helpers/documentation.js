const server = [];
if (process.env.DEV_ENDPOINT) server.push({ url: process.env.DEV_ENDPOINT, description: 'development' });
if (process.env.PROD_ENDPOINT) server.push({ url: process.env.PROD_ENDPOINT, description: 'production' });

const swaggerDocumentation = {
    openapi: "3.0.0",
    info: {
        title: 'API Documentation',
        version: '1.0.0',
        description: 'API Documentation',
    },
    servers: server,
    components: {},
    paths: {
        '/api/v1/twitter/getTwitterAnalysis': {
            get: {
                tags: ["twitter"],
                description: "Get information about a twitter post",
                parameters: [
                    {
                        in: 'query',
                        name: 'twitterPostUrl',
                        type: 'string',
                        required: true,
                        description: 'The twitter post url'
                    }
                ],
                responses: {
                    200: {
                        description: "Success",
                        content: {
                            "application/json": {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: { type: 'number' },
                                        message: { type: 'string' },
                                        data: {type: 'object'},
                                    }
                                },
                            }
                        }
                    },
                    400: {
                        description: "Bad Request",
                    },
                    404: {
                        description: "Not found",
                    },
                    500: {
                        description: "Internal Server Error",
                    }
                }
            },
        }
    }
}

module.exports = swaggerDocumentation;