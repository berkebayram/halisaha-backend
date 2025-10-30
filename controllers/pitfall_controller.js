const { Pitfall } = require("../models")

const findOrCreatePitfall = async (name, long, lat) => {
    try {
        const found = await Pitfall.findOne({
            name: name,
            location: {
                type: "Point",
                coordinates: [long, lat]
            }
        });
        if (!found)
            found = await Pitfall.create({
                name: name,
                location: {
                    type: "Point",
                    coordinates: [long, lat]
                }
            })
        return found;
    }
    catch (err) {
        console.log(`Err on pitfall creation : ${err.message}`);
    }
}

module.exports = {
    findOrCreatePitfall
}
