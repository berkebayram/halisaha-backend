const express = require('express');
const cors = require('cors');
const config = require('./config');
const connectDB = require('./db');
const { getUserRouter } = require('./routes/user_route');


const startApp = async () => {
    console.log(`Connecting to Database(${config.dbUrl})`);
    await connectDB(config.dbUrl);
    console.log(`Connected to Database(${config.dbUrl})`);

    const app = express();
    app.use(cors());
    app.use(express.json());


    app.use(getUserRouter())

    app.listen(config.port, () => {
        console.log(`Server is running on port: ${config.port}`);
    });
}

startApp()

