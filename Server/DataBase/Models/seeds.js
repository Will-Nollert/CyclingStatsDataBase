const mongoose = require("mongoose");
const Race = require("./raceObject");
const RacerFinisher = require("./racerFinisherObject");

const seedData = async () => {
  try {
    // First, clear out any existing data
    await Race.deleteMany({isSeedData: true});
    await RacerFinisher.deleteMany({isSeedData: true});

    // Add some seed data for races and racers
    const races = await Race.create([
      {
        name: 'Paris-Roubaix',
        location: 'France',
        date: '08 April 2018',
        start_time: '11:20',
        avg_speed_winner: '43.55 km/h',
        race_category: 'ME - Men Elite',
        distance: '257 km',
        points_scale: '1.WT.A',
        uci_scale: 'UCI.WR.C1',
        parcours_type: '',
        profilescore: '4',
        vert_meters: '1309',
        departure: 'Compiègne',
        arrival: 'Roubaix',
        race_ranking: '0',
        startlist_quality_score: '811',
        won_how: 'Sprint à deux',
        avg_temperature: '',
        isSeedData: true,
      },
      {
        name: "Giro d'Italia",
        location: "Italy",
        date: "May 8, 2022",
        start_time: "10:00",
        avg_speed_winner: "39.7 km/h",
        race_category: "ME - Men Elite",
        distance: "3422 km",
        points_scale: "2.WT.A",
        uci_scale: "UCI.WR.C2",
        parcours_type: "Mountainous",
        profilescore: "9",
        vert_meters: "44550",
        departure: "Turin",
        arrival: "Milan",
        race_ranking: "2",
        startlist_quality_score: "942",
        won_how: "Solo breakaway",
        avg_temperature: "15°C",
        isSeedData: true,
      },
    ]);

    const racers = await RacerFinisher.create([
      {
        name: "Tadej Pogacar",
        race: races[0]._id,
        finishPlace: 1,
        teamName: "Bora-Hansgrohe",
        isSeedData: true,
      },
      {
        name: "Peter Sagan",
        race: races[0]._id,
        finishPlace: 2,
        teamName: "UAE-Team Emirates",
        isSeedData: true,
      },
      {
        name: "Egan Bernal",
        race: races[1]._id,
        finishPlace: 3,
        teamName: "Movistar Team",
        isSeedData: true,
      },
    ]);

    // Update the raceFinishers field for each race
    for (let i = 0; i < racers.length; i++) {
      const raceId = racers[i].race;
      await Race.findOneAndUpdate(
        { _id: raceId },
        { $push: { raceFinishers: racers[i]._id } }
      );
    }

    console.log("Seed data created successfully!");
  } catch (error) {
    console.log("Error creating seed data:", error.message);
  }
};

module.exports = seedData;
