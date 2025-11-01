const { hashRound, authSecret, refreshSecret } = require("../config");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
    try {
        const { email, name, password } = req.body;
        const passHash = bcrypt.hashSync(password, hashRound);
        const created = await User.create({ email, name, passHash });

        const auth = jwt.sign({ id: created._id.toString() }, authSecret, { expiresIn: '1h' });
        const refresh = jwt.sign({ id: created._id.toString() }, refreshSecret, { expiresIn: '7d' });
        return res.status(200).json({ auth, refresh });
    }
    catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

const updateUser = async (req, res) => {
    try {
        const { userId } = req;
        const { name } = req.body;
        await User.findByIdAndUpdate(
            userId,
            { name: name },
            {}
        );
        return res.status(200).json({ name: name });
    }
    catch (err) {
        return res.status(400).json({ message: err.message });
    }
}


const getMe = async (req, res) => {
    const { userId } = req;
    const details = await User.findById(userId);
    if (details == null)
        return res.status(404).json({ message: "Not Found" });
    return res.status(200).json({ email: details.email, name: details.name });
}

const changePassword = async (req, res) => {
    try {
        const { userId } = req;
        const { oldPassword, newPassword } = req.body;

        const found = await User.findById(userId);
        if (!found)
            return res.status(404).json({ message: "User Not Found" });

        const matched = bcrypt.compareSync(oldPassword, found.passHash);
        if (!matched)
            return res.status(401).json({ message: "Password does not match" });

        found.passHash = bcrypt.hashSync(newPassword, hashRound);
        await found.save();
        return res.status(200).json({ message: "Success" });

    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const getUserInfo = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId)
            return res.status(400).json({ message: "UserId not given" });

        const found = await User.findById(userId);
        if (!found)
            return res.status(404).json({ message: "User Not Found" });

        return res.status(200).json(found.toJSON());
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = {
    createUser,
    updateUser,
    getMe,
    getUserInfo,
}
