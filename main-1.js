// Here I'm going to want to write a script that goes through all of the member data and for each element if the party for that person is rep/dem/ind add them to a distinct array for each one. Actually first thing I'm going to do is create a main.js file for all of this to go in

// This is then the object written in JSON form

var statistics = {
    "numberOfDemocrats": 0,
    "numberOfRepublicans": 0,
    "numberOfIndependents": 0,
    "averageRepublicanVotes": 0,
    "averageDemocratVotes": 0,
    "membersWhoVoteWithParty": 0,
    "membersWhoDontVoteWithParty": 0,
    "membersMissedMostVotes": 0,
    "membersMissedLeastVotes": 0,
    "allRepublicanInfo": [],
    "allDemocratInfo": [],
    "allIndependentInfo": [],
    "allRepublicansVotedWithPartyPercentages": [],
    "allDemocratVotedWithPartyPercentages": [],
    "allVotedWithPartyPercentages": [],
    "allPoliticiansOrderByVotePercentage": [],
    "politiciansOrderedByNegativeVotingPercentage": [],
    "mostLoyalList": [],
    "leastLoyalList": [],
    "numberOfPoliticians": 0
};


function splitMembers() {
    // So first call the main data page

    var memberData = data.results["0"].members;

    // Then set three empty array variables of indys, reps and dems

    var indys = [];
    var reps = [];
    var dems = [];

    // Then go through the data and for each element if the variable of party is equal to "R" add to reps...."D" add to dems...and "I" add to indys

    // This is to add the republicans to their own array

    for (i = 0; i < memberData.length; i++) {
        if (memberData[i].party == "R") {
            reps.push(memberData[i]);
        }
    }

    // This is to add the democrats to their own array

    for (i = 0; i < memberData.length; i++) {
        if (memberData[i].party == "D") {
            dems.push(memberData[i]);
        }
    }

    // This is to add the independents to their own array

    for (i = 0; i < memberData.length; i++) {
        if (memberData[i].party == "I") {
            indys.push(memberData[i]);
        }
    }

    // This data below then just counts the total number of each party

    statistics['numberOfDemocrats'] = dems.length;
    statistics['numberOfRepublicans'] = reps.length;
    statistics['numberOfIndependents'] = indys.length;
    statistics['allRepublicanInfo'] = reps;
    statistics['allDemocratInfo'] = dems;
    statistics['allIndependentInfo'] = indys;

}
// Function is then called so that it runs

splitMembers();

// Now I'm going to write a function that calculates the percentage of voting within a party. I'm going to call in votesWithParty(party) passing party parameter through it

// This is my second attempt at this function to try and make it work properly

