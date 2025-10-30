const express = require('express');
const { createUser, getMe } = require('../controllers/user_controller');
const { validateBody, validateAuth } = require('../middlewares');
const { createUserValidator, loginUserValidator } = require('../validators/user_validator');
const { handleLogin, handleRefresh } = require('../controllers/auth_controller');

const getUserRouter = () => {
    const userRouter = express.Router()
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with email, password, and name.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */
    userRouter.post("/register", validateBody(createUserValidator), createUser);
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     description: Login a user with email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
    userRouter.post("/login", validateBody(loginUserValidator), handleLogin);
/**
 * @swagger
 * /refresh:
 *   get:
 *     summary: Refresh access token
 *     description: Refresh the access token using the refresh token.
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Unauthorized
 */
    userRouter.get("/refresh", validateBody(loginUserValidator), handleRefresh);
/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get current user
 *     description: Get the currently authenticated user's information.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *       401:
 *         description: Unauthorized
 */
    userRouter.get("/me", validateAuth(), getMe);
    return userRouter;
}

module.exports = {
    getUserRouter
}

