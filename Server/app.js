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


const BicycleRacer = require("./DataBase/Models/bicycleRacer");
const axios = require("axios");
const cheerio = require("cheerio");
//const fetch = require("node-fetch");
const RacerFinisher = require("./DataBase/Models/racerFinisherObject");


//used to add DOB height and weight nationalities and relative strength for each rider to the DB
async function updateRiderMetaData() {
  const riderNames = await getAllRiderNames();
  for (const riderName of riderNames) {
    const url = `https://www.procyclingstats.com/rider/${riderName}`;
    try {
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);
      const riderRelativeStrengthInfo = $(".left.w50.mb_w100");
      // Nationality
      const nationality = riderRelativeStrengthInfo
        .find('b:contains("Nationality:")')
        .next()
        .next()
        .text()
        .trim();
      // GC
      const gcRawScore = $("div.bg.red")
        .attr("style")
        .match(/width:\s*(\d+(\.\d+)?)%/)[1];
      //round to two decimal places
      const gcRoundScore = parseFloat(gcRawScore).toFixed(2);
      // Time Trial
      const timeTrialRawScore = $("div.bg.blue")
        .attr("style")
        .match(/width:\s*(\d+(\.\d+)?)%/)[1];
      const timeTrialRoundScore = parseFloat(timeTrialRawScore).toFixed(2);
      // Sprint
      const sprintRawScore = $("div.bg.orange")
        .attr("style")
        .match(/width:\s*(\d+(\.\d+)?)%/)[1];
      // One day races
      const oneDayRawScore = $("div.bg.green")
        .attr("style")
        .match(/width:\s*(\d+(\.\d+)?)%/)[1];
      const oneDayRoundScore = parseFloat(oneDayRawScore).toFixed(2);

      const sprintRoundScore = parseFloat(sprintRawScore).toFixed(2);
      // Climber
      const climberRawScore = $("div.bg.purple")
        .attr("style")
        .match(/width:\s*(\d+(\.\d+)?)%/)[1];
      const climberRoundScore = parseFloat(climberRawScore).toFixed(2);

      const riderInfo = $(".left.w50.mb_w100").text().trim();
      const dateOfBirthRegex =
        /Date of birth:\s*([\d]+(?:th|st|nd|rd)\s+\w+\s+\d{4})/;
      const weightRegex = /Weight:\s*([\d.]+)\s*kg/;
      const heightRegex = /Height:\s*([\d.]+)\s*m/;
      const ageRegex = /\((\d+)\)/;

      const dateOfBirthMatch = riderInfo.match(dateOfBirthRegex);
      const weightMatch = riderInfo.match(weightRegex);
      const heightMatch = riderInfo.match(heightRegex);
      const ageMatch = riderInfo.match(ageRegex);

      const dateOfBirth = dateOfBirthMatch ? dateOfBirthMatch[1] : null;
      const weight = weightMatch ? weightMatch[1] : null;
      const height = heightMatch ? heightMatch[1] : null;
      const age = ageMatch ? ageMatch[1] : null;

      // Log data fields
      console.log("Rider name:", riderName);
      console.log("Date of birth:", dateOfBirth);
      console.log("Nationality:", nationality);
      console.log("Age:", age);
      console.log("Weight:", weight, "kg");
      console.log("Height:", height, "m");
      console.log("GC:", gcRoundScore, typeof gcRoundScore);
      console.log("One Day:", oneDayRoundScore, typeof oneDayRoundScore);
      console.log("Time Trial:", timeTrialRoundScore, typeof timeTrialRoundScore);
      console.log("Sprint:", sprintRoundScore, typeof sprintRoundScore);
      console.log("Climber:", climberRoundScore, typeof climberRoundScore);
      console.log("--------------------")

      // Update the rider with the new metadata
      const filter = { riderName: riderName };
      const update = {
        dateOfBirth,
        nationality,
        age,
        weight,
        height,
        relativeStrength: [
          {type: 'gc', score: gcRoundScore},
          {type: 'timeTrial', score: timeTrialRoundScore},
          {type: 'sprint', score: sprintRoundScore},
          {type: 'climber', score: climberRoundScore},
          {type: 'oneDay', score: oneDayRoundScore} // add this line if needed
        ]
      };
      const options = { upsert: true };
      await BicycleRacer.findOneAndUpdate(filter, update, options);
    } catch (error) {
      console.error(
        `Error updating metadata for rider ${riderName}: ${error.message}`
      );
    }
  }
} 
//used to get all rider names from the DB helpful utlity function
async function getAllRiderNames() {
  try {
    const response = await fetch(
      "https://cycling-databse.herokuapp.com/api/bicycle-racers"
    );
    const data = await response.json();
    const riderNames = data.map((rider) => rider.riderName);
    return riderNames;
  } catch (error) {
    console.log(error.message);
    return [];
  }
}