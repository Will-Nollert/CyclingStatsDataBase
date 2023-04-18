const axios = require("axios");
const cheerio = require("cheerio");

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

const url = 'https://www.procyclingstats.com/rider/dmitriy-gruzdev';

axios.get(url).then((response) => {
  const html = response.data;
  const $ = cheerio.load(html);
const riderRelativeStrengthInfo = $('.left.w50.mb_w100');
// Nationality
const nationality = riderRelativeStrengthInfo.find('b:contains("Nationality:")').next().next().text().trim();
// GC
const gcRawScore = $('div.bg.red').attr('style').match(/width:\s*(\d+(\.\d+)?)%/)[1];
//round to two decimal places
const gcRoundScore = parseFloat(gcRawScore).toFixed(2);
// Time Trial
const timeTrialRawScore = $('div.bg.blue').attr('style').match(/width:\s*(\d+(\.\d+)?)%/)[1];
const timeTrialRoundScore = parseFloat(timeTrialRawScore).toFixed(2);
// Sprint
const sprintRawScore = $('div.bg.orange').attr('style').match(/width:\s*(\d+(\.\d+)?)%/)[1];
const sprintRoundScore = parseFloat(sprintRawScore).toFixed(2);
// Climber
const climberRawScore = $('div.bg.purple').attr('style').match(/width:\s*(\d+(\.\d+)?)%/)[1];
const climberRoundScore = parseFloat(climberRawScore).toFixed(2);

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



// Log data fields
console.log('Date of birth:', dateOfBirth);
console.log('Nationality:', nationality);
console.log('Age:', age);
console.log('Weight:', weight, "kg");
console.log('Height:', height, "m");
console.log("GC:", gcRoundScore);
console.log("Time Trial:",  timeTrialRoundScore);
console.log("Sprint:",  sprintRoundScore);
console.log("Climber:", climberRoundScore);
  
}).catch((error) => {
  console.error(error);
});