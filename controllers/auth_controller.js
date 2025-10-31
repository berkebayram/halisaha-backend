const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { authSecret, refreshSecret, authDur, refreshDur } = require("../config");

const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const found = await User.findOne({ email });
        if (!found)
            return res.status(404).json({ message: "Not Found" });
        const same = bcrypt.compareSync(password, found.passHash);
        if (!same)
            return res.status(400).json({ message: "Bad Request" });
        const auth = jwt.sign({ id: found._id.toString() }, authSecret, { expiresIn: '1h' });
        const refresh = jwt.sign({ id: found._id.toString() }, refreshSecret, { expiresIn: '7d' });
        return res.status(200).json({ auth, refresh });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const handleRefresh = async (req, res) => {
    try {
        const { userId } = req.body;
        const auth = jwt.sign(userId, authSecret, { expiresIn: '1h' });
        const refresh = jwt.sign({ userId }, refreshSecret, { expiresIn: '7d' });
        return res.status(200).json({ auth, refresh })
    }
    catch {
        return res.status(500);
    }
}

module.exports = {
    handleLogin,
    handleRefresh
}
