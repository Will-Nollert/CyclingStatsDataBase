const axios = require("axios");
const cheerio = require("cheerio");

//import database modles 
const BicycleRacer = require('../DataBase/Models/bicycleRacer');


/* const scrapeRaceResults = (raceName, raceYear) => {
  const raceUrl = `https://www.procyclingstats.com/race/${raceName}/${raceYear}/results`;

axios
  .get(raceUrl)
  .then((response) => {
    const $ = cheerio.load(response.data);
    //Get the Race MetaData
    const infoList = $("ul.infolist");
    let race = {};
    infoList.find("li").each((index, element) => {
      const key = $(element)
        .find("div")
        .eq(0)
        .text()
        .trim()
        .replace(/[\s.:]+/g, "_")
        .toLowerCase();
      const value = $(element)
        .find("div")
        .eq(1)
        .text()
        .trim()
        .replace(/[\s.]+/g, "_");
      race[key] = value;
    });
    //Add a key value pair to the race object of raceName
    race = { name: raceName, ...race };
    //Get the finishers table data
    const table = $("table.results > tbody");
    const finishers = [];
    table.find("tr").each((index, element) => {
      const position = $(element).find("td").eq(0).text().trim();
      const riderName = $(element)
        .find("td")
        .eq(3)
        .find("a")
        .first()
        .text()
        .trim();
      const teamName = $(element)
        .find("td")
        .eq(3)
        .find(".showIfMobile")
        .text()
        .trim();

      finishers.push({ position, riderName, teamName });
    });
    // Make the POST request to your backend API endpoint
    fetch("http://localhost:3000/races-with-finishers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ race, finishers }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(`Added ${raceName} ${raceYear} to the database`);
        if (raceYear > 1950) {
          // Call the function recursively with a lower raceYear
          scrapeRaceResults(raceName, raceYear - 1);
        }
      })
      .catch((error) => {
        console.log(`Error: ${error.message}`);
      });
    
  })
  .catch((error) => {
    console.log(error);
  });
};

// Call the function with the initial raceName and raceYear
scrapeRaceResults("e3-harelbeke", "2023"); */

async function getAllRiderNames() {
  try {
    const response = await fetch('https://cycling-databse.herokuapp.com/api/bicycle-racers');
    const data = await response.json();
    const riderNames = data.map((rider) => rider.riderName);
    return riderNames;
  } catch (error) {
    console.log(error.message);
    return [];
  }
}


async function updateRiderMetaData(){
  const riderNames = await getAllRiderNames();
  for (const riderName of riderNames) {
    const url = `https://www.procyclingstats.com/rider/${riderName}`;
    try {
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);
      const riderRelativeStrengthInfo = $('.left.w50.mb_w100');
      
      // Extract key-value pairs
      const nationality = riderRelativeStrengthInfo.find('b:contains("Nationality:")').next().next().text().trim();
      const gcRawScore = $('div.bg.red').attr('style').match(/width:\s*(\d+(\.\d+)?)%/)[1];
      const gcRoundScore = gcRawScore ? parseFloat(gcRawScore).toFixed(2) : null;
      const timeTrialRawScore = $('div.bg.blue').attr('style').match(/width:\s*(\d+(\.\d+)?)%/)[1];
      const timeTrialRoundScore = timeTrialRawScore ? parseFloat(timeTrialRawScore).toFixed(2) : null;
      const sprintRawScore = $('div.bg.orange').attr('style').match(/width:\s*(\d+(\.\d+)?)%/)[1];
      const sprintRoundScore = sprintRawScore ? parseFloat(sprintRawScore).toFixed(2) : null;
      const climberRawScore = $('div.bg.purple').attr('style').match(/width:\s*(\d+(\.\d+)?)%/)[1];
      const climberRoundScore =  climberRawScore ? parseFloat(climberRawScore).toFixed(2) : null;
      
      const riderInfo = $('.left.w50.mb_w100').text().trim();
      const dateOfBirthRegex = /Date of birth:\s*([\d]+(?:th|st|nd|rd)\s+\w+\s+\d{4})/;
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

      // Update the database
      const rider = await BicycleRacer.findOne({ name: riderName });
      if (rider) {
        rider.nationality = nationality;
        rider.gc = gcRoundScore;
        rider.timeTrial = timeTrialRoundScore;
        rider.sprint = sprintRoundScore;
        rider.climber = climberRoundScore;
        rider.dateOfBirth = dateOfBirth;
        rider.weight = weight;
        rider.height = height;
        rider.age = age;
        await rider.save();
        console.log(`Updated ${riderName} in database.`);
      } else {
        console.error(`Rider with name ${riderName} not found in database.`);
      }
    } catch (error) {
      console.error(error);
      continue; // continue to next iteration of loop
    }
  }
}


updateRiderMetaData()