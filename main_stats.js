// In this new approach I'm going to create a new variable caleld Data 

var data;

fetch("https://api.propublica.org/congress/v1/113/house/members.json", {
    
    method: "GET",
    headers: {
        'X-API-KEY': 'AdDkosf6FUFCZ2bSsKgrT6UoYowM1J3qHtCgSMST'
    }
}).then(function (response) {
    if (response.ok) {
        return response.json();
    }
    throw new Error(response.statusText);
}).then(function (json) {
    
    // do something with json data
    
    data = json;
    
    // Then here I need to call all of my functions that are used later. THis is used to
    
    // Calculate the number of Politicians
    getNumberOfPoliticians()
    
    // Append these numbers to the website
    appendPartyNumbers();
    
    // work out the number of percentages in each party
    
    allThreePartyVotePercentages();
    
       // calculate record and attendance
    
    calculateVotingRecordAndAttendance();
    
    // Append loyatly Data
    
    appendLoyaltyData();
    
    // Calculate the loyalty tables
    
    calculateLeastLoyal();
    
    // Loyalty Tables
    
    appendAllLoyaltyTables();
    
    // Attendance
    
    politicalAttendance();
    
    // Attendance for all parties
    
    appendAttendancesForAllPartys()
    
    appendAttendancePercentage();
    
    // Test Data Log
    
    console.log(data);
    
}).catch(function (error) {
    //called when an error occurs anywhere in the chain
    console.log("Request failed: " + error.message);
});

console.log(data);


// I have an object that will contain all of my variables for this challenge. I have added to these as relevant

var statistics = {
    "numOfReps": 0,
    "numOfDems": 0,
    "numOfIndys": 0,
    "fullVotingRecordForRepublicans": [],
    "fullVotingRecordForDemocrats": [],
    "fullVotingRecordForIndependents": [],
};

// Then I want to create the number of Democrats, Republicans and Independents in a function called count politicians

function countPoliticians(party) {

    // First I get the data from the main page

    var memberData = data.results["0"].members;

    var partysPoliticians = 0;

    for (i = 0; i < memberData.length; i++) {
        if (memberData[i].party == party) {
            partysPoliticians += 1;
        }
    }
    return partysPoliticians;
}

// This is a function that works out how many people in each party. It's used so that I can save space in my API call above

function getNumberOfPoliticians() {
    
    statistics["numOfReps"] = countPoliticians("R");

    statistics["numOfDems"] = countPoliticians("D");

    statistics["numOfIndys"] = countPoliticians("I");
}




// Then I want to append this data to the main table. So I have set labels in the main table which I then call here

function appendPartyNumbers() {
    // Simply get teh value of each cell by ID and then append that cell

    var numOfReps = document.getElementById("numOfReps");

    numOfReps.innerHTML = statistics.numOfReps;

    var numOfDems = document.getElementById("numOfDems");

    numOfDems.innerHTML = statistics.numOfDems;

    var numOfIndys = document.getElementById("numOfIndys");

    numOfIndys.innerHTML = statistics.numOfIndys;

}



// Then I want a function that works out the percentage of votes with the party

function totalPercentageVotesWithParty(polParty) {
    // Call the main data 

    var memberData = data.results["0"].members;

    // variable created here that is needed below of 

    var partyVotePercentages = [];

    // Go through the data and for each element that has a .party value of R push that .vote_with_party_pct to a new variable called repVotePercentages

    for (i = 0; i < memberData.length; i++) {
        if (memberData[i].party == polParty) {
            partyVotePercentages.push(memberData[i]);
        }
    }

    // return this to the function

    return partyVotePercentages;

    // Add this value to the main javascript object at the top
}

// This function enables me to work out the percentage data for all of the different parties. I then use it in my API call at the top

function allThreePartyVotePercentages() {

// Then call this function for Republicans

statistics["fullVotingRecordForRepublicans"] = totalPercentageVotesWithParty("R");

// Democrats

statistics["fullVotingRecordForDemocrats"] = totalPercentageVotesWithParty("D");

// Independents

statistics["fullVotingRecordForIndependents"] = totalPercentageVotesWithParty("I");

}

