const { Match, MatchLinker } = require("../models");
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
        var positions = [];
        for (var i = 0; i < 12; i++)
            positions.push({ playerId: "", positionId: i })
        const createdMatch = await Match.create({
            pitfallId: pitfall._id,
            matchDate,
            positions,
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
        const { pitfallName, long, lat, matchDate } = req.params;
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
        return res.status(400).json({ message: "Bad Request" });
    }
}

const inviteOrAssignPosition = async (req, res) => {
    try {
        const {
            matchId,
            positionId,
            assignSelf
        } = req.body;
        const { userId } = req.body;
        var match = await Match.findById(matchId);
        if (!match)
            return res.status(404).json({ message: "Given match not found" });
        if (match.creator != userId)
            return res.status(401).json({ message: "Unauthorized Request" });
        for (var pos of match.positions) {
            if (pos.positionId != positionId)
                continue;
            if (pos.playerId != null || pos.playerId !== "")
                return res.status(400).json({ message: "Position is already taken" })
            if (assignSelf) {
                pos.playerId = userId;
                await match.save();
                return res.status(200).json({
                    _id: null,
                    ...match.toJSON()
                });
            }
            else {
                const linker = await MatchLinker.create({ matchId: match._id.toString(), positionId: positionId });
                return res.status(200).json({ linker });
            }
        }
    }
    catch (err) {
        console.log(`Err on match available hours : ${err.message}`);
        return res.status(400).json({ message: "Bad Request" });
    }
}

const kickPlayer = async (req, res) => {
    try {
        const { userId } = req;
        const { matchId, positionId } = req.body;
        var match = await Match.findById(matchId);
        if (!match)
            return res.status(404).json({ message: "Given match not found" });
        if (match.creator != userId)
            return res.status(401).json({ message: "Unauthorized Request" });
        for (var pos of match.positions) {
            if (pos.positionId != positionId)
                continue;
            if (pos.playerId == null || pos.playerId === "")
                return res.status(400).json({ message: "Bad Request" });
            if (pos.playerId == userId)
                return res.status(400).json({ message: "Bad Request" });
            pos.playerId = "";
            await match.save();
            return res.status(200).json({ _id: null, ...match.toJSON() });
        }
    }
    catch (err) {
        console.log(`Err on match kick: ${err.message}`);
        return res.status(400).json({ message: "Bad Request" });
    }
}

const displayMatch = async (req, res) => {
    try {
        const { userId } = req;
        const { matchId } = req.params;
        const match = await Match.findById(matchId);
        if (!match)
            return res.status(404).json({ message: "Match Not Found" });
        let canSee = match.creator === userId;
        for (var position of match.positions) {
            if (position.positionId == null || position.positionId === "")
                continue;
            canSee = canSee || position.playerId == userId;
        }
        if (!canSee)
            return res.status(400).json({ message: "Unauthorized Request" });
        return res.status(200).json({ _id: null, ...match.toJSON() });
    }
    catch (err) {
        console.log(`Err on match kick: ${err.message}`);
        return res.status(400).json({ message: "Bad Request" });
    }
}

const interactMatchLink = async (req, res) => {
    try {
        const { userId } = req;
        const {
            linkId,
            isAccepted,
        } = req.body;
        var link = await MatchLinker.findById(linkId);
        if (!link)
            return res.status(400).json({ message: "Bad Request" });
        if (link.used)
            return res.status(400).json({ message: "Link already used" });
        link.used = true;
        if (!isAccepted) {
            await link.save();
            return res.status(200).message({ message: "Success" });
        }
        const match = await Match.findById(link.matchId);
        for (var pos of match.positions) {
            if (pos.positionId != link.positionId)
                continue;
            if (pos.playerId != null && pos.playerId !== userId)
                return res.status(400).json({ message: "Position is already filled" });
            pos.playerId = userId;
        }
        await link.save();
        await match.save();
        return res.status(200).json({ _id: null, ...match.toJSON() });
    }
    catch (err) {
        console.log(`Err on match kick: ${err.message}`);
        return res.status(400).json({ message: "Bad Request" });
    }
}

module.exports = {
    getBusyMatchHours,
    createMatch,
    inviteOrAssignPosition,
    kickPlayer,
    displayMatch,
    interactMatchLink,
}
