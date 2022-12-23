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
    paths: {}
}

module.exports = swaggerDocumentation;