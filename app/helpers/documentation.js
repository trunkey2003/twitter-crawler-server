const swaggerDocumentation = {
    openapi: "3.0.0",
    info: {
        title: 'API Documentation',
        version: '1.0.0',
        description: 'API Documentation',
    },
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
                    },
                    503: {
                        description: "Service Unavailable",
                    },
                }
            },
        },
        '/api/v1/twitter/getTrendingHashtags':{
            get: {
                tags: ["twitter"],
                description: "Get information about trending hashtags and topics",
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
                    },
                    503: {
                        description: "Service Unavailable",
                    },
                }
            }
            
        }
    }
}

module.exports = swaggerDocumentation;