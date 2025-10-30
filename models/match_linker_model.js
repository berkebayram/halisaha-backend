const { default: mongoose } = require("mongoose");

const matchLinkerSchema = new mongoose.Schema({
    positionId: {
        type: Number,
        required: true,
    },
    matchId: {
        type: String,
        required: true
    },
    used: {
        type: Boolean,
        default: false
    }
});

const MatchLinker = mongoose.model("MatchLinker", matchLinkerSchema);

module.exports = {
    MatchLinker
}
