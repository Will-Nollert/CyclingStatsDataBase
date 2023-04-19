const mongoose = require("mongoose");

 const bicycleRacerSchema = new mongoose.Schema({
    riderName: {
      type: String,
      unique: true,
      required: true
    },
    nationality: {
      type: String
    },
    dateOfBirth: {
      type: String
    },
    age: {
      type: Number
    },
    weight: {
      type: Number
    },
    height: {
      type: Number
    },
    relativeStrength: [{
      type: {
        type: String,
        enum: ['gc', 'timeTrial', 'sprint', 'climber']
      },
      score: {
        type: Number
      }
    }],
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
  }
);

  
  


const BicycleRacer = mongoose.model("BicycleRacer", bicycleRacerSchema);

module.exports = BicycleRacer;