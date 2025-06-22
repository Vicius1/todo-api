const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API To-Do List',
      version: '1.0.0',
      description: 'API para gerenciamento de tarefas com autenticação.',
    },
    servers: [{ url: 'http://localhost:3000 - Desenvolvimento' }],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/docs/routes/*.yml'], 
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = { swaggerUi, swaggerSpec };