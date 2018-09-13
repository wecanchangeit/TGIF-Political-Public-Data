// Include the main data variable

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
    
    showData();
    listStates();
    
}).catch(function (error) {
    //called when an error occurs anywhere in the chain
    console.log("Request failed: " + error.message);
});


function showData() {

    // First I want to set the variable of dataTable which will be my table. I'll want to use the getElementById to ensure that I can put this dta in the correct place in the HTML.

    var dataTable = document.getElementById('political-data');

    // I also want to call the member data. The data itself is already in the file as it's on a separate JSON page, but I need to add the specific member data. To do this I went into the document and inspected the element 'data' in the console until I could find it.

    var memberData = data.results["0"].members;

    // Now I have both the table and the data I want to add the data to my table. To do this I want to do a for loop...which lasts as long as the length of the member data

    for (i = 0; i < memberData.length; i++) {

        // What I am saying here is that for every element of data I want to add a row, and five columns all with data inside. So to do this I am going to have to create a row and five column elements

        var tableRows = document.createElement("tr");
        var nameCol = document.createElement("td");
        var polPartyCol = document.createElement("td");
        var stateCol = document.createElement("td");
        var seniorityCol = document.createElement("td");
        var voteInPartyCol = document.createElement("td");

        // For every time I go through the member data row I want to add a new row to the table

        dataTable.appendChild(tableRows);

        // Within this row I then want to append a td for all of the five column headings

        tableRows.appendChild(nameCol);
        tableRows.appendChild(polPartyCol);
        tableRows.appendChild(stateCol);
        tableRows.appendChild(seniorityCol);
        tableRows.appendChild(voteInPartyCol);

        // I then want to use the innerHTML to insert the data.

        // For the first row I need to combined three sets of data with first, middle and last names so I'll make them as variables here so it's easier to utilise them

        var firstNames = memberData[i].first_name;

        var middleNames = memberData[i].middle_name;

        var lastNames = memberData[i].last_name;

        var senatorName = firstNames + " " + middleNames + " " + lastNames;


        if (middleNames == null) {
            var senatorName = firstNames + " " + lastNames;
        }

        // Here I've added a senator website link so I can use it later to connect it in the webpage

        var senatorWebPage = memberData[i].url;


        //  Then I want to put data within each bit of box using innerHTML. 

        nameCol.innerHTML = senatorName.link(senatorWebPage);

        polPartyCol.innerHTML = memberData[i].party;

        stateCol.innerHTML = memberData[i].state;

        seniorityCol.innerHTML = memberData[i].seniority;

        voteInPartyCol.innerHTML = memberData[i].votes_with_party_pct + "%";

        // Here I have added the ability to call give every row a class of it's political party. This should make it easier to define which rows to see
        tableRows.classList.add(memberData[i].party);

        tableRows.classList.add("politicalRow")

        // In this part I want to be able to add the state class to each row.

        tableRows.classList.add(memberData[i].state);
        
         tableRows.classList.add("all");

    }
    //        

}

// function called in my main API



function hidePolitician(party) {

    // Given a persons political party "R" "D" or "I" I want to get that element by class

    var showLines = document.getElementsByClassName(party);

    // Then for each item I want to create a toggle of class 'hide' this just works with bootstrap CSS. 

    for (i = 0; i < showLines.length; i++) {
        showLines[i].classList.toggle('hideParty');
    }

}

// Here I'm going to write a function called listStates. This is going to go to the document and get the dropdown by ID. 

function listStates() {


    // It's then going to loop through the array of data and if it's a non dupicate value then it's going to add it to an array called states. 


    var memberData = data.results["0"].members;

    var states = [];
    for (i = 0; i < memberData.length; i++) {
        states.push(memberData[i].state);
    }
    var filteredStates = [];
    var sortedStates = states.sort();
    for (i = 1; i < sortedStates.length; i++) {
        if (!filteredStates.includes(sortedStates[i])) {
            filteredStates.push(sortedStates[i]);
        }
    }


    //Then for each item in this new array states I want to append them to the drop down in the document 

    for (i = 0; i < filteredStates.length; i++) {
        var dropdown = document.getElementById("stateDD");
        var listItem = document.createElement("option");
        listItem.text = memberData[i].state;
        listItem.setAttribute('value', memberData[i].state);
        dropdown.add(listItem);
    }

    //    for (i=0; i < sortedStates.length; i++) {
    //        dropdown.appendChild("listItem");
    //    }

    // End the function

}


// Then I want to write a function that given selecting a specific option of state it shows the relevant state. 

function showState() {
    // I want to get the data from the table in the document
    
        // Then I want to say if any of the classes of the table have the same value as this stadeDD.value then set their class to show. Otherwise set their class to hide 
        
        // Get the table link
        var table = document.getElementById("political-data");
      
        for (var i=0, row; row = table.rows[i]; i++) {
           
            //If the class of the row is not equal to stateDD then set the classList to an appropriate unique 'hide'
            
           var stateDD = document.getElementById('stateDD'); 
            console.log(stateDD);
        
            if (row.classList.contains(stateDD.value)) {row.classList.remove('hideState')}
            else {row.classList.add('hideState')}
              
 
//            {row.classList.remove('hideState');}
        }
            
        
}
