const express = require("express");
const router = express.Router();
const Race = require("../DataBase/Models/raceObject");
const RacerFinisher = require("../DataBase/Models/racerFinisherObject");

//Get All races
router.get("/api/races", async (req, res) => {
  try {
    const races = await Race.find().populate({
      path: "raceFinishers",
      select: "name finishPlace -_id",
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

// Get a specific race by name and date
router.get("/races/:name/:date", async (req, res) => {
  try {
    const race = await Race.findOne({
      name: req.params.name,
      date: req.params.date,
    }).populate({
      path: "raceFinishers",
      select: "name finishPlace -_id",
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
router.delete("/races/:name/:date", async (req, res) => {
  try {
    const race = await Race.findOneAndDelete({
      name: req.params.name,
      date: req.params.date,
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
router.get("/races/:name/:date/racerFinishers", async (req, res) => {
  try {
    const racerFinishers = await RacerFinisher.find({
      raceName: req.params.name,
      raceDate: req.params.date,
    });
    res.json(racerFinishers);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Add a racerFinisher for a specific race by name and date
router.post("/races/:name/:date/racerFinishers", async (req, res) => {
  try {
    const racerFinisher = new RacerFinisher({
      ...req.body,
      raceName: req.params.name,
      raceDate: req.params.date,
    });
    const savedRacerFinisher = await racerFinisher.save();
    res.json(savedRacerFinisher);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
