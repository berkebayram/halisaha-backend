const express = require('express');
const cors = require('cors');
const config = require('./config');
const connectDB = require('./db');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { getUserRouter } = require('./routes/user_route');


const startApp = async () => {
    console.log(`Connecting to Database(${config.dbUrl})`);
    await connectDB(config.dbUrl);
    console.log(`Connected to Database(${config.dbUrl})`);

    const app = express();
    app.use(cors());
    app.use(express.json());

    const swaggerSpec = swaggerJsdoc({
        definition: {
            openapi: '3.0.0',
            info: { title: 'API', version: '1.0.0' },
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    }
                }
            },
            security: [{
                bearerAuth: []
            }]
        },
        apis: ['./routes/*.js'] // veya yoksa elle tanımla
    });

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.use(getUserRouter())

    app.listen(config.port, () => {
        console.log(`Server is running on port: ${config.port}`);
    });
}

startApp()