function missedMaximumVotes() {
   
    // Get the array of all of the data

    var memberData = data.results["0"].members;

    // Then order this data by votes_with_party_pct going high to low

    var sortedByVotesAgainstParty = memberData.sort(function (a, b) {
        return b.votes_with_party_pct - a.votes_with_party_pct
    })
   
    console.log(sortedByVotesAgainstParty);
    
    // Then I want to add this data to my main stats object.
    statistics['politiciansOrderedByNegativeVotingPercentage'] = sortedByVotesAgainstParty;
    // This should sort by least loyal

//    var sortedByLeastLoyalOrder = memberData.sort(function (a, b) {
//        return b.votes_with_party_pct - a.votes_with_party_pct
//    })
//   
//statistics["politiciansOrderedByNegativeVotingPercentage"] = sortedByLeastLoyalOrder;


    // Then I need to split these up by bottom 10%...but if the value at the lowest point is equal to the -10% then I need to include that (or those) ones to

    // So to do this I'm going to count all of the members first

    var totalNumOfPoliticians = statistics.numberOfDemocrats + statistics.numberOfIndependents + statistics.numberOfRepublicans;

    statistics['numberOfPoliticians'] = totalNumOfPoliticians;

    // So now I can use my total number of politicians to work out the top and bottom 10% of the set

    var tenPercentOfPoliticians = totalNumOfPoliticians / 10;

    // Then I want to check through my new array of sorted politicians to see from the index of tenPercentOfPoliticians if the item next to it is the same value. I want to keep checking until it's not then I want to splice the data from that point


    // So set a value for index position which will be tenPercentOfPoliticians to start with. 

    var indexPosition = tenPercentOfPoliticians;

    // So I've made an array of all of the % data above so I want to order it here largest to smallest and added it to the main object. 

    var largestToSmallestVotePercentages = statistics.allVotedWithPartyPercentages.sort(function (a, b) {
        return b - a
    });
    
    // so smallest to largest vote percentage is 
    
    smallestToLargestVotePercentage = largestToSmallestVotePercentages.reverse();


    // Then I want to take the 10% position and check if the next element is the same. If it is then I want to set the value of index to that value. If not then I want to break the series. 

    var topTenPercentVoteIndex = tenPercentOfPoliticians - 1;

    for (i = topTenPercentVoteIndex; i < smallestToLargestVotePercentage.length; i++) {
        if (smallestToLargestVotePercentage[topTenPercentVoteIndex] == smallestToLargestVotePercentage[i]) {
            topTenPercentVoteIndex = i

        };

    };


    // I then want to slice the array that contains all of the senators order by vote percentage by this index point. 

    var leastLoyalTenPercent = [];

    // reversed list of all politicians ordered by voting loyalty 
    
    politiciansOrderedByHowUnloyalTheyAre = statistics.allPoliticiansOrderByVotePercentage.reverse();
    
    for (i = 0;
        (i < politiciansOrderedByHowUnloyalTheyAre.length) && (i <= topTenPercentVoteIndex); i++) {

        leastLoyalTenPercent.push(statistics.allPoliticiansOrderByVotePercentage[i])

    };

    statistics['leastLoyalList'] = leastLoyalTenPercent;
console.log("hello")
}

missedMaximumVotes();


// This function is my function for least Loyal but it's not worked so I'm trying it above instead with the below commented out.
//
//function votesWithParty() {
//
//    // The below goes through all of the rep array data and then takes all of the votes with % and puts it in a separate array. Using this data I have then calculated the average vote with party. I've repeated this process for Democrats
//
//    // REPUBLICANS
//
//    var totalRepsPct = 0;
//    var repsPct = [];
//    var allPoliticianVotesWithParty = [];
//
//    for (i = 0; i < statistics.allRepublicanInfo.length; i++) {
//
//        // for each value I want to get the vote with party percentage and add it to a the party_pct array
//        repsPct.push(data.results["0"].members[i].votes_with_party_pct);
//
//        allPoliticianVotesWithParty.push(data.results["0"].members[i].votes_with_party_pct);
//
//        totalRepsPct += data.results["0"].members[i].votes_with_party_pct;
//    }
//
//    averageRepVoteWithParty = totalRepsPct / statistics.numberOfRepublicans;
//
//    statistics['averageRepublicanVotes'] = averageRepVoteWithParty.toFixed(2);
//
//    statistics['allRepublicansVotedWithPartyPercentages'] = repsPct;
//
//
//    // DEMOCRATS
//
//    var totalDemsPct = 0;
//    var demsPct = [];
//
//    for (i = 0; i < statistics.allDemocratInfo.length; i++) {
//
//        // for each value I want to get the vote with party percentage and add it to a the party_pct array
//        demsPct.push(data.results["0"].members[i].votes_with_party_pct);
//
//        allPoliticianVotesWithParty.push(data.results["0"].members[i].votes_with_party_pct);
//
//
//        totalDemsPct += data.results["0"].members[i].votes_with_party_pct;
//    }
//
//    averageDemVoteWithParty = totalDemsPct / statistics.numberOfDemocrats;
//
//    statistics['averageDemocratVotes'] = averageDemVoteWithParty.toFixed(2);
//    statistics['allDemocratVotedWithPartyPercentages'] = demsPct;
//
//    statistics['allVotedWithPartyPercentages'] = allPoliticianVotesWithParty;
//}
//
//votesWithParty();
//

