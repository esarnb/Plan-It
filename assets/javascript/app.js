
/**
 *  To Do: 
 *      Convert alert() and confirm() to modals
 *      Need to add more weather data.
 * 
 *  Fix: Transportation Submit, Food Submit.
 *          
 * 
 * Finished: 
 *      Notes and Authentication
*/

var widgetTop = $("#widget-display-top");
// Notes Tab

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
 * is updated to firebase.
 */
function updateUserNotes(type, note) {
    database.ref("/users").orderByChild("email").equalTo(auth.currentUser.email).once('value')
    .then(function (snapshot) {
        var userData = Object.values(snapshot.val())[0];
        if (!userData.notes) userData.notes = []; 
        if (type === "add") userData.notes.push(note);
        else if (type === "remove") userData.notes.splice(note, 1);

        database.ref("/users").child(auth.currentUser.uid).update({
            notes: userData.notes
        });
    })
}

$('#notes-tab').on('click', function () {
    if (!auth.currentUser) {
        alert("You need to first sign in!");
        return;
    }
    $('#widget-title').text('Notes');
    $('#widget-input').empty();
    $('#widget-button').empty();
    $('#widget-display').empty();

    var textArea = $('<div class="form-group">')
    textArea.append("<br>")
    textArea.append($('<label for="comment">Comment:</label>'))
    textArea.append($('<textarea class="form-control" rows="1" id = "comment"></textarea>'))
    
    $('#widget-input').append(textArea)

    var commentTextBox = $("#comment");
    var textButton = $('<button type = "button" class="btn btn-primary" id = "submit-text">Submit</button>')
    $('#widget-button').append(textButton)

    var notesSubmitButton = $("#submit-text")

    var textArray;
    database.ref("/users").orderByChild("email").equalTo(auth.currentUser.email).on("value", function(snapshot) {
        textArray = Object.values(snapshot.val())[0].notes;
        if (!textArray) { updateUserNotes("add", "Welcome to your notes!") }
        else {
            textArray = textArray.map((perNote, index) => ((index + 1) + ". " + perNote+"<br><br>").replace("\n", "<br>"));
            $('#widget-display-top').empty()        
            for (var i = 0; i < textArray.length; i++) {
                var p = $('<p>')
                p.append(textArray[i])
                p.addClass("clickTextDelete")
                p.attr("data-position", i)
                $('#widget-display-top').append(p)
            }
        }
    });

    $(document).on('click', '.clickTextDelete', function() {
        if(!auth.currentUser) location.reload();        
        var confirmed = confirm("Would you like to delete this text?");
        if (confirmed) updateUserNotes("remove", $(this).attr("data-position"))
    });

    notesSubmitButton.on('click', function (event) {
        event.preventDefault();
        if(!auth.currentUser) location.reload();
        var textInput = commentTextBox.val().trim()
        if (textInput) {
            updateUserNotes("add", textInput)
        }
        commentTextBox.val("")
    })        
    
})

//////////////////////////////////////////////Working Above, Need to fix Below//////////////////////////////////////////////

