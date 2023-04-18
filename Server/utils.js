const BicycleRacer = require("./DataBase/Models/bicycleRacer");
const RacerFinisher = require("./DataBase/Models/racerFinisherObject");

// Function to update the BicycleRacer model with the races and positions for each racer
/* export async function updateBicycleRacers() {
    try {
      // Find all racer finishers
      const racerFinishers = await RacerFinisher.find();
      
      // Group the racer finishers by riderName
      const racerFinishersByRider = {};
      for (const racerFinisher of racerFinishers) {
        if (!racerFinishersByRider[racerFinisher.riderName]) {
          racerFinishersByRider[racerFinisher.riderName] = [];
        }
        racerFinishersByRider[racerFinisher.riderName].push(racerFinisher);
      }
      
      // Update or create a BicycleRacer for each rider
      for (const [riderName, racerFinishers] of Object.entries(racerFinishersByRider)) {
        const bicycleRacer = await BicycleRacer.findOneAndUpdate(
          { riderName },
          {
            riderName,
            races: racerFinishers.map((racerFinisher) => {
              return {
                race: racerFinisher.race,
                position: racerFinisher.position
              };
            })
          },
          { upsert: true, new: true }
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  } */

  async function getAllRiderNames() {
    try {
      const racers = await BicycleRacer.find();
      return racers.map((racer) => {
        const nameParts = racer.riderName.split(' ');
        const lastName = nameParts.pop().replace(/\s/g, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const formattedName = `${nameParts.map((part) => part.toLowerCase()).join('-')}-${lastName.toLowerCase()}`;
        console.log(formattedName);
        return formattedName;
      });
    } catch (error) {
      console.log(error.message);
      return [];
    }
  }
  getAllRiderNames();