// This function appends the total number of republicans to the main HTML page




function missedLeastVotes() {
    // Get the array of all of the data

    var memberData = data.results["0"].members;

    // Then order this data by votes_with_party_pct going high to low

    var sortedByVotesWithParty = memberData.sort(function (a, b) {
        return a.votes_with_party_pct - b.votes_with_party_pct
    })
   
    // Then I want to add this data to my main stats object.
    statistics['allPoliticiansOrderByVotePercentage'] = sortedByVotesWithParty;
    // This should sort by least loyal

//    var sortedByLeastLoyalOrder = memberData.sort(function (a, b) {
//        return b.votes_with_party_pct - a.votes_with_party_pct
//    })
//   
//statistics["politiciansOrderedByNegativeVotingPercentage"] = sortedByLeastLoyalOrder;


    // Then I need to split these up by bottom 10%...but if the value at the lowest point is equal to the -10% then I need to include that (or those) ones to

    // So to do this I'm going to count all of the members first

    var totalNumOfPoliticians = statistics.numberOfDemocrats + statistics.numberOfIndependents + statistics.numberOfRepublicans;

    statistics['numberOfPoliticians'] = totalNumOfPoliticians;

    // So now I can use my total number of politicians to work out the top and bottom 10% of the set

    var tenPercentOfPoliticians = totalNumOfPoliticians / 10;

    // Then I want to check through my new array of sorted politicians to see from the index of tenPercentOfPoliticians if the item next to it is the same value. I want to keep checking until it's not then I want to splice the data from that point


    // So set a value for index position which will be tenPercentOfPoliticians to start with. 

    var indexPosition = tenPercentOfPoliticians;

    // So I've made an array of all of the % data above so I want to order it here largest to smallest and added it to the main object. 

    var largestToSmallestVotePercentages = statistics.allVotedWithPartyPercentages.sort(function (a, b) {
        return b - a
    });


    // Then I want to take the 10% position and check if the next element is the same. If it is then I want to set the value of index to that value. If not then I want to break the series. 

    var topTenPercentVoteIndex = tenPercentOfPoliticians - 1;

    for (i = topTenPercentVoteIndex; i < largestToSmallestVotePercentages.length; i++) {
        if (largestToSmallestVotePercentages[topTenPercentVoteIndex] == largestToSmallestVotePercentages[i]) {
            topTenPercentVoteIndex = i

        };

    };


    // I then want to slice the array that contains all of the senators order by vote percentage by this index point. 

    var mostLoyalTenPercent = [];

    for (i = 0;
        (i < statistics.allPoliticiansOrderByVotePercentage.length) && (i <= topTenPercentVoteIndex); i++) {

        mostLoyalTenPercent.push(statistics.allPoliticiansOrderByVotePercentage[i])

    };

    statistics['mostLoyalList'] = mostLoyalTenPercent;

}

missedLeastVotes();


