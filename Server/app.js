/*************************
 * CONSTANTS AND IMPORTS  *
 *************************/
const express = require("express");
const cors = require("cors");
const app = express();
const connectDB = require("./DataBase/db");
require("dotenv").config();
app.use(cors());
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
/********************
 * MONGOOSE CONNECT *
 * ******************/
async function startServer() {
  try {
    connectDB();
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server started on port ${process.env.PORT || 3000}`);
    });
  } catch (error) {
    console.log("MongoDB connection error: ", error);
  }
}
startServer();


/*********************
 * EXPRESS & ROUTERS *
 *********************/
const racesRouter = require("./Routes/races");
app.options('/api/races', cors());
app.use("/api/races", racesRouter);

const bicycleRacersRouter = require("./Routes/bicycleRacers");
app.options('/api/bicycle-racers', cors());
app.use("/api/bicycle-racers", bicycleRacersRouter);
/****************************
 * CREATE NEW BICYCLERACERS *
 ****************************/
/* scrapes through race results and creates a new bicycleRacer 
for every unique riderName in the RacerFinisher collection */
//import { updateBicycleRacers } from "./utils";
//updateBicycleRacers() 
const BicycleRacer = require("./DataBase/Models/bicycleRacer");
const RacerFinisher = require("./DataBase/Models/racerFinisherObject");

async function updateRiderNames() {
  try {
    const racers = await BicycleRacer.find();

    for (const racer of racers) {
      const nameParts = racer.riderName.split(' ');
      const lastName = nameParts.pop().replace(/\s/g, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const formattedName = `${lastName.toLowerCase()}-${nameParts.map((part) => part.toLowerCase()).join('-')}`
      const testName = formattedName.slice(0, -2)

      try {
        await BicycleRacer.updateOne({ _id: racer._id }, { $set: { riderName: testName } });
        console.log(`Updated rider name for ${racer.riderName} to ${testName}`);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`Duplicate key error for riderName: ${racer.testName}. Skipping...`);
        } else {
          console.log(error.message);
        }
      }
    }

    console.log('Finished updating rider names');
  } catch (error) {
    console.log(error.message);
  }
}



updateRiderNames();