
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Halisaha Backend API',
    description: 'API for Halisaha application',
  },
  host: 'localhost:3000',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
