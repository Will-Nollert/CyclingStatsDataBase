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

//Route to get a rider by name
router.get("/:riderName", async (req, res) => {
  try {
    const bicycleRacer = await BicycleRacer.findOne({
      riderName: req.params.riderName,
    });
    if (!bicycleRacer) {
      return res.status(404).send("Bicycle racer not found");
    }
    res.json(bicycleRacer);
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
      const raceObj = {
        raceName: race.name,
        date: race.date_,
        position: bicycleRacer.races.find((r) => r.race.equals(race._id)).position,
      };
      if (race.stage_) {
        raceObj.stage = race.stage_;
      }
      return raceObj;
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
        stage: race.stage_ || null,
        raceDate: race.date_,
        position: position,
      };
    });

    const rankedHistory = raceHistory.sort((a, b) => {
      // check if a or b is DNF, OTL, or DNS
      if (['DNF', 'OTL', 'DNS'].includes(a.position)) {
        return 1; // move a to the bottom
      } else if (['DNF', 'OTL', 'DNS'].includes(b.position)) {
        return -1; // move b to the bottom
      } else {
        return parseInt(a.position) - parseInt(b.position); // sort by integer value
      }
    });

    res.json(rankedHistory);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.delete("/", async (req, res) => {
  try {
    const result = await BicycleRacer.deleteMany({});
    res.json({ message: `${result.deletedCount} BicycleRacers deleted.` });
  } catch (error) {
    res.status(500).send(error.message);
  }
});


module.exports = router;
