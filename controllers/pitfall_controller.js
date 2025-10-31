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
        if (!found) {
            const coordinates = []
            coordinates.push(long);
            coordinates.push(lat);

            const newPitfall = new Pitfall({
                name: name,
                location: {
                    type: 'Point',
                    coordinates: coordinates
                }
            });

            // 2. Save the new document to the database
            const savedPitfall = await newPitfall.save();
            return savedPitfall;

        }
        return found;
    }
    catch (err) {
        console.log(`Err on pitfall creation : ${err.message}`);
    }
}

module.exports = {
    findOrCreatePitfall
}
