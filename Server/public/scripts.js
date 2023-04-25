let raceRouteURLBase = "https://cycling-databse.herokuapp.com/api/races";
let bicycleRacerRouteURLBase =
  "https://cycling-databse.herokuapp.com/api/bicycle-racers";

function getBicycleRacer() {
  const riderName = document
    .getElementById("riderName")
    .value.toLowerCase()
    .replace(/\s+/g, "-");
  const bicycleRacer = document.getElementById("bicycleRacer");
  bicycleRacer.innerHTML = "";

  fetch(`${bicycleRacerRouteURLBase}/${riderName}/info`)
    .then((response) => response.json())
    .then((data) => {
      const name = document.createElement("h3");
      name.innerText = data.riderName;
      const age = document.createElement("p");
      age.innerText = `Age: ${data.age}`;
      const nationality = document.createElement("p");
      nationality.innerText = `Nationality: ${data.nationality}`;
      const weight = document.createElement("p");
      weight.innerText = `Weight: ${data.weight} kg`;
      const height = document.createElement("p");
      height.innerText = `Height: ${data.height} m`;
      const relativeStrength = document.createElement("p");
      relativeStrength.innerText = "Relative Strength: ";
      const relativeStrengthList = document.createElement("ul");
      let riderRelativetrengthValues = data.relativeStrength;
      const strengthValues = {};
      // Loop through each object in the array
      for (const obj of riderRelativetrengthValues) {
        // Extract the type and score properties
        const { type, score } = obj;
        // Add the type and score to the strengthValues object
        strengthValues[type] = score;
      }
      // Convert the strengthValues object to a formatted string
      const strengthString = Object.entries(strengthValues)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n");

      // Display the formatted string in the DOM
      relativeStrengthList.innerText = strengthString;
      relativeStrength.appendChild(relativeStrengthList);
      bicycleRacer.appendChild(name);
      bicycleRacer.appendChild(age);
      bicycleRacer.appendChild(nationality);
      bicycleRacer.appendChild(weight);
      bicycleRacer.appendChild(height);
      bicycleRacer.appendChild(relativeStrength);
    })
    .catch((error) => {
      console.error("Error fetching bicycle racer: ", error);
      const errorMessage =(`Rider ${riderName} was not found`)
      showModal(errorMessage);
      
 
    });
}

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
        avg_speed_winner_.innerText =
          "Winner Avg Speed: " + race.avg_speed_winner_;
        racerCard.appendChild(avg_speed_winner_);
        allBicycleRacers.appendChild(racerCard);
      }
    });
}
function getRacesByName() {
  const raceName = document.getElementById("raceName").value.toLowerCase().replace(/\s+/g, "-");
  const startYear = document.getElementById("startYear").value;
  const endYear = document.getElementById("endYear").value;

  fetch(`${raceRouteURLBase}/${raceName}/from/${startYear}/to/${endYear}`)
    .then((response) => response.json())
    .then((data) => {
      const racesList = document.getElementById("racesList");
      racesList.innerHTML = ""; // clear previous results
      const races = data
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
    const errorMessage = "An error occurred while fetching the racer's race history.";
    showModal(errorMessage);
    
}


function getBicycleRacerRaceHistory() {
  try {
    let riderName = document.getElementById("riderNameHistory").value;
    riderName = riderName.toLowerCase().replace(/\s+/g, "-");
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
      })
      .catch((error) => {
        const errorMessage = "An error occurred while fetching the racer's race history.";
        showModal(errorMessage);
        console.error(error);
      });
  } catch (error) {
    const errorMessage = "An error occurred while processing the request.";
    showModal(errorMessage);
    console.error(error);
  }
}


function getRankedBicycleRacerRaceHistory() {
  let riderName = document.getElementById("riderNameRankedHistory").value;
  riderName = riderName.toLowerCase().replace(/\s+/g, "-");
  fetch(`${bicycleRacerRouteURLBase}/${riderName}/rankedHistory`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
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
    })
    .catch((error) => {
      const errorMessage = "An error occurred while processing the request.";
      showModal(errorMessage);
      console.error(error);
    });
}


function getRaceByNameYearAndStage() {
  const raceName = document.getElementById("raceName2").value.toLowerCase().replace(/\s+/g, "-");
  const year = document.getElementById("raceYear").value;
  const stage = document.getElementById("raceStage").value;
  fetch(`${raceRouteURLBase}/${raceName}/${year}/${stage}`)
    .then((response) => response.json())
    .then((data) => {

      const raceCard = document.createElement("div");
      raceCard.classList.add("card");
      raceCard.innerHTML = `
        <h2>${data.name} - ${data.date_} - Stage ${data.stage_}</h2>
        <p>Won How: ${data.won_how_}</p>
        <p>Distance: ${data.distance_} miles</p>
        <p>Finishers:</p>
        <ul>
          ${data.finishers
            .map(
              (finisher) =>
                `<li>${finisher.riderName} - ${finisher.position}</li>`
            )
            .join("")}
        </ul>
      `;
      const racesContainer = document.getElementById("racesContainer");
      racesContainer.appendChild(raceCard);
    })
    .catch((error) => console.log(error));
    const errorMessage = "An error occurred while processing the request.";
    showModal(errorMessage);
}