// TRANSPORTATION TAB //
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
// // On click, the transportation tab will show
var antiSFmilbrae = "#f1e64b3f";
$('#transport-tab').on('click', function () {
    stationNameButton();
    widgetTop.empty();
    $("#widget-display").empty()
    // The title will be Transportation and added to the id widget title

    $('#widget-title').text('Transportation');

    //ELEMENTS
    $('#widget-input').empty()
    var transportForm = $('<div class="form-group">')
    transportForm.append($('<label for="select-form>Please Select a Station</label>'))

    // ID for the Station Input

    var transportSelect = ($('<select class ="form-control" id = "select-form">'))
    transportForm.append(transportSelect)
    $('#widget-input').append(transportForm)

    $('#widget-button').empty()
    var transportButton = $('<button type = "button" class="btn btn-primary" id = "submit-transport">Submit</button>')
    $('#widget-button').append(transportButton)

    // var transTable = $("<thead>");
    // transTable.append(transRow)
    // var transHead = $("<th>")
    

    $('#submit-transport').on('click', function (event) {
        event.preventDefault()
        $("#widget-display").empty()
        var namesQuery = "http://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V&json=y";
        var pickedPlace = $("#select-form").val().trim();
        $.ajax({
            url: namesQuery,
            method: "GET"
        })
            .then(function (response) {
                console.log(response);
                var jsObjects = response.root.stations.station
                var result = jsObjects.filter(obj => {
                    return obj.name === pickedPlace
                })
                var abbrev = result[0].abbr;
                console.log(abbrev);
                /////////Second Query////////
                var abbrQuery = "http://api.bart.gov/api/etd.aspx?cmd=etd&orig=" + abbrev + "&key=MW9S-E7SL-26DU-VV8V&json=y";
                $.ajax({
                    url: abbrQuery,
                    method: "GET"
                })
                    .then(function (response) {
                        // console.log("180 LOG");
                        
                        var trainTypes = response.root.station[0].etd
                        // console.log(`Train Types: ${trainTypes}`);
                        var transTable = $("<table>").addClass("table")
                        transTable.addClass("table-bordered");

                        var transHead = $("<thead>");
                        var transR = $("<tr>").addClass("customColor");
                        transR.addClass("font-weight-bold")
                        // transR.addClass("")
                        transR.append($("<th>").text("Train Types"))
                        transR.append($("<th>").text("Minutes Away"))
                        transR.append($("<th>").text("Platform"))
                        transR.append($("<th>").text("Train Cars Length"))
                        transR.append($("<th>").text("Direction Headed"))
                        transHead.append(transR);
                        transTable.append(transHead);
                        $("widget-display").append(transTable);
                        
                        for (var i = 0; i < trainTypes.length; i++) {
                            // console.log("185 LOG");
                            for(var j = 0; j < trainTypes[i].estimate.length; j++) {
                            // console.log("187 LOG");
                            var transRow = $(`<tr style=background-color:${trainTypes[i].estimate[j].hexcolor+"3f"}>`)
                                transRow.append($("<td>").text(`${trainTypes[i].destination} Train: ${j+1} `))
                                transRow.append($("<td>").text(trainTypes[i].estimate[j].minutes))
                                transRow.append($("<td>").text(trainTypes[i].estimate[j].platform))
                                transRow.append($("<td>").text(trainTypes[i].estimate[j].length))
                                transRow.append($("<td>").text(trainTypes[i].estimate[j].direction))
                            console.log(transRow);
                            transTable.append(transRow)
                        }
                    } 
                    $("#widget-display").append(transTable)
                        
                        
                        // $("#transport-table").text(bartInfo)


                    })
            })
    })
})


