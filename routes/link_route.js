const express = require('express');
const { handleLogin } = require('../controllers/auth_controller');
const { handleGetLink, serveApplicationJson } = require('../controllers/link_controller');

const getLinkRouter = () => {
    const linkRouter = express.Router();

    linkRouter.get("/link", handleGetLink)
    linkRouter.get("/.well-known/assetlinks.json", serveApplicationJson);
    return linkRouter;
}

module.exports = {
    getLinkRouter
}