// PUT PARTY LOYALTY HERE

function calculatePartyStatistics(fullVotingRecords, statToCheck) {

    // for each record in whatever party I pass through I want it to go through the whole array


    // Total percentage vote variable

    var totalPartyPercentage = 0

    // I want it to take the percentage_vote_with_party percentage and add this to a total party vote percentage I'm going to put above

    for (i = 0; i < fullVotingRecords.length; i++) {
        totalPartyPercentage += fullVotingRecords[i][statToCheck];

    }

    // Then I want it to calculate and return the % value

    return (totalPartyPercentage / fullVotingRecords.length);
}



// Then I want to call this function for republicans, indys and dems for the loyalty in a new function to be called in the main API call above

function calculateVotingRecordAndAttendance() {

statistics["averageRepLoyaltyPercentage"] = calculatePartyStatistics(statistics.fullVotingRecordForRepublicans, "votes_with_party_pct").toFixed(2);

statistics["averageDemLoyaltyPercentage"] = calculatePartyStatistics(statistics.fullVotingRecordForDemocrats, "votes_with_party_pct").toFixed(2);

statistics["averageIndyLoyaltyPercentage"] = calculatePartyStatistics(statistics.fullVotingRecordForIndependents, "votes_with_party_pct").toFixed(2);



// Then I want to call the function for party attendance

//function calculateFullPartyAttendance() {

statistics["avRepAttendancePercent"] = (100 -calculatePartyStatistics(statistics.fullVotingRecordForRepublicans, ("missed_votes_pct"))).toFixed(2);

statistics["avDemAttendancePercent"] = (100 - calculatePartyStatistics(statistics.fullVotingRecordForDemocrats, ("missed_votes_pct"))).toFixed(2);

statistics["avIndyAttendancePercent"] = (100 - calculatePartyStatistics(statistics.fullVotingRecordForIndependents, ("missed_votes_pct"))).toFixed(2);

}

//    }

// APPEND LOYALTY DATA

// Then I want to append the vote percentages for voting with party to the two loyalty apges

function appendLoyaltyData(){

   if (location.pathname == ("/house_loyalty_stats.html")){
    
    var demLoyaltyPercentage = document.getElementById('demPercentage');

    demLoyaltyPercentage.innerHTML = statistics.avDemAttendancePercent;

    // Then append the Republicans

    var repLoyaltyPercentage = document.getElementById('repPercentage');

    repLoyaltyPercentage.innerHTML = statistics.averageRepLoyaltyPercentage;

    // Then append independents

    var indyLoyaltyPercentage = document.getElementById('indyPercentage');

    if (statistics.averageIndyLoyaltyPercentage != "") {
        indyLoyaltyPercentage.innerHTML = "N/A";
    } 
       else {
        indyLoyaltyPercentage.innerHTML = statistics.averageIndyLoyaltyPercentage.toFixed(2);
       }
   }


// APPEND SENATE LOYALTY

    if (location.pathname == "/senate_loyalty_stats.html") {
    
    var demLoyaltyPercentage = document.getElementById('demPercentage');

    demLoyaltyPercentage.innerHTML = statistics.averageDemLoyaltyPercentage;

    // Then append the Republicans

    var repLoyaltyPercentage = document.getElementById('repPercentage');

    repLoyaltyPercentage.innerHTML = statistics.averageRepLoyaltyPercentage;

    // Then append independents

    var indyLoyaltyPercentage = document.getElementById('indyPercentage');

    if (statistics.averageIndyLoyaltyPercentage != "") {
        indyLoyaltyPercentage.innerHTML = "N/A";
    } else {
        indyLoyaltyPercentage.innerHTML = statistics.averageIndyLoyaltyPercentage.toFixed(2);
    }
    
    }
}

// THEN I WANT TO WORK OUT THE LEAST LOYAL 10%

