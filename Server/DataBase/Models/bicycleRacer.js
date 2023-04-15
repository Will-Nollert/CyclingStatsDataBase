const mongoose = require("mongoose");

const bicycleRacerSchema = new mongoose.Schema({
    riderName: {
      type: String,
      unique: true,
      required: true
    },
    races: [{
      race: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Race',
        required: true
      },
      position: {
        type: String,
        required: true
      }
    }]
  });
  

const BicycleRacer = mongoose.model("BicycleRacer", bicycleRacerSchema);

module.exports = BicycleRacer;