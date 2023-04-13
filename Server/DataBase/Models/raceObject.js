const mongoose = require("mongoose");

const raceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: String, required: true },
  start_time: { type: String },
  avg_speed_winner: { type: String },
  race_category: { type: String },
  distance: { type: String },
  points_scale: { type: String },
  uci_scale: { type: String },
  parcours_type: { type: String },
  profilescore: { type: String },
  vert_meters: { type: String },
  departure: { type: String },
  arrival: { type: String },
  race_ranking: { type: String },
  startlist_quality_score: { type: String },
  won_how: { type: String },
  avg_temperature: { type: String },
  raceFinishers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "RacerFinisher" },
  ],
});

const raceObject = mongoose.model("raceObject", raceSchema);

module.exports = raceObject;