function missedMostVotes() {

       // Get the array of all of the data

    var newMemberData = data.results["0"].members;
    
    // Sort the member data
    
        var sortedByLeastLoyalOrder = newMemberData.sort(function (a, b) {
        return b.votes_with_party_pct - a.votes_with_party_pct
    })
   
statistics["politiciansOrderedByNegativeVotingPercentage"] = sortedByLeastLoyalOrder;
    
    // So I want to get 10% of politicians again ideally using a global variable from the statistics object that I'm going to have to ensure is assigned.

    var tenPercentOfPoliticians = statistics.numberOfPoliticians / 10;

    // Then I'm going to want to take my negatively ordered list of polticiians by voting with party stat....and count through this list to my 10% value (45).

    var negativeIndex = tenPercentOfPoliticians - 1;

    var smallestToLargesVotePercentages = statistics.allVotedWithPartyPercentages.sort(function (a, b) {
        return a - b
    });

    // Go through the smallest to largest list

    for (i = negativeIndex; i < smallestToLargesVotePercentages; i++) {
        if (smallestToLargesVotePercentages[negativeIndex] == smallestToLargesVotePercentages[i]) {
            negativeIndex = i
        };
    };

    console.log(negativeIndex);

    // Then here I want to check that the list of % is correct and it really is 45 index (44)
    console.log(statistics.allVotedWithPartyPercentages);


    // Then whatever this number is I want to push that number of data items to a new array called leastLoyalTenPercent

    var leastLoyalTenPercent = [];

    // Here I want to push all of the data up to the value of negative index of the politicians ordered by voting loyalty going backwards.

    for (i = 0; i < statistics.politiciansOrderedByNegativeVotingPercentage[negativeIndex]; i++) {
        leastLoyalTenPercent.push(statistics.politiciansOrderedByNegativeVotingPercentage[i]);
    };

    // Then I'm going to check this list in the console.

    console.log(leastLoyalTenPercent);

    // Then I want to assign this leastLoyal list to my statistics variables

}

missedMostVotes();

function appendFixedNumber() {

    // Put the republicans in the main page

    var repNumInHTML = document.getElementById("repNumTag");

    repNumInHTML.innerHTML = statistics.numberOfRepublicans;

    // Put the Dems in the main page

    var demNumInHTML = document.getElementById("demNumTag");

    demNumInHTML.innerHTML = statistics.numberOfDemocrats;

    // Put the Indys in the main page

    var indyNumInHTML = document.getElementById("indyNumTag");

    indyNumInHTML.innerHTML = statistics.numberOfIndependents;

    // Put the Dem Vote with Party % in the main page

    var demPartyPerInHTML = document.getElementById("dem%Tag");

    demPartyPerInHTML.innerHTML = statistics.averageDemocratVotes

    // Put the Rep Vote with Party % in the main page

    var repPartyPerInHTML = document.getElementById('rep%Tag');

    repPartyPerInHTML.innerHTML = statistics.averageRepublicanVotes;
}

appendFixedNumber();

function appendLeastLoyal() {
    // So I want to call the table from the document as a table

    var loyaltyTable = document.getElementById("loyaltyTable")



    // Then for every value of the mostLoyal array I want to add a row....

    for (i = 0; i < statistics.mostLoyalList.length; i++) {
        // Then I want to create new element of a row

        var newRow = document.createElement('tr');

        // Then I want to create a new element of a column for name

        var nameCol = document.createElement('td');

        // Then my own Party column which I added so it makes more sense
        
        var partyCol = document.createElement('td');
        
        //Number Party Votes

        var partyVoteCol = document.createElement('td');

        // % of Party Votes

        var percentageOfVotesCol = document.createElement('td');
        
        // Then append the rows and columns
        
        loyaltyTable.appendChild(newRow);

        newRow.appendChild(nameCol);
        newRow.appendChild(partyCol);
        newRow.appendChild(partyVoteCol);
        newRow.appendChild(percentageOfVotesCol);

        // Then put the data inside for the names
        
        nameCol.innerHTML = (statistics.mostLoyalList[i].first_name) + " " + (statistics.mostLoyalList[i].last_name);
        
        // Then put the data inside for the party
        
        partyCol.innerHTML = statistics.mostLoyalList[i].party;
        
        partyVoteCol.innerHTML = statistics.mostLoyalList[i].total_votes;

        percentageOfVotesCol.innerHTML = statistics.mostLoyalList[i].votes_with_party_pct;
        
        newRow.classList.add(statistics.mostLoyalList[i].party);
        
        
    }

    // and then in each row I want to add a column for every different item

    // and then in each column item I want to add the relevant value using inner.html
}

appendLeastLoyal();
