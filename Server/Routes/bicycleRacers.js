const express = require("express");
const router = express.Router();
const Race = require("../DataBase/Models/raceObject");
const BicycleRacer = require("../DataBase/Models/bicycleRacer");

//Get ALL BicycleRacers with RaceID and Position
router.get("/", async (req, res) => {
  try {
    const bicycleRacers = await BicycleRacer.find();
    res.json(bicycleRacers);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//Get A specific BicycleRacer with race history
router.get("/:riderName/history", async (req, res) => {
  try {
    const bicycleRacer = await BicycleRacer.findOne({
      riderName: req.params.riderName,
    });
    if (!bicycleRacer) {
      return res.status(404).send("Bicycle racer not found");
    }

    const races = await Race.find({
      _id: { $in: bicycleRacer.races.map((race) => race.race) },
    });

    const raceHistory = races.map((race) => {
      const position = bicycleRacer.races.find((r) =>
        r.race.equals(race._id)
      ).position;
      return {
        raceName: race.name,
        date: race.date_,
        position: position,
      };
    });

    res.json(raceHistory);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//Rank ONE riders races by finish position
router.get("/:riderName/rankedHistory", async (req, res) => {
  try {
    const bicycleRacer = await BicycleRacer.findOne({
      riderName: req.params.riderName,
    });
    if (!bicycleRacer) {
      return res.status(404).send("Bicycle racer not found");
    }

    const races = await Race.find({
      _id: { $in: bicycleRacer.races.map((race) => race.race) },
    });

    const raceHistory = races.map((race) => {
      const position = bicycleRacer.races.find((r) =>
        r.race.equals(race._id)
      ).position;
      return {
        raceName: race.name,
        raceDate: race.date_,
        position: position,
      };
    });

    const rankedHistory = raceHistory.sort(
      (a, b) => parseInt(a.position) - parseInt(b.position)
    );

    res.json(rankedHistory);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
