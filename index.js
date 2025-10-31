const express = require('express');
const cors = require('cors');
const config = require('./config');
const connectDB = require('./db');
const { getUserRouter } = require('./routes/user_route');
const { getMatchRouter } = require('./routes/match_route');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');


const startApp = async () => {
    console.log(`Connecting to Database(${config.dbUrl})`);
    await connectDB(config.dbUrl);
    console.log(`Connected to Database(${config.dbUrl})`);

    const app = express();
    app.use(cors());
    app.use(express.json());

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.use(getUserRouter());
    app.use(getMatchRouter());

    app.listen(config.port, () => {
        console.log(`Server is running on port: ${config.port}`);
    });
}

startApp()

