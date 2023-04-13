const mongoose = require("mongoose");

const racerFinisherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  race: { type: mongoose.Schema.Types.ObjectId, ref: "Race", required: true },
  finishPlace: { type: Number, required: true },
});

const RacerFinisher = mongoose.model("RacerFinisher", racerFinisherSchema);

module.exports = RacerFinisher;