// WEATHER TAB //
$('#weather-tab').on('click', function () {
    $("#widget-display").empty()
    $('#widget-display-top').empty()
    $('#widget-title').text('Weather');
    $('#widget-input').empty()
    var weatherInput = $('<label for="location-input">Please Enter a Location</label>')
    weatherInput.append($('<input type="text" id = "location-input" placeholder="city,country">'))
    $("#widget-input").append(weatherInput)
    $('#widget-button').empty();
    var weatherButton = ('<button type = "button" class="btn btn-primary" id = "location-submit">Submit</button>')
    $('#widget-button').append(weatherButton)
    $('#location-submit').on('click', function (event) {
        event.preventDefault();
        $('#widget-display').empty()
        $('#widget-display-top').empty()
        var locationInput = $('#location-input').val().trim()
        console.log(locationInput)
        // This is our API key. Add your own API key between the ""
        var APIKey = "fb510d3360292806c424e84f2751add1";
        // Here we are building the URL we need to query the database
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + locationInput + "&appid=" + APIKey;
        var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + locationInput + "&appid=" + APIKey;
        // We then created an AJAX call
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response)
            var kelvin = response.main.temp
            var fah = (kelvin - 273.15) * 1.80 + 32
            var locationTag = $('<h3>')
            locationTag.append(locationInput)
            $('#widget-display').append(locationTag)
            var tempTag = $('<p>')
            tempTag.append('Current Temperature: ' + fah.toFixed(1) + '℉')
            $('#widget-display').append(tempTag)

            $.ajax({
                url: forecastURL,
                method: "GET"
            }).then(function (response) {
                console.log(response)
                var forecastDiv = $('<div>')
                var tempList = [response.list[4].main.temp, response.list[12].main.temp, response.list[20].main.temp, response.list[28].main.temp, response.list[36].main.temp]
                var fahList = []
                for (var i = 0; i < tempList.length; i++) {
                    var fah = (tempList[i] - 273.15) * 1.80 + 32
                    fah = fah.toFixed(1)
                    fahList.push(fah)
                }
                console.log(fahList)
                var forecastList = [];
                var forecast1 = ($('<p>' + response.list[4].dt_txt.substring(0, 11) + "<br>" + fahList[0] + '℉</p>'))
                var forecast2 = ($('<p>' + response.list[12].dt_txt.substring(0, 11) + "<br>" + fahList[1] + '℉</p>'))
                var forecast3 = ($('<p>' + response.list[20].dt_txt.substring(0, 11) + "<br>" + fahList[2] + '℉</p>'))
                var forecast4 = ($('<p>' + response.list[28].dt_txt.substring(0, 11) + "<br>" + fahList[3] + '℉</p>'))
                var forecast5 = ($('<p>' + response.list[36].dt_txt.substring(0, 11) + "<br>" + fahList[4] + '℉</p>'))
                forecastList.push(forecast1, forecast2, forecast3, forecast4, forecast5);
                console.log(forecastList);
                var cardDeckForfast = ($("<div>").addClass("card-deck"));
                for (var i = 0; i < forecastList.length; i++) {
                    cardForfast = ($("<div>").addClass("card"));
                    var cardBody = ($("<div>").addClass("card-body"));
                    var cardTitle = ($("<h5>").addClass("card-title"));
                    cardTitle.append(forecastList[i]);
                    var cardText = ($("<div>").addClass("card-text"));
                    cardBody.append(cardTitle);
                    cardBody.append(cardText);
                    cardForfast.append(cardBody);
                    cardDeckForfast.append(cardForfast);
                    forecastDiv.append(cardDeckForfast);
                    $('#widget-display').append(forecastDiv)
                }
            });
        });
        
    })
})

// $('#events-tab').on('click', function () {
//     var title = $('<h1>')
//     title.text('Events')
//     $('.card-title').html(title);
// })


// Food Tab Start
var userLongitude;
var userLatitude;
var businessDiv;
var businessImageDiv;


function getLocal() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geoloction not available")
    }

    function showPosition(position) {
        userLongitude = position.coords.longitude;
        userLatitude = position.coords.latitude
    }

}

// if (userLongitude) {
//     var queryURL = "https://api.yelp.com/v3/autocomplete?text=del&latitude=" + userLatitude + "&longitude=" + userLongitude;
//     console.log(queryURL)
// } else {
    https://api.yelp.com/v3/autocomplete?text=del&latitude=37.786882&longitude=-122.399972
