const { Match } = require("../models");
const { findOrCreatePitfall } = require("./pitfall_controller");

const createMatch = async (req, res) => {
    try {
        const { userId } = req;
        const { pitfallName, long, lat, matchDate, matchHour, isPublic } = req.body;
        const pitfall = await findOrCreatePitfall(pitfallName, long, lat);
        const hasMatch = await Match.findOne({
            pitfallId: pitfall._id,
            matchHour
        });
        if (hasMatch)
            return res.status(400).json({ message: "Bad Request" });
        const createdMatch = await Match.create({
            pitfallId: pitfall._id,
            matchDate,
            positions: [],
            matchHour,
            creator: userId,
            isPublic,
        });
        return res.status(200).json({
            _id: null,
            ...createdMatch.toJSON()
        });
    }
    catch (err) {
        console.log(`Err on match creation : ${err.message}`);
        return res.status(500).json({ message: "Internal Server Request" });
    }
}

const getBusyMatchHours = async (req, res) => {
    try {
        const { pitfallName, long, lat, matchDate } = req.body;
        const pitfall = await findOrCreatePitfall(pitfallName, long, lat);
        const matchesOnDate = await Match.find({
            pitfallId: pitfall._id,
            matchDate,
        });
        const res = [];
        for (var i = 0; i < matchesOnDate.length; i++) {
            var match = matchesOnDate[i];
            res.push(match.matchHour);
        }

        return res.status(200).json({ busyHours: res });
    }
    catch (err) {
        console.log(`Err on match available hours : ${err.message}`);
        return res.status(500).json({ message: "Internal Server Request" });
    }
}
