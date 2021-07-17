//Begin JS for index.html//

//Dynamic time across all tabs
setInterval(function(){
    $("#dynamicTime").text(moment().format("dddd, MMMM Do, hh:mm:ss A"))
}, 1000)

$(document).keypress('#comment', function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13') $("#submit-text").click()
});

$(document).keypress('#location-input', function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13') $("#location-submit").click()
});

$(document).keypress('#food-input', function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13') $("#food-submit").click()
});

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
        else if(type === 'replace') {
            var edit = $('#edit-comment').val().trim()
            userData.notes.splice(note,1,edit);
            $('#edit-comment').val("")
        }
        else if (type === "remove") userData.notes.splice(note, 1);

        database.ref("/users").child(auth.currentUser.uid).update({
            notes: userData.notes
        });
    })
}

////////////////////////////////////////////////

$('#widget-display').empty()
$('#widget-display-top').empty()

// Here we are building the URL we need to query the database
var queryURL = "https://favqs.com/api/qotd"
console.log(queryURL);

// We then created an AJAX call
$.ajax({
    url: queryURL,
    method: "GET"
}).then(function (response) {
    console.log(response)
    var quoteInfo = response.quote;
    var h = $('<h2>')
    var p = $('<p id ="author">')
    h.text('"'+quoteInfo.body+'"')
    p.text('-'+quoteInfo.author+'-')
    $('#widget-display-top').append('<hr>')
    $('#widget-display-top').append(h)
    $('#widget-display-top').append('<hr>')
    $('#widget-display-top').append(p)
})
////////////////////////////////////////////////

