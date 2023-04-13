const mongoose = require("mongoose");

const raceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: String, required: true },
  raceFinishers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "RacerFinisher" },
  ],
});

const raceObject = mongoose.model("raceObject", raceSchema);

module.exports = raceObject;
