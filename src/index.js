const init = () => {

    //elements to be got from DOM
    const trackCircuits2023 = document.getElementById('trackCircuits');
    const sectionTitle = document.getElementById('sectionHeader')

    //function to retrieve races
    function getRaces() {
      fetch(`http://localhost:3000/race`)
        .then(res => res.json())
        .then(data => {
          // Get F1 race track data
          trackCircuits2023.innerHTML = "";
          data.forEach(track => {
            console.log(track);
            const F1TrackCard = createTrackCircuitCards(track);
            trackCircuits2023.appendChild(F1TrackCard);
  
            // Add an event listener to the "View Track" button inside the card
            const viewTrackBtn = F1TrackCard.querySelector('.btn');
            viewTrackBtn.addEventListener('click', (event) => {
              event.preventDefault();
              handleClickViewCircuit(track);
              
            });
          });
        })
    }

    //event listener for F1 teams
    document.getElementById('f1Teams').addEventListener('click', (event) =>{
      event.preventDefault();
      fetch(`http://localhost:3000/teams`)
        .then(res => res.json())
        .then(data => {
          // Get F1 Teams data
          sectionTitle.textContent = `Teams`;
          sectionTitle.setAttribute('data-title', '2023 F1 Teams');
          trackCircuits2023.innerHTML = "";
          data.forEach(team => {
              
            const F1TrackCard = createTeamCards(team);
            trackCircuits2023.appendChild(F1TrackCard);
  
            //tertiary functionality
            // // Add an event listener to the "View Track" button inside the card
            // const viewTrackBtn = F1TrackCard.querySelector('.btn');
            // viewTrackBtn.addEventListener('click', (event) => {
            //   event.preventDefault();
            //   handleClickViewCircuit(track);
            // });
          });
        })
    } )

    //event listener for F1 Standings
    document.getElementById('f1Standings').addEventListener('click', (event) =>{
      event.preventDefault();
      fetch(`http://localhost:3000/constructorsStandings`)
        .then(res => res.json())
        .then(data => {
          const table = document.createElement('table');
          table.className = "styled-table";
          const thead = table.createTHead();
          const tbody = table.createTBody();

          // Create table header row
          const headerRow = thead.insertRow();
          const headerPositions = ["Position", "Team Name", "Points"];

          headerPositions.forEach((headerText) => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
          });
 
          // Create table rows for each team
          data.forEach((team) => {
            const row = tbody.insertRow();
            const rowData = [team.position, team.teamName, team.points];

            rowData.forEach((value) => {
              const cell = row.insertCell();
              cell.textContent = value;
            });
          });

          sectionTitle.textContent = `Constructors Championship`;
          sectionTitle.setAttribute('data-title', '2023 F1 Team Standing');

          table.appendChild(thead);
          table.appendChild(tbody);
          trackCircuits2023.innerHTML = ''; // Clear any previous content
          trackCircuits2023.appendChild(table);
  
        });
    })

    //event listener for F1 Championship
    document.getElementById('f1Championship').addEventListener('click', (event) =>{
      event.preventDefault();
      fetch(`http://localhost:3000/race`)
        .then(res => res.json())
        .then(raceData => {
          // Create a map to store driver data
          const driverDataMap = new Map();

          // Iterate through the race data
          raceData.forEach((race) => {
            if (Array.isArray(race.raceResults)) {
              race.raceResults.forEach((result) => {
              const driverName = result.driverName;
              const pointsAwarded = result.pointsAwarded;

              // Check if the driver is already in the map
              if (driverDataMap.has(driverName)) {
                  // Update the driver's total points
                  driverDataMap.get(driverName).totalPoints += pointsAwarded;
                } else {
                  // Add the driver to the map
                  driverDataMap.set(driverName, {
                    driverName: driverName,
                    totalPoints: pointsAwarded,
                  });
                }
              });
            }
          });

          /// Convert the map values to an array
          const driverDataArray = Array.from(driverDataMap.values());

          // Sort the driver data by total points in descending order
          driverDataArray.sort((a, b) => b.totalPoints - a.totalPoints);

          // Add a position rank to each driver based on total points
          driverDataArray.forEach((driver, index) => {
            driver.position = index + 1;
          });

          // Create a table to display the driver data
          const table = document.createElement('table');
          table.className = 'styled-table';
          const thead = table.createTHead();
          const tbody = table.createTBody();
          const headerPositions = ['Position', 'Driver Name', 'Total Points'];

          const headerRow = thead.insertRow();
          headerPositions.forEach((headerText) => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
          });

          // Create table rows for each driver
          driverDataArray.forEach((driver) => {
            const row = tbody.insertRow();
            [driver.position, driver.driverName, driver.totalPoints].forEach((value) => {
              const cell = row.insertCell();
              cell.textContent = value;
            });
          });

          // Display the table in the HTML
          sectionTitle.textContent = `Driver Championship`;
          sectionTitle.setAttribute('data-title', '2023 F1 Championship Standing');

          table.appendChild(thead);
          table.appendChild(tbody);
          trackCircuits2023.innerHTML = ''; // Clear any previous content
          trackCircuits2023.appendChild(table);
  
        });
    })
   
    // Function to create a card for a track
    function createTrackCircuitCards(track){

      // div element class "card-wrap"
      const cardWrap = document.createElement("div");
      cardWrap.className = "card-wrap";

      // div element class "card"
      const card = document.createElement("div");
      card.className = "card";

      // div element class "card-content z-index"
      const cardContent = document.createElement("div");
      cardContent.className = "card-content z-index";

      // img element for the icon
      const iconImg = document.createElement("img");
      iconImg.className = "icon";
      iconImg.src = track.race_img;
      iconImg.alt = "";

      // h3 element for the title
      const title = document.createElement("h3");
      title.className = "title-sm";
      title.textContent = track.race_track;

      // paragraph element for the text
      const text = document.createElement("p");
      text.className = "text";
      text.textContent =track.race_date;

      //  anchor element for the "Read more" button
      const viewTrackCircuitBtn = document.createElement("a");
      viewTrackCircuitBtn.href = "";
      viewTrackCircuitBtn.className = "btn small";
      viewTrackCircuitBtn.textContent= track.race_name;
    
      // Append the elements to their respective parent elements
      cardContent.appendChild(iconImg);
      cardContent.appendChild(title);
      cardContent.appendChild(text);
      cardContent.appendChild(viewTrackCircuitBtn);

      card.appendChild(cardContent);
      cardWrap.appendChild(card);
    
      return cardWrap;
    }

    // Function to view race details
    function viewTrackCircuitCards(raceData) {
      // Create a container with two columns
      const containerGrid2 = document.createElement("div");
      containerGrid2.className = "container grid-2";
    
      // Create the first column
      const column1 = document.createElement("div");
      column1.className = "column-1";
    
      // Create the second column for the image (you can set the image source here)
      const column2Image = document.createElement("div");
      column2Image.className = "column-2 image";
    
      // Create an h1 element for the race track name
      const trackName = document.createElement("h1");
      trackName.className = "header-title";
      trackName.textContent = raceData.race_track;
    
      // Create a paragraph element for the race date
      const raceDate = document.createElement("p");
      raceDate.className = "text";
      raceDate.textContent = raceData.race_date;

     // Create a paragraph element for the fastest lap driver
     const fastestLapName = document.createElement("p");
     fastestLapName.className = "textStrong";
     fastestLapName.textContent = `Fastest Lap : ${raceData.Fastest_lap.time}`;

     // Create a paragraph element for the fastest lap team
     const fastestLapTeam = document.createElement("p");
     fastestLapTeam.className = "textStrong";
     fastestLapTeam.textContent = `Driver : ${raceData.Fastest_lap.driverName}`;

     // Create a paragraph element for the fastest lap time
     const fastestLapTime = document.createElement("p");
     fastestLapTime.className = "textStrong";
     fastestLapTime.textContent = raceData.Fastest_lap.teamName;
    
      // Create a table for displaying race results
      const raceResultTable = document.createElement("table");
      raceResultTable.className = "styled-table";
    
      // Create a table header row
      const tableHeaderRow = document.createElement("tr");
    
      // Add table header cells
      const tableHeaderPositions = ["Position", "Driver", "Laps", "Time", "Points"];
      tableHeaderPositions.forEach((headerText) => {
        const tableHeaderCell = document.createElement("th");
        tableHeaderCell.textContent = headerText;
        tableHeaderRow.appendChild(tableHeaderCell);
      });
    
      // Append the table header row to the table
      raceResultTable.appendChild(tableHeaderRow);
    
      // Loop through and add race result rows
      raceData.raceResults.forEach((result) => {
        const resultRow = document.createElement("tr");
    
        // Add table data cells
        const tableDataValues = [
          result.position,
          result.driverName,
          result.lapsCompleted,
          result.timeIndex,
          result.pointsAwarded,
        ];
    
        tableDataValues.forEach((value) => {
          const tableDataCell = document.createElement("td");
          tableDataCell.textContent = value;
          resultRow.appendChild(tableDataCell);
        });
    
        // Append the race result row to the table
        raceResultTable.appendChild(resultRow);
      });
    
      // Append the elements to their respective parent elements
      column1.appendChild(trackName);
      column1.appendChild(raceDate);
      column1.appendChild(fastestLapName);
      column1.appendChild(fastestLapTeam);
      column1.appendChild(fastestLapTime);
      
      column2Image.appendChild(raceResultTable);
    
      containerGrid2.appendChild(column1);
      containerGrid2.appendChild(column2Image);
    
      return containerGrid2;
    }
    

    //function to handle view Track.
    function handleClickViewCircuit(raceData){
      
        if (raceData) {
          trackCircuits2023.innerHTML = '';
          const F1TrackDetails = viewTrackCircuitCards(raceData);
          console.log(raceData)
          trackCircuits2023.appendChild(F1TrackDetails);
        } else {
          alert('Race not found.');
        }
    }

    // Function to create a card for f1 Teams
    function createTeamCards(team){

      // div element class "card-wrap"
      const cardWrap = document.createElement("div");
      cardWrap.className = "card-wrap";

      // div element class "card"
      const card = document.createElement("div");
      card.className = "cardTeam";

      // div element class "card-content z-index"
      const cardContent = document.createElement("div");
      cardContent.className = "card-content z-index";

      // img element for the icon
      // const iconImg = document.createElement("img");
      // iconImg.className = "icon";
      // iconImg.src = track.race_img;
      // iconImg.alt = "";

      // h3 element for the title
      const title = document.createElement("h3");
      title.className = "title-sm";
      title.textContent = team.teamName;

      // paragraph element for the text
      const text = document.createElement("p");
      text.className = "text";
      text.textContent =`Major Sponsor: ${team.majorSponsor} `;

      //  anchor element for the "Read more" button
      const countryBase = document.createElement("a");
      countryBase.href = "";
      // viewTrackCircuitBtn.className = "btn small";
      countryBase.textContent= `Country: ${team.country} `;
    
      // Append the elements to their respective parent elements
      // cardContent.appendChild(iconImg);
      cardContent.appendChild(title);
      cardContent.appendChild(text);
      cardContent.appendChild(countryBase);

      card.appendChild(cardContent);
      cardWrap.appendChild(card);
    
      return cardWrap;
    }

    //initialize function
    getRaces();

}


document.addEventListener("DOMContentLoaded", init)