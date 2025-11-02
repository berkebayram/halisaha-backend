const { Match, MatchLinker, Pitfall } = require("../models");
const { findOrCreatePitfall } = require("./pitfall_controller");

const createMatch = async (req, res) => {
    try {
        const { userId } = req;
        const { pitfallName, long, lat, matchDate, matchHour, isPublic } = req.body;
        const pitfall = await findOrCreatePitfall(pitfallName, long, lat);
        const hasMatch = await Match.findOne({
            pitfallId: pitfall._id,
            matchDate,
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
            created: createdMatch.toJSON()
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

const getAllMatches = async (req, res) => {
    try {
        const { userId } = req;
        const matches = await Match.find({
            creator: userId,
        });
        const result = [];
        console.log(matches.length)
        for (let match of matches) {
            result.push(match.toJSON());
        }
        return res.status(200).json({ result });
    }
    catch (err) {
        console.log(`Err on match available hours : ${err.message}`);
        return res.status(400).json({ message: "Bad Request" });
    }
}

const inviteOrAssignPosition = async (req, res) => {
    try {
        const {
            matchId, // string
            positionId, // 0 - 11 
            assignSelf // true - false
        } = req.body;
        const { userId } = req;
        var match = await Match.findById(matchId);
        if (!match)
            return res.status(404).json({ message: "Given match not found" });
        if (match.creator != userId)
            return res.status(402).json({ message: "Unauthorized Request" });
        const wantedPos = match.positions.find(x => x.positionId == positionId);
        if (wantedPos.playerId != null && wantedPos.playerId !== "")
            return res.status(400).json({ message: "Position is filled already" });
        if (assignSelf) {
            const already = match.positions.find(x => x.playerId == userId);
            if (already != null)
                already.playerId = "";
            wantedPos.playerId = userId;
            await match.save();
            return res.status(200).json(match.toJSON());
        }
        else {
            const link = await MatchLinker.create({
                positionId,
                matchId,
                used: false,
            }); // websitesi.com/link?id={verdigim id}
            return res.status(200).json({ linkId: link._id });
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

const getPitfallInfo = async (req, res) => {
    try {
        const pitfallId = req.params.pitfallId ?? req.query.pitfallId ?? req.query.PitfallId;
        console.log("PitfallId : " + pitfallId);
        const found = await Pitfall.findById(pitfallId);
        if (!found)
            return res.status(404).json({ message: "Pitfall Not Found" });

        return res.status(200).json({ _id: null, ...found.toJSON() });
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
    getAllMatches,
    getMatchInfo: getPitfallInfo,
}
