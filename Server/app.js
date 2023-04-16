/*************************
 * CONSTANTS AND IMPORTS *
 *************************/
const express = require("express");
const app = express();
const connectDB = require("./DataBase/db");
require("dotenv").config();

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


/*********************
 * EXPRESS & ROUTERS *
 *********************/
const racesRouter = require("./Routes/races");
app.use("/api/races", racesRouter);


const bicycleRacersRouter = require("./Routes/bicycleRacers");
app.use("/api/bicycle-racers", bicycleRacersRouter);

/****************************
 * CREATE NEW BICYCLERACERS *
 ****************************/
/* scrapes through race results and creates a new bicycleRacer 
for every unique riderName in the RacerFinisher collection */
//import { updateBicycleRacers } from "./utils";
//updateBicycleRacers() 