//Notes Tab
$('#notes-tab').on('click', function () {
    
    //Special case if not signed in, confirm will close modal.
    //The rest of the modals are 
    $(document).on('click', '.confirm-button', function() {
        if ($(this).val() === "signError") {
            $("#SignErrorModal").modal("hide");
        }
    })
    
    if (!auth.currentUser) {
        $("#SignErrorModal").modal('show');        
        return;
    }
    $('#widget-title').text('Notes');
    $('#widget-input').empty();
    $('#widget-button').empty();
    $('#widget-display').empty();

    var textArea = $('<div class="form-group">')
    textArea.append("<br>")
    textArea.append($('<label for="comment">Add Note</label>'))
    textArea.append($('<textarea class="form-control bg-light border" rows="1" id = "comment"></textarea>'))
    
    $('#widget-input').append(textArea)

    var commentTextBox = $("#comment");
    var textButton = $('<button type = "button" class="btn btn-light border" id = "submit-text">Submit</button>')
    $('#widget-button').append(textButton)

    var notesSubmitButton = $("#submit-text")

    var textArray, deleteOrEdit;
    database.ref("/users").orderByChild("email").equalTo(auth.currentUser.email).on("value", function(snapshot) {
        textArray = Object.values(snapshot.val())[0].notes;
        
        if (!textArray) { $('#widget-display-top').text('Welcome to your Notes!')}
        else {
            textArray = textArray.map((perNote, index) => ((index + 1) + ". " + perNote+"").replace("\n", "<br>"));
            $('#widget-display-top').empty()        

            // Here I we change the width of the card
            var notesCard = $('<div id = "note-card">').addClass('card w-50');
            var notesCardBody = $("<div id ='note-body'>").addClass("card-body");
            var notesCardTitle = $("<h5>").addClass("card-title")
            var notesCardText = $("<div>").addClass("card-text")
            

            for (var i = 0; i < textArray.length; i++) {
                var p = $('<p class="note" data-position = '+i+'>')
                p.append(textArray[i])
                notesCardText.append(p)
                notesCardText.append('<br>')
            }
    
            notesCardTitle.append(notesCardText)
            notesCardBody.append(notesCardTitle)
            notesCard.append(notesCardBody)
            $('#widget-display-top').append(notesCard)
            $('.delete-button').hide()
            $('.edit-button').hide()


            // on hover, we want to append a delete or edit button that the user can select


            $('.note').hover(function(){
                
                // appending the edit button on hover
                $(this).append($(`<button class = "btn btn-light border edit-button rounded" data-position=`+ $(this).attr('data-position') +` data-toggle="modal" data-target="#editModal">&#128463</button>`))

                // appending the delete button on hover
                $(this).append($(`<button class = "btn btn-light border delete-button rounded" data-position=`+ $(this).attr('data-position') +` data-toggle="modal" data-target="#deleteModal">&#128465</button>`))
               
               
            }, function () {

                // Here I remove both of the buttons when I move the cursor off of it
                $(this).find('button:last').remove();
                $(this).find('button:last').remove();
            })
        }
    });
    $(document).on('click', '.delete-button' , function() { deleteOrEdit = $(this).attr('data-position') })
    $(document).on('click', '.edit-button' , function() { deleteOrEdit = $(this).attr('data-position') })
    $(document).on('click', '.confirm-button', function() {
        
        if ($(this).val()==="deleting") {
            updateUserNotes("remove", deleteOrEdit)
            $('#deleteModal').modal('hide')
        }
        else if ($(this).val() === "editing") {
            updateUserNotes("replace", deleteOrEdit)
            $('#editModal').modal('hide')
        }
        else if ($(this).val() === "signError") {
            $("#SignErrorModal").modal("hide");
        }
    })
    
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

// TRANSPORTATION TAB //

function stationNameButton() {

    $.ajax({
        url: "https://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V&json=y",
        method: "GET"
    })
        .then(function (response) {
            var stationName = response.root.stations.station;
            
            for (var i = 0; i < stationName.length; i++) {

                var statName = response.root.stations.station[i].name;
                
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
    var transportButton = $('<button type = "button" class="btn btn-light border" id = "submit-transport">Submit</button>')
    var bartmapBtn = $('<button type="button" id="mapbutton" class="btn btn-primary" data-toggle="modal" data-target="#mapmodal"></button><div class="modal fade mapmodal" id="mapmodal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true"><div class="modal-dialog modal-lg"><div class="modal-content"><img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/BART_web_map_effective_September_2018.png" height = "500px" width = "800px"></img></div></div></div>')

    $('#widget-button').append(transportButton)
    $('#widget-title').append("  ")
    $('#widget-title').append(bartmapBtn)

    // var transTable = $("<thead>");
    // transTable.append(transRow)
    // var transHead = $("<th>")
    

    $('#submit-transport').on('click', function (event) {
        event.preventDefault()
        $("#widget-display").empty()
        var namesQuery = "https://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V&json=y";
        var pickedPlace = $("#select-form").val().trim();
        $.ajax({
            url: namesQuery,
            method: "GET"
        })
            .then(function (response) {
                
                var jsObjects = response.root.stations.station
                var result = jsObjects.filter(obj => {
                    return obj.name === pickedPlace
                })
                var abbrev = result[0].abbr;
                
                /////////Second Query////////
                var abbrQuery = "https://api.bart.gov/api/etd.aspx?cmd=etd&orig=" + abbrev + "&key=MW9S-E7SL-26DU-VV8V&json=y";
                $.ajax({
                    url: abbrQuery,
                    method: "GET"
                })
                    .then(function (response) {
                        
                        
                        var trainTypes = response.root.station[0].etd
                       
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
                        if (!trainTypes){
                            $('#widget-display').append("Error: There are no trains at this time")
                            return;
                        }
                        for (var i = 0; i < trainTypes.length; i++) {
                            for(var j = 0; j < trainTypes[i].estimate.length; j++) {
                            var transRow = $(`<tr style=background-color:${trainTypes[i].estimate[j].hexcolor+"10"}>`)
                                transRow.append($("<td>").text(`${trainTypes[i].destination} Train: ${j+1} `))
                                transRow.append($("<td>").text(trainTypes[i].estimate[j].minutes))
                                transRow.append($("<td>").text(trainTypes[i].estimate[j].platform))
                                transRow.append($("<td>").text(trainTypes[i].estimate[j].length))
                                transRow.append($("<td>").text(trainTypes[i].estimate[j].direction))
                            transTable.append(transRow)
                        }
                    } 
                    $("#widget-display").append(transTable)
                        
                        
                        // $("#transport-table").text(bartInfo)


                    })
            })
    })
})

function kelvin2Fahrenheit(kelvinTemp) {
    return ((((kelvinTemp - 273.15) * (9/5)) + 32).toFixed(2)+"℉")

    
}

// WEATHER TAB 
$('#weather-tab').on('click', function () {
    $("#widget-display").empty()
    $('#widget-display-top').empty()
    $('#widget-title').text('Weather');
    $('#widget-input').empty()
    var weatherInput = $('<label for="location-input"></label>')
    weatherInput.append($('<input type="text" id = "location-input" placeholder="Enter a location">'))
    $("#widget-input").append(weatherInput)
    $('#widget-button').empty();
    var weatherButton = ('<button type = "button" class="btn btn-light border" id = "location-submit">Submit</button>')
    $('#widget-button').append(weatherButton)
    $('#location-submit').on('click', function (event) {
        //When user hits submit button after putting loction, start the loading icon
        $("#widget-display").append("<img src='' id='loadingWeather'>Loading...")

        event.preventDefault();
        $('#widget-display').empty()
        $('#widget-display-top').empty()
        var locationInput = $('#location-input').val().trim()
        if (!locationInput) return;
        // This is our API key. Add your own API key between the ""
        var APIKey = weatherApikey;
        // Here we are building the URL we need to query the database
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + locationInput + "&appid=" + APIKey;
        var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + locationInput + "&appid=" + APIKey;
        
        // We then created an AJAX call
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            var kelvin = response.main.temp
            var fah = kelvin2Fahrenheit(kelvin)
            var tempTag = $('<p>')
            tempTag.append('Current Temperature: ' + fah)
            $('#widget-display').append(tempTag)

            $.ajax({
                url: forecastURL,
                method: "GET"
            }).then(function (response) {
                var forecastDiv = $('<div>')
                var forecastList = [];
                var sum = 0, avg5Day=[];
                for(var i = 1; i <= response.list.length; i++) {
                    sum += response.list[i-1].main.temp
                    if (i % 8 == 0) {
                        avg5Day.push( kelvin2Fahrenheit((sum / 8)) )
                        sum = 0;
                    }
                }
       
                var eachday=[4, 12, 20, 28, 36];
                for(var j = 0; j < avg5Day.length; j++) {
                    if (response.list[eachday[j]].weather.main === "Cloudy") skyType = "assets/images/clouds.png"
                    else skyType = "assets/images/sun.png"
                    var day = $("<h3>");
                    day.append(moment(response.list[eachday[j]].dt_txt.substring(0, 11), "YY-MM-DD").format("dddd, MMM Do"))
                    day.append("<br><br>")
                    day.append($("<p>").text("Avg Temp: " + avg5Day[j]))
                    day.append("<br>")
                    day.append($("<p>").text("Humidity: " + response.list[eachday[j]].main.humidity + "%"));
                    day.append("<br>")
                    day.append($(`<img src='${skyType}' width= '100px' height= '100px'>`))
                    forecastList.push(day)
                }

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

                    //When data loads, erase loading prompt
                    $("#loadingWeather").remove();
                }
            });
        });
        
    })
})

// Food Tab // -----------------------------------------
var userLongitude;
var userLatitude;
var businessDiv;
var businessImageDiv;

$('#food-tab').on('click', function () {
    widgetTop.empty();
    var title = $('<h1>')
    title.text('Food')
    $('.card-title').html(title);
    $("#widget-title").text("Food");

    //ELEMENTS
    $("#widget-input").empty()
    var foodInput = $("<label for='food-input'></label>")
    foodInput.append($("<input type='text' id='food-input' placeholder='Enter a location'>"))
    $("#widget-input").append(foodInput)

    $("#widget-button").empty();
    var foodButton = $("<div class='col-auto my-1'>")
    foodButton.append("<button type = 'button' class='btn btn-light border' id = 'food-submit'>Submit</button>")
    $("#widget-button").append(foodButton)

    $("#widget-display").empty()

    $("#widget-display").append(businessDiv)
    $("#widget-display").append(businessImageDiv)

     $('#food-submit').on('click', function (event) {
        widgetTop.empty();
        $('#widget-display').empty()
        event.preventDefault();

        var foodInput = $('#food-input').val().trim()
        // This is our API key. Add your own API key between the ""
        var APIKey = foodApikey;

        // Here we are building the URL we need to query the database
        var queryURL = "https://api.yelp.com/v3/businesses/search?&location=" + foodInput
        var heroku = 'https://cors-anywhere.herokuapp.com/'
        // We then created an AJAX call
        $.ajax({
            url: heroku + queryURL,
            headers: {
                'Authorization': 'Bearer ' + APIKey
            },
            method: "GET"
        }).then(function (response) {
            var business = response.businesses
            
            var k = 0;
            var p = 0;
                        
            business.length > 18 ? business.length = 18 : business.length;

            for (var k = 0; k < (business.length); k++) {
        
                var cardDeckFood = ($("<div>").addClass("card-deck"));
                for (var j = 0; j < 3; j++) {
                    var businessName = response.businesses[p].name
                    var businessImage = response.businesses[p].image_url
                    var businessRatings = response.businesses[p].rating
                    var businessURL = response.businesses[p].url
                    p++;
                    var cardFood = ($("<div>").addClass("card"));

                    var cardImg = $("<img src = " + businessImage + ">").addClass("card-img-top thumbnailImg");

                    cardFood.append(cardImg);
                    
                    var cardBodyFood = ($("<div>").addClass("card-body"));
                    var cardTitleFood = ($("<div><a target = '_blank' href="+businessURL+">"+businessName+"</a></div>").addClass("card-title"));
                    var cardTextFood = ($("<div>").addClass("card-text"));
                    
                    cardTextFood.text("Rating: " + businessRatings);
                    cardBodyFood.append(cardTitleFood);
                    cardBodyFood.append(cardTextFood);
                    cardFood.append(cardBodyFood);
                    
                    cardDeckFood.append(cardFood);
                    $('#widget-display').append(cardDeckFood)    
                }
            }
        });

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
    apiKey: firebaseApikey,
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
        if (err.code === "auth/weak-password") authPrompt.text(err.message)
        else if (err.code === "auth/email-already-in-use") authPrompt.text("Email already in use!")
    })

})

//Logging into an account
btnLogin.on('click', () => {
    const email = txtEmail.val().trim();
    const pass = txtPassword.val().trim();
    auth.signInWithEmailAndPassword(email, pass).catch(err => {
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

    } else {
        btnLogOut.text("Login")
        authPrompt.text("Please Log in!")

    }
})
// ------------------------End Of Authentication----------------------//

//End of file