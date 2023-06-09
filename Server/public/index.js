const axios = require("axios");
const cheerio = require("cheerio");

const scrapeRaceResults = (raceName, raceYear, stage) => {
  const raceUrl =  `https://www.procyclingstats.com/race/${raceName}/${raceYear}/stage-${stage}`; 
  axios.get(raceUrl).then((response) => {
    const $ = cheerio.load(response.data);
    //Get the Race MetaData
    const infoList = $("ul.infolist");
    //create an object to hold the race data and add the raceFinishers array
    let race = {};
    //get the race date from the infolist
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
    race = { name: raceName, stage_: stage, ...race };
    //Get the race finishers  data
    const table = $("table.results > tbody");
    //create an array to hold the finishers
    let finishers = [];
    //Scrape Data from the table
    table.find("tr").each((index, element) => {
      const position = $(element).find("td").eq(0).text().trim();
      //get Rider Name for 1 day classics
      /* const riderName = $(element)
          .find("td")
          .eq(3)
          .find("a")
          .first()
          .text()
          .trim(); */
      //get Rider Name for Grand Tours
      const riderName = $(element).find('a[href^="rider/"]').text().trim();
      const teamName = $(element).find('a[href^="team/"]').text().trim();
      /* const teamName = $(element)
          .find("td")
          .eq(3)
          .find(".showIfMobile")
          .text()
          .trim(); */
      const nameParts = riderName.split(" ");
      const lastName = nameParts
        .pop()
        .replace(/\s/g, "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const formattedName = `${lastName.toLowerCase()}-${nameParts
        .map((part) => part.toLowerCase())
        .join("-")}`;
      //Add the finisher to the finishers array
      finishers.push({ position, riderName: formattedName, teamName });
    });
    const uniqueFinishers =  removeDuplicates(finishers);
    finishers = uniqueFinishers;
    //console.log(`Added ${raceName} ${raceYear} stage-${stage} to the database`);
    

    // Make the POST request to your backend API endpoint
    
       fetch("http://localhost:3000/api/races/races-with-finishers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ race, finishers }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Network response was not ok: ${response.statusText} Failed to add ${raceName} ${raceYear} to the database`
            );
          }
          return response.json();
        }).catch((error) => {
          console.log(error);
        }) 
        .then((data) => {
          console.log(`Added ${raceName} ${raceYear} stage-${stage} to the database`);
               if (stage >= 2) {
      // Call the function recursively with a lower raceYear
      scrapeRaceResults(raceName, raceYear, stage - 1);
    }
    if (stage === 1 && raceYear > 1950) {
      // Call the function recursively with a lower raceYear
      scrapeRaceResults(raceName, raceYear - 1, 21);
    }   
        })  
  });
};

//util function to help parse HTLM for stage races
//finishes table is not the same as 1 day classics
//and this was late and super hacky <3
 function removeDuplicates(finishers) {
  const uniqueFinishers = [];

  finishers.forEach((finisher) => {
    let isDuplicate = false;
    for (let i = 0; i < uniqueFinishers.length; i++) {
      if (uniqueFinishers[i].riderName === finisher.riderName) {
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate && /[a-zA-Z]/.test(finisher.riderName)) {
      uniqueFinishers.push(finisher);
    }
  });

  return uniqueFinishers;
}



//define an array of races names
const oneDayClassicRaces = [
  "e3-harelbeke",
  "paris-roubaix",
  "strade-bianche-donne",
  "milano-sanremo",
  "gent-wevelgem",
  "ronde-van-vlaanderen",
  "amstel-gold-race",
  "la-fleche-wallone",
  "liege-bastogne-liege",
  "san-sebastian",
  "paris-tours",
  "giro-dell-emilia",
  "omloop-het-nieuwsblad",
  "gp-d-ouverture",
  "trofeo-laigueglia",
  "trofeo-andratx-mirador-d-es-colomer",
  "il-lombardia",
  "milano-torino",
];

const grandTours = ["tour-de-france", "giro-d-italia", "vuelta-a-espana"];

//Call the function with the initial raceName and raceYear
   grandTours.forEach((raceName) => {
  scrapeRaceResults(raceName, 2022, 21);
});  

 
