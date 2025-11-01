const express = require('express');
const { createUser, getMe, getUserInfo } = require('../controllers/user_controller');
const { validateBody, validateAuth, validateRefreshToken } = require('../middlewares');
const { createUserValidator, loginUserValidator } = require('../validators/user_validator');
const { handleLogin, handleRefresh } = require('../controllers/auth_controller');

const getUserRouter = () => {
    const userRouter = express.Router()
    userRouter.post("/register", validateBody(createUserValidator), createUser);
    userRouter.post("/login", validateBody(loginUserValidator), handleLogin);
    userRouter.get("/refresh", validateRefreshToken(), handleRefresh);
    userRouter.get("/me", validateAuth(), getMe);
    userRouter.get("/info", getUserInfo);
    return userRouter;
}

module.exports = {
    getUserRouter
}
