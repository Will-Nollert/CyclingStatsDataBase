const mongoose = require("mongoose");
const Race = require("./raceObject");
const RacerFinisher = require("./racerFinisherObject");

const seedData = async () => {
  try {
    // First, clear out any existing data
    await Race.deleteMany({});
    await RacerFinisher.deleteMany({});

    // Add some seed data for races and racers
    const races = await Race.create([
      {
        name: "Test-Race1",
        date_: "08 April 2018",
        start_time_: "11:20",
        avg_speed_winner_: "43.55 km/h",
        race_category_: "ME - Men Elite",
        distance_: "257 km",
        points_scale_: "1.WT.A",
        uci_scale_: "UCI.WR.C1",
        parcours_type_: "",
        profilescore_: "4",
        vert_meters_: "1309",
        departure_: "Compiègne",
        arrival_: "Roubaix",
        race_ranking_: "0",
        startlist_quality_score_: "811",
        won_how_: "Sprint à deux",
        avg_temperature_: "",
      },
      {
        name: "Test-Race2",
        date_: "May 8, 2022",
        start_time_: "10:00",
        avg_speed_winner_: "39.7 km/h",
        race_category_: "ME - Men Elite",
        distance_: "3422 km",
        points_scale_: "2.WT.A",
        uci_scale_: "UCI.WR.C2",
        parcours_type_: "Mountainous",
        profilescore_: "9",
        vert_meters_: "44550",
        departure_: "Turin",
        arrival_: "Milan",
        race_ranking_: "2",
        startlist_quality_score_: "942",
        won_how_: "Solo breakaway",
        avg_temperature_: "15°C",
      },
    ]);

    const racers = await RacerFinisher.create([
      {
        position: 1,
        riderName: "Test-Rider1",
        race: races[0]._id,
        teamName: "Test-Team1",
      },
      {
        position: 2,
        riderName: "Test-Rider2",
        race: races[0]._id,
        teamName: "Test-Team2",
      },
      {
        position: 3,
        riderName: "Test-Rider3",
        race: races[1]._id,
        teamName: "Test-Team3",
      },
    ]);

    // Update the finishers field for each race
    for (let i = 0; i < racers.length; i++) {
      const raceId = racers[i].race;
      await Race.findOneAndUpdate(
        { _id: raceId },
        { $push: { finishers: racers[i]._id } }
      );
    }

    console.log("Seed data created successfully!");
  } catch (error) {
    console.log("Error creating seed data:", error.message);
  }
};

module.exports = seedData;
