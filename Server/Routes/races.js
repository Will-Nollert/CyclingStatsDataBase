var bodyParser = require("body-parser");
const express = require("express");
const router = express.Router();
const Race = require("../DataBase/Models/raceObject");
const RacerFinisher = require("../DataBase/Models/racerFinisherObject");
const BicycleRacer = require("../DataBase/Models/bicycleRacer");

// create application/json parser
var jsonParser = bodyParser.json();

//simple auth protection for delete route
function protectRoute(req, res, next) {
  const secretKey = req.header("X-Secret-Key");
  if (secretKey === process.env.SECRET_KEY) {
    return next();
  }
  res.status(401).send("Unauthorized");
}

/********************************************
 * ROUTES TO POST A RACE W/ & W/O FINISHERS *
 ********************************************/

//Post a race object
router.post("/", protectRoute, async (req, res) => {
  try {
    const race = new Race(req.body);
    const savedRace = await race.save();
    res.json(savedRace);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//Post a race object with race finishers array
router.post(
  "/races-with-finishers",
  protectRoute,
  jsonParser,
  async (req, res) => {
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
      savedRace.finishers = raceFinishers;

      res.json(savedRace);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

// Post a racerFinisher to array for a specific race by name and date
router.post("/:name/:date_/racerFinishers", protectRoute, async (req, res) => {
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

/******************************
 * ROUTES TO GET RACE OBJECTS *
 ******************************/

//Get all finishers for a specific race by Race_ID
router.get("/:id/finishers", async (req, res) => {
  try {
    const race = await Race.findById(req.params.id).populate("finishers");
    if (!race) {
      return res.status(404).send("Race not found for /:id/finishers");
    }
    res.json(race.finishers);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//Get All races
router.get("/", protectRoute, async (req, res) => {
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

// Get races by name and year
router.get("/:name/:year_", async (req, res) => {
  try {
    const races = await Race.find({
      name: req.params.name,
      year_: req.params.year_,
    }).populate({
      path: "finishers",
      select: "position riderName -_id",
    });
    if (!races.length) {
      return res.status(404).send("Races not found");
    }
    res.json(races);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get all races with a specified name within a mandatory time frame
router.get("/:name/from/:startYear/to/:endYear", async (req, res) => {
  try {
    const races = await Race.find({
      name: req.params.name,
      year_: { $gte: req.params.startYear, $lte: req.params.endYear },
    }).populate({
      path: "finishers",
      select: "position riderName -_id",
    });

    if (races.length === 0) {
      return res.status(404).send("No races found");
    }

    res.json(races);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get a specific race by name, year and stage
router.get("/:name/:year_/:stage_", async (req, res) => {
  try {
    const race = await Race.findOne({
      name: req.params.name,
      year_: req.params.year_,
      stage_: req.params.stage_,
    }).populate({
      path: "finishers",
      select: "position riderName -_id",
    });
    if (!race) {
      return res.status(404).send("Race not found for /:name/:year_/:stage_");
    }
    res.json(race);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get EVERY race with a specified name BAD ROUTE TOO SLOW
//NEEDS ATTENTION
router.get("/:name", protectRoute, async (req, res) => {
  try {
    const races = await Race.find({ name: req.params.name }).populate({
      path: "finishers",
      select: "position riderName -_id",
    });
    if (races.length === 0) {
      return res.status(404).send("No races found");
    }
    res.json(races);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/*******************************
 * ROUTES TO RANK RACE OBJECTS *
 *******************************/

//Rank all instance of a race  by finisher speed
router.get("/:name/ranked-by-speed", async (req, res) => {
  try {
    const races = await Race.find({ name: req.params.name })
      .sort({ avg_speed_winner_: -1 })
      .select("-finishers");
    if (!races || races.length === 0) {
      return res.status(404).send("No races found for this name");
    }
    res.json(races);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Rank ALL races based on startlist quality score
router.get("/rank-by-startlist-quality", async (req, res) => {
  try {
    const races = await Race.find().sort({ startlist_quality_score_: -1 });
    res.json(races);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//Rank all instances of a RACE  by vert meters
router.get("/rank-by-vert-meters/:name", async (req, res) => {
  try {
    const races = await Race.find({ name: req.params.name }).sort({
      vert_meters_: -1,
    });
    res.json(races);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Rank races of a specific name based on startlist quality score
router.get("/rank-by-startlist-quality/:name", async (req, res) => {
  try {
    const races = await Race.find({ name: req.params.name }).sort({
      startlist_quality_score_: -1,
    });
    res.json(races);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Rank stages of a stage by vert_meters from most to least
router.get("/rank-by/vert_meters/:name/:year_/", async (req, res) => {
  try {
    const races = await Race.find({
      name: req.params.name,
      year_: req.params.year_,
      stage_: { $exists: true } // only include races that have a value for the stage_ field
    })
      .populate({
        path: "finishers",
        select: "position riderName -_id",
      })
      .sort({ vert_meters: -1 }); // sort by vert_meters in descending order
    if (!races.length) {
      return res.status(404).send("Races not found");
    }
    res.json(races);
  } catch (error) {
    res.status(500).send(error.message);
  }
});




/*****************
 * DELETE ROUTES *
 *****************/

// Delete a specific race by name and date
router.delete("/:name/:date_", protectRoute, async (req, res) => {
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

router.delete("/delete-all", protectRoute, async (req, res) => {
  try {
    await Race.deleteMany({});
    res.status(200).json({ message: "All data deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/racerfinishers", protectRoute, async (req, res) => {
  try {
    await RacerFinisher.deleteMany({});
    res
      .status(200)
      .json({ message: "All racer finishers deleted successfully." });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting racer finishers." });
  }
});

module.exports = router;
