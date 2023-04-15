/*************************
 * CONSTANTS AND IMPORTS *
 *************************/
const express = require("express");
const app = express();
const connectDB = require("./DataBase/db");
require("dotenv").config();
const BicycleRacer = require("./DataBase/Models/bicycleRacer");
const RacerFinisher = require("./DataBase/Models/racerFinisherObject");
/********************
 * MONGOOSE CONNECT *
 * ******************/
async function startServer() {
  try {
    connectDB();
    app.listen(3000, () => {
      console.log(`Server started on port ${process.env.PORT || 3000}`);
    });
  } catch (error) {
    console.log("MongoDB connection error: ", error);
  }
}
startServer();
//updateBicycleRacers() 

/*********************
 * EXPRESS & ROUTERS *
 *********************/
const racesRouter = require("./Routes/races");
app.use("/api/races", racesRouter);


const bicycleRacersRouter = require("./Routes/bicycleRacers");
app.use("/api/bicycle-racers", bicycleRacersRouter);


// Function to update the BicycleRacer model with the races and positions for each racer
async function updateBicycleRacers() {
  try {
    // Find all racer finishers
    const racerFinishers = await RacerFinisher.find();
    
    // Group the racer finishers by riderName
    const racerFinishersByRider = {};
    for (const racerFinisher of racerFinishers) {
      if (!racerFinishersByRider[racerFinisher.riderName]) {
        racerFinishersByRider[racerFinisher.riderName] = [];
      }
      racerFinishersByRider[racerFinisher.riderName].push(racerFinisher);
    }
    
    // Update or create a BicycleRacer for each rider
    for (const [riderName, racerFinishers] of Object.entries(racerFinishersByRider)) {
      const bicycleRacer = await BicycleRacer.findOneAndUpdate(
        { riderName },
        {
          riderName,
          races: racerFinishers.map((racerFinisher) => {
            return {
              race: racerFinisher.race,
              position: racerFinisher.position
            };
          })
        },
        { upsert: true, new: true }
      );
    }
  } catch (error) {
    console.log(error.message);
  }
}