const raceRouteURLBase = "https://cycling-databse.herokuapp.com/api/races";
const bicycleRacerRouteURLBase = "https://cycling-databse.herokuapp.com/api/bicycle-racers";

function getAllBicycleRaces() {
  fetch(raceRouteURLBase)
    .then((response) => response.json())
    .then((data) => {
      const allBicycleRacers = document.getElementById("allBicycleRacers");
      for (let race of data) {
        const racerCard = document.createElement("div");
        racerCard.className = "race-card";
        const name = document.createElement("h3");
        name.innerText = race.name;
        racerCard.appendChild(name);
        const date = document.createElement("p");
        date.innerText = "Date: " + race.date_;
        racerCard.appendChild(date);
        const avg_speed_winner_ = document.createElement("p");
        avg_speed_winner_.innerText = "Winner Avg Speed: " + race.avg_speed_winner_;
        racerCard.appendChild(avg_speed_winner_);
        allBicycleRacers.appendChild(racerCard);
      }
    });
}
function getRacesByName() {
  const raceName = document.getElementById("raceName").value;
  fetch(`${raceRouteURLBase}/${raceName}`)
    .then((response) => response.json())
    .then((data) => {
      const racesList = document.getElementById("racesList");
      racesList.innerHTML = ""; // clear previous results
      const races = data.slice(0, 10); // get first 10 races
      for (let race of races) {
        // create a new card for each race
        const card = document.createElement("div");
        card.classList.add("card");

        // create a new card body
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        // add race name and date to card
        const raceName = document.createElement("h5");
        raceName.classList.add("card-title");
        raceName.textContent = race.name + " - " + race.date_;
        cardBody.appendChild(raceName);

        // add finishers to card
        const finishersList = document.createElement("ul");
        finishersList.classList.add("list-group", "list-group-flush");
        for (let finisher of race.finishers) {
          const finisherItem = document.createElement("li");
          finisherItem.classList.add("list-group-item");
          finisherItem.textContent = `${finisher.position}. ${finisher.riderName}`;
          finishersList.appendChild(finisherItem);
        }
        cardBody.appendChild(finishersList);

        // add card body to card
        card.appendChild(cardBody);

        // add card to races list
        racesList.appendChild(card);
      }
    })
    .catch((error) => console.error(error));
}

function getBicycleRacerRaceHistory() {
  let riderName = document.getElementById("riderNameHistory").value;
  riderName = capitalizeRiderName(riderName);
  fetch(`${bicycleRacerRouteURLBase}/${riderName}/history`)
    .then((response) => response.json())
    .then((data) => {
      const bicycleRacerRaceHistory = document.getElementById(
        "bicycleRacerRaceHistory"
      );
      bicycleRacerRaceHistory.innerHTML = "";
      data.forEach((race) => {
        const card = document.createElement("div");
        card.classList.add("card");
        const raceName = document.createElement("h3");
        raceName.innerText = race.raceName;
        const raceDate = document.createElement("p");
        raceDate.innerText = race.date;
        const raceResult = document.createElement("p");
        raceResult.innerText = race.position;
        card.appendChild(raceName);
        card.appendChild(raceDate);
        card.appendChild(raceResult);
        bicycleRacerRaceHistory.appendChild(card);
      });
    });
}
function getRankedBicycleRacerRaceHistory() {
  let riderName = document.getElementById("riderNameRankedHistory").value;
riderName = capitalizeRiderName(riderName);
  fetch(`${bicycleRacerRouteURLBase}/${riderName}/rankedHistory`)
    .then((response) => response.json())
    .then((data) => {
      const rankedBicycleRacerRaceHistory = document.getElementById(
        "rankedBicycleRacerRaceHistory"
      );
      rankedBicycleRacerRaceHistory.innerHTML = "";
      data.forEach((race) => {
        const card = document.createElement("div");
        card.classList.add("card");
        const raceName = document.createElement("h3");
        raceName.innerText = race.raceName;
        const raceDate = document.createElement("p");
        raceDate.innerText = race.raceDate;
        const raceResult = document.createElement("p");
        raceResult.innerText = race.position;
        card.appendChild(raceName);
        card.appendChild(raceDate);
        card.appendChild(raceResult);
        rankedBicycleRacerRaceHistory.appendChild(card);
      });
    });
}

function getRaceByNameAndDate() {
  const name = document.getElementById("raceName").value;
  const date_ = document.getElementById("raceDate").value;
  fetch(`${raceRouteURLBase}/${name}/${date_}`)
    .then((response) => response.json())
    .then((data) => {
      const raceCard = document.createElement("div");
      raceCard.classList.add("card");
      raceCard.innerHTML = `
        <h2>${data.name} - ${data.date_}</h2>
        <p>Won How: ${data.won_how_}</p>
        <p>Distance: ${data.distance_} miles</p>
        <p>Finishers:</p>
        <ul>
          ${data.finishers.map((finisher) => `<li>${finisher.riderName} - ${finisher.position}</li>`).join("")}
        </ul>
      `;
      const racesContainer = document.getElementById("racesContainer");
      racesContainer.appendChild(raceCard);
    })
    .catch((error) => console.log(error));
}

/*********************
 * UTILITY FUNCTIONS *
 *********************/
function capitalizeRiderName(riderName) {
  // Split the rider name into an array of words
  const words = riderName.split(' ');

  // Capitalize each word (except the last one)
  for (let i = 0; i < words.length - 1; i++) {
    words[i] = words[i].toUpperCase();
  }

  // Join the capitalized words back together with spaces
  const capitalizedWords = words.join(' ');

  // Return the result
  return capitalizedWords;
}


function toggleExample(codeBlock) {
  codeBlock.classList.toggle("hidden");
}