function calculateLeastLoyal(){

// FINDING THE LEAST LOYAL 10%

function politicalLoyalty() {

    // call the main data - although maybe at the end this could come out so that I can just check each partys loyalty if I wanted to

    var memberData = data.results["0"].members;

    // Sort this data with the lowest percentage of voting with party bottom.

    var votingDataToEdit = memberData.sort(function (a, b) {
        return b.votes_with_party_pct - a.votes_with_party_pct
    })


    // Then work out 10% of this data by counting the length of this new array and dividing it by 10

    var tenPercentOfPoliticians = (votingDataToEdit.length / 10).toFixed(0);

    // Then check if the 10% negative stat is equal to any others by doing something like if the value of the 10% index is less than or equal to any i then set a new index value to that number

    var loyalIndex = 0;

    for (i = 0; i < votingDataToEdit.length; i++) {
        if (votingDataToEdit[i].votes_with_party_pct >= votingDataToEdit[tenPercentOfPoliticians].votes_with_party_pct) {
            loyalIndex = i;
        }
    }

    // Then push every item in the array from this new index point into a new array called lestLoyalPeople

    var mostLoyalPols = [];

    for (i = 0; i < (votingDataToEdit.length) && (i < loyalIndex); i++) {
        mostLoyalPols.push(votingDataToEdit[i]);
    }


    // Then we can look at the negative data by reversing the order of the voting data to edit

    var leastLoyalOrder = votingDataToEdit.reverse();


    var unloyalIndex = 0;

    for (i = 0; i < leastLoyalOrder.length; i++) {
        if (leastLoyalOrder[i].votes_with_party_pct <= leastLoyalOrder[tenPercentOfPoliticians].votes_with_party_pct) {
            unloyalIndex = i;
        }
    }

    var leastLoyal = [];

    for (i = 0;
        (i < leastLoyalOrder.length) && (i < unloyalIndex); i++) {
        leastLoyal.push(leastLoyalOrder[i])
    }

    statistics["leastLoyalList"] = leastLoyal;

    statistics["mostLoyalList"] = mostLoyalPols;

}

politicalLoyalty();

    }

function appendLoyalty(tableToAppend, statArrayToUse) {
    
    var myTable = tableToAppend;
    
    for (i =0; i < statArrayToUse.length; i++) {
            var newRow = document.createElement("tr");

            // Then create rows for name, party, number of party votes and percentage of party votes

            var nameCol = document.createElement("td");

//            var partyCol = document.createElement("td");

            var totalVotes = document.createElement("td");

            var votesWithParty = document.createElement("td");

            myTable.appendChild(newRow);

            newRow.appendChild(nameCol);
//            newRow.appendChild(partyCol);
            newRow.appendChild(totalVotes);
            newRow.appendChild(votesWithParty);

            nameCol.innerHTML = ((statArrayToUse[i].first_name) + " " + (statArrayToUse[i].last_name));

            
//            partyCol.innerHTML = statArrayToUse[i].party;

            totalVotes.innerHTML = statArrayToUse[i].total_votes;

            votesWithParty.innerHTML = statArrayToUse[i].votes_with_party_pct; 

            // Then finally add a class list
            newRow.classList.add(statArrayToUse[i].party);

        }
}

function appendAllLoyaltyTables() {

if (location.pathname == "/senate_loyalty_stats.html") {
    appendLoyalty(document.getElementById("senateLoyaltyTable"), statistics.mostLoyalList);

    appendLoyalty(document.getElementById("senateUnloyaltyTable"), statistics.leastLoyalList);
}
if (location.pathname == "/house_loyalty_stats.html") {
    appendLoyalty(document.getElementById("houseLoyaltyTable"), statistics.mostLoyalList);

    appendLoyalty(document.getElementById("houseUnLoyaltyTable"), statistics.leastLoyalList);  
    
}

}
// POLITICAL ATTENDANCE

