const express = require('express');
const { validateAuth } = require('../middlewares');
const { getBusyMatchHours, createMatch } = require('../controllers/match_controller');

const getMatchRouter = () => {
    const matchRouter = express.Router();
    matchRouter.get("/match/available", validateAuth(), getBusyMatchHours);
    matchRouter.post("/match/create", validateAuth(), createMatch)
}
