var bodyParser = require("body-parser");
const express = require("express");
const router = express.Router();
const Race = require("../DataBase/Models/raceObject");
const RacerFinisher = require("../DataBase/Models/racerFinisherObject");

// create application/json parser
var jsonParser = bodyParser.json();



//Post a race object
router.post("/races", async (req, res) => {
  try {
    const race = new Race(req.body);
    const savedRace = await race.save();
    res.json(savedRace);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//Post a race object with race finishers array
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
    savedRace.finishers = raceFinishers;

    res.json(savedRace);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Post a racerFinisher to array for a specific race by name and date
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

// Get a specific race by name and date
router.get("/raceByName/:name/:date_", async (req, res) => {
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

// Get ALL races with a specified name
router.get("/races/:name", async (req, res) => {
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

// Get ALL races based on startlist quality score
router.get("/races/rank-by-startlist-quality", async (req, res) => {
  try {
    const races = await Race.find().sort({ startlist_quality_score_: -1 });
    res.json(races);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Rank races of a specific name based on startlist quality score
router.get("/races/rank-by-startlist-quality/:name", async (req, res) => {
  try {
    const races = await Race.find({ name: req.params.name }).sort({ startlist_quality_score_: -1 });
    res.json(races);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//Get all finishers for a specific race by Race_ID
router.get("/raceID/:id/finishers", async (req, res) => {
  try {
    const race = await raceObject.findById(req.params.id).populate("finishers");
    if (!race) {
      return res.status(404).send("Race not found");
    }
    res.json(race.finishers);
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

//Get all instances of a RACE ranked by vert meters
router.get("/races/rank-by-vert-meters/:name", async (req, res) => {
  try {
    const races = await Race.find({ name: req.params.name }).sort({ vert_meters_: -1 });
    res.json(races);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//Get all instance of a race ranked by finisher speed 
router.get("/races/:name/ranked-by-speed", async (req, res) => {
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



module.exports = router;