function politicalAttendance() {

    // call the main data - although maybe at the end this could come out so that I can just check each partys loyalty if I wanted to

    var memberData = data.results["0"].members;

    // Sort this data with the lowest percentage of voting with party bottom.


    var votingDataToEdit = memberData.sort(function (a, b) {
        return b.missed_votes_pct - a.missed_votes_pct
    })

    // Then work out 10% of this data by counting the length of this new array and dividing it by 10

    var tenPercentOfPoliticians = (votingDataToEdit.length / 10).toFixed(0);

    // Then check if the 10% negative stat is equal to any others by doing something like if the value of the 10% index is less than or equal to any i then set a new index value to that number

    var attendanceIndex = 0;

    for (i = 0; i < votingDataToEdit.length; i++) {
        if (votingDataToEdit[i].missed_votes_pct >= votingDataToEdit[tenPercentOfPoliticians].missed_votes_pct) {
            attendanceIndex = i;
        }
    }

    // Then push every item in the array from this new index point into a new array called lestLoyalPeople

    var bestAttendancePols = [];

    for (i = 0; i < (votingDataToEdit.length) && (i < attendanceIndex); i++) {
        bestAttendancePols.push(votingDataToEdit[i]);
    }


    // Then we can look at the negative data by reversing the order of the voting data to edit

    var worstAttendanceOrder = votingDataToEdit.reverse();


    var worstAttendanceIndex = 0;

    for (i = 0; i < worstAttendanceOrder.length; i++) {
        if (worstAttendanceOrder[i].missed_votes_pct <= worstAttendanceOrder[tenPercentOfPoliticians].missed_votes_pct) {
            worstAttendanceIndex = i;
        }
    }

    var worstAttendees = [];

    for (i = 0;
        (i < worstAttendanceOrder.length) && (i < worstAttendanceIndex); i++) {
        worstAttendees.push(worstAttendanceOrder[i])
    }

    statistics["bestAttendees"] = worstAttendees;

    statistics["worstAttendees"] = bestAttendancePols;

}


function appendAttendance(tableToAppend, statArrayToUse) {
    
    var myTable = tableToAppend;
    
    for (i =0; i < statArrayToUse.length; i++) {
            var newRow = document.createElement("tr");

            // Then create rows for name, party, number of party votes and percentage of party votes

            var nameCol = document.createElement("td");

//            var partyCol = document.createElement("td");

            var missedVotes = document.createElement("td");

            var attendancePercentage = document.createElement("td");

            myTable.appendChild(newRow);

            newRow.appendChild(nameCol);
//            newRow.appendChild(partyCol);
            newRow.appendChild(missedVotes);
            newRow.appendChild(attendancePercentage);

            nameCol.innerHTML = ((statArrayToUse[i].first_name) + " " + (statArrayToUse[i].last_name));

//            
//            partyCol.innerHTML = statArrayToUse[i].party;

            missedVotes.innerHTML = statArrayToUse[i].missed_votes;

            attendancePercentage.innerHTML = (100 -(statArrayToUse[i].missed_votes_pct)).toFixed(2); 

            // Then finally add a class list
            newRow.classList.add(statArrayToUse[i].party);

        }
}
//

function appendAttendancesForAllPartys() {

if (location.pathname == "/senate_attendance_stats.html") {
     appendAttendance(document.getElementById("senateGoodAttendanceTable"), statistics.bestAttendees);

    appendAttendance(document.getElementById("senateBadAttendanceTable"), statistics.worstAttendees);
  
}

if (location.pathname == "/house_attendance_stats.html") {
     appendAttendance(document.getElementById("houseGoodAttendanceTable"), statistics.bestAttendees);

    appendAttendance(document.getElementById("houseBadAttendanceTable"), statistics.worstAttendees);
  
}
}
// PERCENTAGE ATTENDANCE


function appendAttendancePercentage() {
    // Get the element for each part of the attendance bit and then make it equal to the statistics element
    
    var repAtt = document.getElementById("repAtt")
    
    repAtt.innerHTML = statistics.avRepAttendancePercent;
    
    var demAtt = document.getElementById("demAtt")
    
    demAtt.innerHTML = statistics.avDemAttendancePercent;   
    
    var indyAtt = document.getElementById("indyAtt");
    
    
    if (isNaN(statistics.avIndyAttendancePercent)) {
        indyAtt.innerHTML = "N/A";
    } 
       else {
    indyAtt.innerHTML = statistics.avIndyAttendancePercent;
       }
    
    
}







