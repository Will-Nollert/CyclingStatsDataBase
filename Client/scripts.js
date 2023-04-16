const raceRouteURLBase = "http://localhost:3000/api/races";
const bicycleRacerRouteURLBase = "http://localhost:3000/api/bicycle-racers";

function getAllBicycleRacers() {
  fetch(raceRouteURLBase)
    .then((response) => response.json())
    .then((data) => {
      const allBicycleRacers = document.getElementById("allBicycleRacers");
      allBicycleRacers.innerHTML = JSON.stringify(data);
    });
}

function getBicycleRacerByName() {
  const riderName = document.getElementById("riderName").value;
  fetch(`${bicycleRacerRouteURLBase}/${riderName}/history`)
    .then((response) => response.json())
    .then((data) => {
      const bicycleRacer = document.getElementById("bicycleRacer");
      bicycleRacer.innerHTML = JSON.stringify(data);
    });
}

function getBicycleRacerRaceHistory() {
  const riderName = document.getElementById("riderNameHistory").value;
  fetch(`${bicycleRacerRouteURLBase}/${riderName}/history`)
    .then((response) => response.json())
    .then((data) => {
      const bicycleRacerRaceHistory = document.getElementById(
        "bicycleRacerRaceHistory"
      );
      bicycleRacerRaceHistory.innerHTML = JSON.stringify(data);
    });
}

function getRankedBicycleRacerRaceHistory() {
  const riderName = document.getElementById("riderNameRankedHistory").value;
  fetch(`${bicycleRacerRouteURLBase}/${riderName}/rankedHistory`)
    .then((response) => response.json())
    .then((data) => {
      const rankedBicycleRacerRaceHistory = document.getElementById(
        "rankedBicycleRacerRaceHistory"
      );
      rankedBicycleRacerRaceHistory.innerHTML = JSON.stringify(data);
    });
}
