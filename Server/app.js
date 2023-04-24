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
app.options("/api/races", cors());
app.use("/api/races", racesRouter);

const bicycleRacersRouter = require("./Routes/bicycleRacers");
app.options("/api/bicycle-racers", cors());
app.use("/api/bicycle-racers", bicycleRacersRouter);

const Race = require("./DataBase/Models/raceObject");
const RacerFinisher = require("./DataBase/Models/racerFinisherObject");
const BicycleRacer = require("./DataBase/Models/bicycleRacer");
const axios = require("axios");
const cheerio = require("cheerio");
//const fetch = require("node-fetch");

