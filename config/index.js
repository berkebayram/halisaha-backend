const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    port: process.env.PORT || 3000,
    dbUrl: process.env.DB_URL || "mongodb://localhost:27017",
    authSecret: process.env.AUTH_SECRET || "sanar",
    authDur: process.env.AUTH_DUR || "1h",
    refreshSecret: process.env.REF_SECRET || "sanar_ref",
    refreshDur: process.env.REF_DUR || "7d",
    hashRound: parseInt(process.env.HASH_ROUND, 10),
};
