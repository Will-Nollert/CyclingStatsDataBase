const mongoose = require("mongoose");

const raceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stage_: { type: String},
  date_: { type: String, required: true },
  year_: { type: String },
  start_time_: { type: String },
  avg_speed_winner_: { type: String },
  race_category_: { type: String },
  distance_: { type: String },
  points_scale_: { type: String },
  uci_scale_: { type: String },
  parcours_type_: { type: String },
  profilescore_: { type: String },
  vert_meters_: { type: String },
  departure_: { type: String },
  arrival_: { type: String },
  race_ranking_: { type: String },
  startlist_quality_score_: { type: String },
  won_how_: { type: String },
  avg_temperature_: { type: String },
  finishers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "RacerFinisher" },
  ],
});

const raceObject = mongoose.model("raceObject", raceSchema);

module.exports = raceObject;
