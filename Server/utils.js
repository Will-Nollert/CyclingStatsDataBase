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
      console.log("GC:", gcRoundScore);
      console.log("Time Trial:", timeTrialRoundScore);
      console.log("Sprint:", sprintRoundScore);
      console.log("Climber:", climberRoundScore);
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
          gcRoundScore,
          timeTrialRoundScore,
          sprintRoundScore,
          climberRoundScore
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


