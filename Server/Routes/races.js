var bodyParser = require("body-parser");
const express = require("express");
const router = express.Router();
const Race = require("../DataBase/Models/raceObject");
const RacerFinisher = require("../DataBase/Models/racerFinisherObject");

// create application/json parser
var jsonParser = bodyParser.json();

//Get All races
router.get("/api/races", async (req, res) => {
  try {
    const races = await Race.find().populate({
       path: "finishers",
      select: "position riderName -_id",
    });    
    res.json(races);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

//Post to races
router.post("/races", async (req, res) => {
  try {
    const race = new Race(req.body);
    const savedRace = await race.save();
    res.json(savedRace);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//post to races with finishers
router.post("/races-with-finishers", jsonParser, async (req, res) => {
  console.log(req.body);
  try {
    const { race, finishers } = req.body;

    // Save the race
    const newRace = new Race(race);
    const savedRace = await newRace.save();

    // Save the finishers
    const raceFinishers = [];
    for (let i = 0; i < finishers.length; i++) {
      const finisher = new RacerFinisher({
        ...finishers[i],
        race: savedRace._id,
      });
      const savedFinisher = await finisher.save();
      raceFinishers.push(savedFinisher);
    }

    // Update the race with the finishers
    savedRace.finishers = raceFinishers;
    await savedRace.save();

    res.json(savedRace);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get a specific race by name and date
router.get("/races/:name/:date_", async (req, res) => {
  try {
    const race = await Race.findOne({
      name: req.params.name,
      date_: req.params.date_,
    }).populate({
       path: "finishers",
      select: "position riderName -_id",
    });
    if (!race) {
      return res.status(404).send("Race not found");
    }
    res.json(race);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete a specific race by name and date
router.delete("/races/:name/:date_", async (req, res) => {
  try {
    const race = await Race.findOneAndDelete({
      name: req.params.name,
      date_: req.params.date_,
    });
    if (!race) {
      return res.status(404).send("Race not found");
    }
    res.send("Race deleted");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get all racerFinishers for a specific race by name and date
router.get("/races/:name/:date_/racerFinishers", async (req, res) => {
  try {
    const racerFinishers = await RacerFinisher.find({
      raceName: req.params.name,
      raceDate: req.params.date_,
    });
    res.json(racerFinishers);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Add a racerFinisher for a specific race by name and date
router.post("/races/:name/:date_/racerFinishers", async (req, res) => {
  try {
    const racerFinisher = new RacerFinisher({
      ...req.body,
      raceName: req.params.name,
      raceDate: req.params.date_,
    });
    const savedRacerFinisher = await racerFinisher.save();
    res.json(savedRacerFinisher);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
