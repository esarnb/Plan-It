// //Global Functions

// //Functions
var userLongitude;
var userLatitude;

$(document).ready(function () {
    stationNameButton();
    getLocal();
})

// ajax call for calendarific api data on click
// $("button").on("click", function () {

//     $.ajax({
//         url: "https://calendarific.com/api/v2/holidays?&api_key=5aacde472af07a267319cf6071d535aa05e2a4d6",
//         method: "GET"
//     })
//         .then(function (response) {
//             console.log(response)

//             var calResults = response.holidays

//             $("#cal-results").text(calResults)

//         })

// })
// ajax call for bart api on click for user input current station
// $("button").on("click", function () {
// user input destination variable, not sure if we are gonna use this or a dropdown with all the stations already listed
// var bartStation = $(this).attr("data-bart");

//     var bartQuery = "http://api.bart.gov/api/etd.aspx?cmd=etd&orig=" + bartStation + "&json=y";

//     $.ajax({
//         url: bartQuery,
//         method: "GET"
//     })
//         .then(function (root) {
//             console.log(root)

//             var bartResults = root

//             $("#bart-results").text(bartResults)

//         })

// })

function stationNameButton() {

    $.ajax({
        url: "http://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V&json=y",
        method: "GET"
    })
        .then(function (response) {
            console.log(response)
            var stationName = response.root.stations.station;
            // console.log(stationName)
            for (var i = 0; i < stationName.length; i++) {

                var statName = response.root.stations.station[i].name;
                // console.log(i)
                var newOption = $("<option>")
                newOption.addClass("station-button")
                newOption.attr("name-value", statName)
                newOption.text(statName)
                $("#select-form").append(newOption)

            }
        })
}

// $("#submit-transport").on("click", function () {
//     var namesQuery = "http://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V&json=y";
//     var pickedPlace = $("#select-form").val().trim();
//     $.ajax({
//         url: namesQuery,
//         method: "GET"
//     })
//         .then(function (response) {
//             // console.log(response);
//             var jsObjects = response.root.stations.station
//             var result = jsObjects.filter(obj => {
//                 return obj.name === pickedPlace
//             })
//             var abbrev = result[0].abbr;
//             console.log(abbrev);
//             /////////Second Query////////
//             var abbrQuery = "http://api.bart.gov/api/etd.aspx?cmd=etd&orig=" + abbrev + "&key=MW9S-E7SL-26DU-VV8V&json=y";
//             $.ajax({
//                 url: abbrQuery,
//                 method: "GET"
//             })
//                 .then(function (response) {
//                     console.log(response);
//                     var bartInfo = response.root.station.etd[i]
//                     console.log(bartInfo)
//                     $("#transport-table").text(bartInfo)


//                 })
//         })
// })




$("#submit-transport").on("click", function () {
    // if user provides location
    if (!userLongitude === null) {
        var userLocation = "https://api.yelp.com/v3/autocomplete?text=del&latitude=" + userLatitude + "&longitude=" + userLongitude;
        // if uses does not provide location show hot and new restaurants
    } else {
        var userLocation = "https://api.yelp.com/v3/businesses/search/hot_and_new"
    }


    $.ajax({
        url: userLocation,
        method: "GET"
    })
        .then(function (businesses) {
            console.log(businesses)

            var businesses = businesses

            $("#yelp-results").text(businesses)

        })


})

// function to display bart status
$(document).ready(function (sendRequest) {
    $.ajax({
        url: "http://api.bart.gov/api/bsa.aspx?cmd=bsa&json=y",
        method: "GET"
    })
        .then(function (root) {
            console.log(root)

            var bartStatus = root.bsa

            $("#bart-status").text(bartStatus)

        })
});




function getLocal() {
    var x = document.getElementById("show-local");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }

    function showPosition(position) {
        // x.innerHTML = "Latitude: " + position.coords.latitude +
        //     "<br>Longitude: " + position.coords.longitude;
            userLongitude = position.coords.longitude;
            userLatitude = position.coords.latitude
    }

}












/* Above, Matt only works. Below, Esar only works.    Stubbing. */
/* Front End JS*/

// Hide initial tables

// TRANSPORTATION TAB //

