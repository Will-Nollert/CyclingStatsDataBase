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
        name: "Boston Marathon",
        location: "Boston, MA",
        date: "04/18/2022",
      },
      {
        name: "New York City Marathon",
        location: "New York, NY",
        date: "11/06/2022",
      },
    ]);

    const racers = await RacerFinisher.create([
      {
        name: "John Doe",
        race: races[0]._id,
        finishPlace: 1,
      },
      {
        name: "Jane Doe",
        race: races[0]._id,
        finishPlace: 2,
      },
      {
        name: "Bob Smith",
        race: races[1]._id,
        finishPlace: 3,
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
