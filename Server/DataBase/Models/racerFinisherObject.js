const mongoose = require("mongoose");

const racerFinisherSchema = new mongoose.Schema({
  position: { type: String, required: true },
  riderName: { type: String, required: true },
  race: { type: mongoose.Schema.Types.ObjectId, ref: "Race", required: true },
  teamName: { type: String, required: true },
});

const RacerFinisher = mongoose.model("RacerFinisher", racerFinisherSchema);

module.exports = RacerFinisher;
