const Joi = require("joi");

const createMatchValidator = Joi.object({
    pitfallName: Joi.string().required(),
    long: Joi.number().required(),
    lat: Joi.number().required(),
    matchDate: Joi.date().required(),
    matchHour: Joi.number().required(),
    isPublic: Joi.boolean().required(),
})

const inviteOrAssignPositionValidator = Joi.object({
    matchId: Joi.string().required(),
    positionId: Joi.number().required(),
    assignSelf: Joi.boolean().required(),
})

const kickPlayerValidator = Joi.object({
    matchId: Joi.string().required(),
    positionId: Joi.number().required(),
});

const interactMatchLinkValidator = Joi.object({
    matchId: Joi.string().required(),
    isAccepted: Joi.boolean().required(),
})

module.exports = {
    createMatchValidator,
    inviteOrAssignPositionValidator,
    kickPlayerValidator,
    interactMatchLinkValidator
}
