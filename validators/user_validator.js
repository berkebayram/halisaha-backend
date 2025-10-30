const Joi = require("joi");

const createUserValidator = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().min(3).max(21).required(),
    password: Joi.string().min(8).max(21).required(),
});

const loginUserValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(21).required(),
});

module.exports = {
    createUserValidator,
    loginUserValidator,
}
