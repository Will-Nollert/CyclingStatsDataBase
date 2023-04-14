const axios = require("axios");
const cheerio = require("cheerio");
let raceName = "paris-roubaix";
let raceYear = "2018";
const raceUrl =
  "https://www.procyclingstats.com/race/" +
  raceName +
  "/" +
  raceYear +
  "/results";

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
      body: JSON.stringify({race, finishers }),
    }) 
      .then((response) => response.json())
      .then((data) => {
        console.log("Added " + raceName + " " + raceYear + " to the database" );
      })
      .catch((error) => {
        console.error("Error:", error);
      }); 
  
  })
  .catch((error) => {
    console.log(error);
  });
