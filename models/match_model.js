const { default: mongoose } = require("mongoose");

const pitfallSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        },
    },
});

const matchPositionSchema = new mongoose.Schema({
    playerId: {
        type: String,
        required: true,
    },
    positionid: {
        type: Number,
        required: true,
    },
})


const matchSchema = new mongoose.Schema({
    pitfallId: {
        type: String,
        required: true,
    },
    matchDate: {
        type: Date,
        required: true,
    },
    positions: [matchPositionSchema],
    matchHour: {
        type: Number,
        required: true,
    },
    creator: {
        type: String,
        required: true,
    },
    isPublic: {
        type: Boolean,
        required: true,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Match = mongoose.model("Match", matchSchema);
const Pitfall = mongoose.model("Pitfall", pitfallSchema);

module.exports = {
    Pitfall,
    Match,
}
