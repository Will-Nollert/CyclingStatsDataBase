const BicycleRacer = require("./DataBase/Models/bicycleRacer");
const RacerFinisher = require("./DataBase/Models/racerFinisherObject");



// Function to update the BicycleRacer model with the races and positions for each racer
async function updateBicycleRacers() {
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
    for (const [riderName, racerFinishers] of Object.entries(
      racerFinishersByRider
    )) {
      const bicycleRacer = await BicycleRacer.findOneAndUpdate(
        { riderName },
        {
          riderName,
          races: racerFinishers.map((racerFinisher) => {
            return {
              race: racerFinisher.race,
              position: racerFinisher.position,
            };
          }),
        },
        { upsert: true, new: true }
      );
    }
  } catch (error) {
    console.log(error.message);
  }
}
//used the change rider name formated after scraping the data
async function updateRiderNames() {
  try {
    const racers = await BicycleRacer.find();

    for (const racer of racers) {
      const nameParts = racer.riderName.split(" ");
      const lastName = nameParts
        .pop()
        .replace(/\s/g, "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const formattedName = `${lastName.toLowerCase()}-${nameParts
        .map((part) => part.toLowerCase())
        .join("-")}`;
      const testName = formattedName.slice(0, -2);

      try {
        await BicycleRacer.updateOne(
          { _id: racer._id },
          { $set: { riderName: testName } }
        );
        console.log(`Updated rider name for ${racer.riderName} to ${testName}`);
      } catch (error) {
        if (error.code === 11000) {
          console.log(
            `Duplicate key error for riderName: ${racer.testName}. Skipping...`
          );
        } else {
          console.log(error.message);
        }
      }
    }

    console.log("Finished updating rider names");
  } catch (error) {
    console.log(error.message);
  }
}
//used to purge fields from DB if i chnage the schema
async function removeSuperfluousFields() {
  try {
    const result = await BicycleRacer.updateMany(
      {},
      { $unset: { gc: "", timeTrial: "", sprint: "", climber: "" } }
    );
    console.log(`${result.nModified} documents updated`);
    console.log("Superfluous fields removed successfully");
  } catch (error) {
    console.error("Error removing superfluous fields:", error);
  }
}
//used to add DOB height and weight nationalities and relative strength for each rider to the DB
async function updateRiderMetaData() {
  const riderNames = await getAllRiderNames();
  for (const riderName of riderNames) {
    const url = `https://www.procyclingstats.com/rider/${riderName}`;
    try {
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);
      const riderRelativeStrengthInfo = $(".left.w50.mb_w100");
      // Nationality
      const nationality = riderRelativeStrengthInfo
        .find('b:contains("Nationality:")')
        .next()
        .next()
        .text()
        .trim();
      // GC
      const gcRawScore = $("div.bg.red")
        .attr("style")
        .match(/width:\s*(\d+(\.\d+)?)%/)[1];
      //round to two decimal places
      const gcRoundScore = parseFloat(gcRawScore).toFixed(2);
      // Time Trial
      const timeTrialRawScore = $("div.bg.blue")
        .attr("style")
        .match(/width:\s*(\d+(\.\d+)?)%/)[1];
      const timeTrialRoundScore = parseFloat(timeTrialRawScore).toFixed(2);
      // Sprint
      const sprintRawScore = $("div.bg.orange")
        .attr("style")
        .match(/width:\s*(\d+(\.\d+)?)%/)[1];
      // One day races
      const oneDayRawScore = $("div.bg.green")
        .attr("style")
        .match(/width:\s*(\d+(\.\d+)?)%/)[1];
      const oneDayRoundScore = parseFloat(oneDayRawScore).toFixed(2);

      const sprintRoundScore = parseFloat(sprintRawScore).toFixed(2);
      // Climber
      const climberRawScore = $("div.bg.purple")
        .attr("style")
        .match(/width:\s*(\d+(\.\d+)?)%/)[1];
      const climberRoundScore = parseFloat(climberRawScore).toFixed(2);

      const riderInfo = $(".left.w50.mb_w100").text().trim();
      const dateOfBirthRegex =
        /Date of birth:\s*([\d]+(?:th|st|nd|rd)\s+\w+\s+\d{4})/;
      const weightRegex = /Weight:\s*([\d.]+)\s*kg/;
      const heightRegex = /Height:\s*([\d.]+)\s*m/;
      const ageRegex = /\((\d+)\)/;

      const dateOfBirthMatch = riderInfo.match(dateOfBirthRegex);
      const weightMatch = riderInfo.match(weightRegex);
      const heightMatch = riderInfo.match(heightRegex);
      const ageMatch = riderInfo.match(ageRegex);

      const dateOfBirth = dateOfBirthMatch ? dateOfBirthMatch[1] : null;
      const weight = weightMatch ? weightMatch[1] : null;
      const height = heightMatch ? heightMatch[1] : null;
      const age = ageMatch ? ageMatch[1] : null;

      // Log data fields
      console.log("Rider name:", riderName);
      console.log("Date of birth:", dateOfBirth);
      console.log("Nationality:", nationality);
      console.log("Age:", age);
      console.log("Weight:", weight, "kg");
      console.log("Height:", height, "m");
      console.log("GC:", gcRoundScore, typeof gcRoundScore);
      console.log("One Day:", oneDayRoundScore, typeof oneDayRoundScore);
      console.log("Time Trial:", timeTrialRoundScore, typeof timeTrialRoundScore);
      console.log("Sprint:", sprintRoundScore, typeof sprintRoundScore);
      console.log("Climber:", climberRoundScore, typeof climberRoundScore);
      console.log("--------------------")

      // Update the rider with the new metadata
      const filter = { riderName: riderName };
      const update = {
        dateOfBirth,
        nationality,
        age,
        weight,
        height,
        relativeStrength: [
          {type: 'gc', score: gcRoundScore},
          {type: 'timeTrial', score: timeTrialRoundScore},
          {type: 'sprint', score: sprintRoundScore},
          {type: 'climber', score: climberRoundScore},
          {type: 'oneDay', score: oneDayRoundScore} // add this line if needed
        ]
      };
      const options = { upsert: true };
      await BicycleRacer.findOneAndUpdate(filter, update, options);
    } catch (error) {
      console.error(
        `Error updating metadata for rider ${riderName}: ${error.message}`
      );
    }
  }
} 
//used to get all rider names from the DB helpful utlity function
async function getAllRiderNames() {
  try {
    const response = await fetch(
      "https://cycling-databse.herokuapp.com/api/bicycle-racers"
    );
    const data = await response.json();
    const riderNames = data.map((rider) => rider.riderName);
    return riderNames;
  } catch (error) {
    console.log(error.message);
    return [];
  }
}
//used to add a date_ field to the raceObject document in the DB
async function updateRacesWithYear() {

  try {
    const races = await Race.find({});

    races.forEach(async (race) => {
      const dateParts = race.date_.split('_');
      const year = dateParts[2];

      const updatedRace = await Race.findByIdAndUpdate(
        race._id,
        { $set: { year_: year } },
        { new: true }
      );

      console.log(`Race ${updatedRace._id} updated successfully`);
    });
  } catch (err) {
    console.error(err);
  }
}
//used to update DB fields after i delte half of the names 
async function updateRiderFinishers() {
  try {
    const riderNames = await getAllRiderNames();
    const riderFinishers = await RacerFinisher.find();

    for (const finisher of riderFinishers) {
      const oldName = finisher.riderName;
      console.log("OLD NAME =", oldName.replace(/-/g, "").toLowerCase())
      console.log("NEW NAME =", riderNames[3].slice(0, -3).replace(/-/g, "").toLowerCase())

      let newName = riderNames.find(
        (name) =>
          name.slice(0, -3).replace(/-/g, "").toLowerCase() === oldName.replace(/-/g, "").toLocaleLowerCase() ||
          name.toLowerCase() === oldName.toLowerCase().split(" ").reverse().join(" ") 
      );
      if (newName) {
        finisher.riderName = newName;
        await finisher.save();
        console.log(`Updated rider name from ${oldName} to ${newName}`);
      } else {
        console.log(`No matching name found for ${oldName.replace(/-/g, "").toLowerCase()}`);
      }
    }

    console.log("Finished updating rider finishers");
  } catch (error) {
    console.log(error.message);
  }
}
//used to check name format
async function logRiderNames() {
  try {
    const racerFinishers = await riderFinishers.find();
    const riderNames = racerFinishers.map((finisher) => finisher.riderName);
    console.log(riderNames.slice((-1000)));
  } catch (error) {
    console.log(error.message);
  }
}

//util function to purge old DB of incorrect names
async function deleteRacerFinishersWithCapitalLetters() {
  try {
    const racerFinishers = await RacerFinisher.find();

    for (const finisher of racerFinishers) {
      const riderName = finisher.riderName;
      if (riderName.match(/[A-Z]/)) {
        await finisher.delete();
        console.log(`Deleted racerFinisher document with riderName ${riderName}`);
      }
    }

    console.log("Finished deleting racerFinisher documents with capital letters");
  } catch (error) {
    console.log(error.message);
  }
}