$('#food-tab').on('click', function () {
    widgetTop.empty();
    getLocal();
    var title = $('<h1>')
    title.text('Food')
    $('.card-title').html(title);
    getLocal();
    $("#widget-title").text("Food");

    //ELEMENTS
    $("#widget-input").empty()
    var foodInput = $("<label for='food-input'>Please Enter a Location (for food)</label>")
    foodInput.append($("<input type='text' id='food-input' placeholder='city, country'>"))
    $("#widget-input").append(foodInput)

    $("#widget-button").empty();
    var foodButton = $("<div class='col-auto my-1'>")
    foodButton.append("<button type = 'button' class='btn btn-primary' id = 'food-submit'>Submit</button>")
    $("#widget-button").append(foodButton)

    $("#widget-display").empty()

    $("#widget-display").append(businessDiv)
    $("#widget-display").append(businessImageDiv)

     $('#food-submit').on('click', function (event) {
        widgetTop.empty();

        event.preventDefault();

        var foodInput = $('#food-input').val().trim()
        console.log(foodInput)
        // This is our API key. Add your own API key between the ""
        var APIKey = "bnRdt6tABPwVy-_r8VJsslJ50Fpx44t18Ks5srqJTsQxv2cHZuB_UqX1Fp0XSKJVmjGIQkMRgEm-ve7qXU1I3yX0xNvH_IJo-h83WtIhb9DfhHIXcaW0l_zPQ9_9XHYx";

        // Here we are building the URL we need to query the database
        var queryURL = "https://api.yelp.com/v3/businesses/search?&location=" + foodInput
        console.log(queryURL)
        var heroku = 'https://cors-anywhere.herokuapp.com/'
        // We then created an AJAX call
        $.ajax({
            url: heroku + queryURL,
            headers: {
                'Authorization': 'Bearer ' + APIKey
            },
            method: "GET"
        }).then(function (response) {
            console.log(response)

            var business = response.businesses
            for (var i = 0; i < business.length; i++) {
                var businessName = response.businesses[i].name
                var businessImage = response.businesses[i].image_url

                var businessImageDiv = $('<img src =' + businessImage + ' style = widgth = "200px" height = "200px">')


                var businessDiv = $('<h4>')
                businessDiv.append(businessName)

                $('#widget-display').append(businessDiv)
                $('#widget-display').append(businessImageDiv)
            }

        });

    })
    // --------------------------------------------------  Geolocation -------------------------------------- //
    
    var queryURL = "https://api.yelp.com/v3/autocomplete?text=del&latitude=" + 37.786882 + "&longitude=" + -122.399972;
            console.log(queryURL)
            var APIKey = "bnRdt6tABPwVy-_r8VJsslJ50Fpx44t18Ks5srqJTsQxv2cHZuB_UqX1Fp0XSKJVmjGIQkMRgEm-ve7qXU1I3yX0xNvH_IJo-h83WtIhb9DfhHIXcaW0l_zPQ9_9XHYx";
            var heroku = 'https://cors-anywhere.herokuapp.com/'
            $.ajax({
                url: heroku + queryURL,
                headers: {
                    'Authorization': 'Bearer ' + APIKey
                },
                method: "GET"
            }).then(function (response) {
                console.log(JSON.stringify(response));
                
            })
    $("ownLocationButton").on('click', function(event) {
        if (userLongitude) {
            var queryURL = "https://api.yelp.com/v3/autocomplete?text=del&latitude=" + 37.786882 + "&longitude=" + -122.399972;
            console.log(queryURL)
            var APIKey = "bnRdt6tABPwVy-_r8VJsslJ50Fpx44t18Ks5srqJTsQxv2cHZuB_UqX1Fp0XSKJVmjGIQkMRgEm-ve7qXU1I3yX0xNvH_IJo-h83WtIhb9DfhHIXcaW0l_zPQ9_9XHYx";
            var heroku = 'https://cors-anywhere.herokuapp.com/'
            $.ajax({
                url: heroku + queryURL,
                headers: {
                    'Authorization': 'Bearer ' + APIKey
                },
                method: "GET"
            }).then(function (response) {
                console.log(response);
                
            })
        } else {
            $('#food-submit').click()
        }
     })

})


/*

        AUTHENTICATION VARIABLES

*/
var btnSignUp = $("#authSignUp");
var btnLogin = $("#authLogin");
var btnLogOut = $("#sign-out");

//Shows account errors and user notes. Can be separated if needed.
var txtEmail = $("#exampleInputEmail1");
var txtPassword = $("#exampleInputPassword1");
var authPrompt = $("#authPrompt");

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

//When a user signs in/out listener
auth.onAuthStateChanged(user => {
    if (user) {
        btnLogOut.text("Logout")
        $("#exampleModal").modal('hide');
        authPrompt.text("Planner App")
        console.log("User has now logged in.");

        // //Get the current user data obj
        // var userData;
        // database.ref("/users").orderByChild("email").equalTo(auth.currentUser.email).once('value')
        //     .then(function (snapshot) {
        //         userData = Object.values(snapshot.val())[0];
        //         //Convert the object to a list of numbered notes and display it to the screen
        //         var userNotes = userData.notes.map((perNote, index) => ((index + 1) + ". " + perNote)).join("<br>");
        //     })

    } else {
        btnLogOut.text("Login")
        console.log("User has now logged out.");
        authPrompt.text("Please Log in!")

    }
})
// ------------------------End Of Authentication----------------------//

//End of file