async function rankRacesByVertMeters() {
  try {
    const name = document.getElementById("nameInput").value.toLowerCase().replace(/\s+/g, "-");
    const startYear = document.getElementById("startYearInput").value;
    const endYear = document.getElementById("endYearInput").value;


    const response = await fetch(`${raceRouteURLBase}/${name}/from/${startYear}/to/${endYear}/rank-by/vert-meters`);
    const races = await response.json();

    if (response.ok) {
      const raceList = document.createElement("ul");

      races.forEach((race) => {
        const raceItem = document.createElement("li");
        raceItem.textContent = `${race.name} (${race.year_}): ${race.vert_meters_} vert meters`;
        raceList.appendChild(raceItem);
      });

      const racesRankedByVertMeters = document.getElementById("racesRankedByVertMeters");
      racesRankedByVertMeters.innerHTML = "";
      racesRankedByVertMeters.appendChild(raceList);
    } else {
      const errorMessage = "An error occurred while processing the request.";
      showModal(errorMessage);
    }
  } catch (error) {
    const errorMessage = "An error occurred while processing the request.";
    showModal(errorMessage);
    console.error(error);
  }
}





function racesRankedBySpeed() {
  const name = document.getElementById("raceName7").value.toLowerCase().replace(/\s+/g, "-");
  const startYear = document.getElementById("startYearFinSpeed").value;
  const endYear = document.getElementById("endYearFinSpeed").value;
  fetch(`${raceRouteURLBase}/${name}/from/${startYear}/to/${endYear}/rank-by/winner-speed`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((races) => {
      const racesRankedBySpeedDiv = document.getElementById("racesRankedBySpeed");
      racesRankedBySpeedDiv.innerHTML = `<h3>Races Ranked by Winner Speed (${startYear} - ${endYear})</h3>`;
      if (races.length === 0) {
        racesRankedBySpeedDiv.innerHTML += "<p>No races found for this name and time period</p>";
        return;
      }
      const table = document.createElement("table");
      table.innerHTML = `
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Winner Avg Speed</th>
          </tr>
        </thead>
      `;
      const tbody = document.createElement("tbody");
      races.forEach((race) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${race.name}</td>
          <td>${race.date_}</td>
          <td>${race.avg_speed_winner_}</td>
        `;
        tbody.appendChild(row);
      });
      table.appendChild(tbody);
      racesRankedBySpeedDiv.appendChild(table);
    })
    .catch((error) => {
      const errorMessage = "An error occurred while processing the request.";
      showModal(errorMessage);
      console.error(error);
    });
}



/*********************
 * UTILITY FUNCTIONS *
 *********************/
function capitalizeRiderName(riderName) {
  // Split the rider name into an array of words
  const words = riderName.split(" ");

  // Capitalize each word (except the last one)
  for (let i = 0; i < words.length - 1; i++) {
    words[i] = words[i].toUpperCase();
  }

  // Join the capitalized words back together with spaces
  const capitalizedWords = words.join(" ");

  // Return the result
  return capitalizedWords;
}

function toggleExample(codeBlock) {
  codeBlock.classList.toggle("hidden");
}
function deleteCard(divId) {
  const div = document.getElementById(divId);
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
}
// Add click event listeners to all dropdown buttons
function toggleElementVisibility(elementId) {
  var element = document.getElementById(elementId);
  if (element.style.display === "none") {
    element.style.display = "block";
  } else {
    element.style.display = "none";
  }
}
//error handling modal
function showModal(message) {
  // Create the modal overlay
  const modalOverlay = document.createElement("div");
  modalOverlay.classList.add("modal-overlay");

  // Create the modal
  const modal = document.createElement("div");
  modal.classList.add("modal");

  // Create the message element
  const messageElement = document.createElement("p");
  messageElement.classList.add("modal-message");
  messageElement.innerText = message;

  // Create the close button
  const closeButton = document.createElement("button");
  closeButton.innerText = "X";
  closeButton.classList.add("modal-close");

  // Add the message and close button to the modal
  modal.appendChild(closeButton);
  modal.appendChild(messageElement);

  // Add the modal to the page
  document.body.appendChild(modalOverlay);
  document.body.appendChild(modal);

  // Add an event listener to the close button to remove the modal
  closeButton.addEventListener("click", function() {
    modalOverlay.remove();
    modal.remove();
  });

  // Add an event listener to the modal overlay to remove the modal
  modalOverlay.addEventListener("click", function() {
    modalOverlay.remove();
    modal.remove();
  });
}
