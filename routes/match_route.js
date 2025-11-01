const express = require('express');
const { validateAuth, validateBody } = require('../middlewares');
const { getBusyMatchHours, createMatch, inviteOrAssignPosition, kickPlayer, displayMatch, interactMatchLink, getAllMatches, getMatchInfo } = require('../controllers/match_controller');
const { inviteOrAssignPositionValidator, createMatchValidator, kickPlayerValidator, interactMatchLinkValidator } = require('../validators/match_validator');

const getMatchRouter = () => {
    const matchRouter = express.Router();

    matchRouter.get("/match/available",
        validateAuth(),
        getBusyMatchHours);

    matchRouter.post("/match/create",
        validateAuth(),
        validateBody(createMatchValidator),
        createMatch);

    matchRouter.put("/match/invite",
        validateAuth(),
        validateBody(inviteOrAssignPositionValidator),
        inviteOrAssignPosition);

    matchRouter.delete("/match/player",
        validateAuth(),
        validateBody(kickPlayerValidator),
        kickPlayer);

    matchRouter.get("/match",
        validateAuth(),
        displayMatch);

    matchRouter.get("/match/all",
        validateAuth(),
        getAllMatches);

    matchRouter.post("/match/link",
        validateAuth(),
        validateBody(interactMatchLinkValidator),
        interactMatchLink);

    matchRouter.get("/match/info", getMatchInfo);

    return matchRouter;
}

module.exports = {
    getMatchRouter
}