// // On click, the transportation tab will show
$('#transport-tab').on('click',function() {
   
    // The title will be Transportation and added to the id widget title

    $('#widget-title').text('Transportation');

    //ELEMENTS
    $('#widget-input').empty() 
    var transportForm = $('<div class="form-group">')
    transportForm.append($('<label for="select-form>Please Select a Station</label>'))

    // ID for the Station Input

    var transportSelect = ($('<select class ="form-control" id = "select-form">'))
    transportSelect.append($('<option value="Station-1">Station One</option>'))
    transportSelect.append($('<option value="Station-2">Station Two</option>'))
    transportForm.append(transportSelect)
    $('#widget-input').append(transportForm)

    $('#widget-button').empty()
    var transportButton = $('<button type = "button" class="btn btn-primary" id = "submit-transport">Submit</button>')
    $('#widget-button').append(transportButton)

    $('#transport-submit').on('click', function(event) {
        event.preventDefault()

        var stationInput = $('option').val()
        console.log(stationInput)
    })
})

// $('#submit-transport').on('click', function() {
//     $('#transport-table').show()
//     var row = $('<tr>');
//     row.append($('<td>').text('Train T'))
//     row.append($('<td>').text('On Time'))
//     $('table').append(row)
// });
    
    // for (i=0;i<train.length;i++) {
    //     var contentData = $('<th>'+train[i]+'</th><th>'+status[i]+'</th>')
    //     contentRowData.append(contentData)
    // }
    // $('#transport-table').show()

    // Appending items to table
    
    // $('table').append(contentRowHeader)
    // $('table').append(contentRowData)

// WEATHER TAB //

$('#weather-tab').on('click',function() {
   
    $('#widget-title').text('Weather');
    $('#widget-input').empty() 
    var weatherInput = $('<label for="location-input">Please Enter a Location</label>') 
    weatherInput.append($('<input type="text" id = "location-input" placeholder="city,country">'))
    $("#widget-input").append(weatherInput)

    $('#widget-button').empty();
    var weatherButton = ('<button type = "button" class="btn btn-primary" id = "location-submit">Submit</button>')
    $('#widget-button').append(weatherButton)

    $('#widget-display').empty()

    $('#location-submit').on('click',function(event) {
     
        event.preventDefault();

        var locationInput = $('#location-input').val().trim()
        console.log(locationInput)
        // This is our API key. Add your own API key between the ""
        var APIKey = "fb510d3360292806c424e84f2751add1";

        // Here we are building the URL we need to query the database
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+locationInput+"&appid=" + APIKey;

        // We then created an AJAX call
        $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response) {
        console.log(response)

        var kelvin = response.main.temp

        var fah = (kelvin-273.15)*1.80+32
        var locationTag = $('<h3>')
        locationTag.append(locationInput)

        
        $('#widget-display').append(locationTag)
        var tempTag = $('<p>')
        tempTag.append('Temperature: '+fah)
        $('#widget-display').append(tempTag)

        });
    })
})

$('#events-tab').on('click',function() {
    var title = $('<h1>')
    title.text('Events')
    $('.card-title').html(title);
})

$('#food-tab').on('click',function() {
    
    var title = $('<h1>')
    title.text('Food')
    $('.card-title').html(title);

    $('#food-submit').on('click',function(event) {
     
        event.preventDefault();

        var foodInput = $('#food-input').val().trim()
        console.log(foodInput)
        // This is our API key. Add your own API key between the ""
        var APIKey = "bnRdt6tABPwVy-_r8VJsslJ50Fpx44t18Ks5srqJTsQxv2cHZuB_UqX1Fp0XSKJVmjGIQkMRgEm-ve7qXU1I3yX0xNvH_IJo-h83WtIhb9DfhHIXcaW0l_zPQ9_9XHYx";

        // Here we are building the URL we need to query the database
        var queryURL = "https://api.yelp.com/v3/businesses/search?&location="+foodInput
        console.log(queryURL)
        var heroku = 'https://cors-anywhere.herokuapp.com/'
        // We then created an AJAX call
        $.ajax({
        url: heroku+queryURL,
        headers: {
            'Authorization': 'Bearer '+APIKey
        },
        method: "GET"
        }).then(function(response) {
        console.log(response)
        
        var business = response.businesses
        for (var i = 0;i< business.length;i++) {
            var businessName = response.businesses[i].name
            var businessImage = response.businesses[i].image_url
            
            var businessImageDiv = $('<img src ='+ businessImage+'>')
            
            
            var businessDiv = $('<h4>')
            businessDiv.append(businessName)
            
            $('#foodDisplay').append(businessDiv)
            $('#foodDisplay').append(businessImageDiv)
        }

        });

    })
})


/*

        AUTHENTICATION VARIABLES

*/


//Configurations for storage
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDJv0Jv2KLKENhptp1oyNhsJj6bxs2chZw",
    authDomain: "planner-sr.firebaseapp.com",
    databaseURL: "https://planner-sr.firebaseio.com",
    projectId: "planner-sr",
    storageBucket: "planner-sr.appspot.com",
    messagingSenderId: "399554524355",
    appId: "1:399554524355:web:fd94dfd4f9eedd9e"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

/*   Global Variables   */
const auth = firebase.auth();
const database = firebase.database();

//Account buttons
var btnSignUp = $("#authSignUp");
var btnLogin = $("#authLogin");
var btnLogOut = $("#sign-out");

//Shows account errors and user notes. Can be separated if needed.
var txtEmail = $("#exampleInputEmail1");
var txtPassword = $("#exampleInputPassword1");
var authPrompt = $("#authPrompt");

var notesPrompt = $("#notesPrompt")
//User data 
var addNoteForm = $("#addNoteForm");
var addNote = $("#addNote");

//Remove Notes Btn
var noteBtn = $("#noteBtn");

//-------------------------------Authentication----------------------//

//Creating an account
btnSignUp.on('click', () => {
    const email = txtEmail.val().trim();
    const pass = txtPassword.val().trim();

    auth.createUserWithEmailAndPassword(email, pass).then(user => {
        database.ref("/users").child(auth.currentUser.uid).update({
            email: user.email,
            notes: ["Welcome to your notes!"],
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        })
    }).catch(err => {
        console.log(err);
        if (err.code === "auth/weak-password") authPrompt.text(err.message)
        else if (err.code === "auth/email-already-in-use") authPrompt.text("Email already in use!")
    })

})

//Logging into an account
btnLogin.on('click', () => {
    const email = txtEmail.val().trim();
    const pass = txtPassword.val().trim();
    auth.signInWithEmailAndPassword(email, pass).catch(err => {
        console.log(err);
        if (err.code === "auth/user-not-found") authPrompt.text("New email detected. Make sure you have registered first!")
        else if (err.code === "auth/wrong-password") authPrompt.text("Invalid password.")
        else if (err.code === "auth/invalid-email") authPrompt.text("Invalid email format.")
        else if (err.code === "auth/wrong-password") authPrompt.text("Invalid password.")
    });
})

//Log out of the site
btnLogOut.on('click', () => {
    if (auth.currentUser) {
        auth.signOut();
        console.log('logged out')
    }
    else {
        $("#exampleModal").modal("show")
    }
})

// --------------------------- User Notes ----------------------------//

//When a user signs in/out listener
auth.onAuthStateChanged(user => {
    if (user) {
        btnLogOut.text("Logout")
        $("#exampleModal").modal('hide');
        authPrompt.text("Planner App")
        console.log("User has now logged in.");

        //Get the current user data obj
        var userData;
        database.ref("/users").orderByChild("email").equalTo(auth.currentUser.email).once('value')
            .then(function (snapshot) {
                userData = Object.values(snapshot.val())[0];
                //Convert the object to a list of numbered notes and display it to the screen
                var userNotes = userData.notes.map((perNote, index) => ((index + 1) + ". " + perNote)).join("<br>");
                notesPrompt.html(`Welcome ${userData.email.split("@")[0]}, here are your notes: <br><br>${userNotes}`);
            })

    } else {
        notesPrompt.empty();
        btnLogOut.text("Login")
        console.log("User has now logged out.");
        authPrompt.text("Please Log in!")
    }
})
// ------------------------End Of Authentication----------------------//

/**
 * 
 * @param {String} type decides which usage to execute.
 * 
 * @param {String or Integer} note holds the new note phrase, 
 * or the index of the note to be deleted.
 * 
 * Function uses the type during function execution to decide 
 * whether the user is adding a new note from a fill-in form, 
 * or deleting a note from a button click. Then, the new object 
 * is updated and automatically updated on screen
 */
function updateUserNotes(type, note) {
    var userData;
    database.ref("/users").orderByChild("email").equalTo(auth.currentUser.email).once('value')
        .then(function (snapshot) {
            userData = Object.values(snapshot.val())[0];
            if (type === "add") userData.notes.push(note);
            else userData.notes.splice(note, 1);
            addNote.val("");

            database.ref("/users").child(auth.currentUser.uid).update({
                notes: userData.notes
            });
        })
}

var newNote = ""; //Adding a new note into our list
addNoteForm.submit(function (event) {
    event.preventDefault();
    updateUserNotes("add", addNote.val().trim());
});

$(".btn").on("click", function (event) {
    event.preventDefault();
})

//-------------------------End of User Notes ----------------------------//

//End of file
