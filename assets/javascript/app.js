//Global Functions

//Functions
// ajax call for calendarific api data on click
$("button").on("click", function() {

$.ajax({
    url: "https://calendarific.com/api/v2/holidays?&api_key=5aacde472af07a267319cf6071d535aa05e2a4d6",
    method: "GET"
  })
  .then(function(response) {
    console.log(response)

    var calResults = response.holidays

    $("#cal-results").text(calResults)

  })

})
// ajax call for bart api on click for user input current station
$("button").on("click", function() {
// user input destination variable, not sure if we are gonna use this or a dropdown with all the stations already listed
var bartDest = $(this).attr("data-bart");

bartQuery = "http://api.bart.gov/api/etd.aspx?cmd=etd&orig=" + bartDest + "&json=y";

$.ajax({
    url: bartQuery,
    method: "GET"
  })
  .then(function(root) {
    console.log(root)

    var bartResults = root

    $("#bart-results").text(bartResults)

  })

})
// function to display bart status
$(document).ready(function() {
    $.ajax({
        url: "http://api.bart.gov/api/bsa.aspx?cmd=bsa&json=y",
        method: "GET"
      })
      .then(function(root) {
      
        var bartStatus = root.bsa

        $("#bart-status").text(bartStatus)
    })

})









/* Above, Matt only works. Below, Esar only works.    Stubbing. */

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
var btnSignUp = $("#btnSignUp");
var btnLogin = $("#btnLogin");
var btnLogOut = $("#btnLogOut");

//Shows account errors and user notes. Can be separated if needed.
var txtEmail = $("#txtEmail");
var txtPassword = $("#txtPassword");
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
    auth.signOut();
    console.log('logged out')
})

// --------------------------- User Notes ----------------------------//

//When a user signs in/out listener
auth.onAuthStateChanged(user => {
    if (user) {
        /*Add/Remove a class "hide" for instant. */
        txtEmail.addClass("d-none");
        txtPassword.addClass("d-none");
        btnLogin.addClass("d-none");
        btnSignUp.addClass("d-none");
        btnLogOut.removeClass("d-none")
        addNote.removeClass("d-none")
        authPrompt.text("Planner App")
        console.log(auth.currentUser.email + " has now logged in.");

        //Get the current user data obj
        var userData;
        database.ref("/users").orderByChild("email").equalTo(auth.currentUser.email).once('value')
            .then(function (snapshot) {
                console.log(snapshot.val());
                
                userData = Object.values(snapshot.val())[0];
                //Convert the object to a list of numbered notes and display it to the screen
                var userNotes = userData.notes.map((perNote, index) => ((index + 1) + ". " + perNote)).join("<br>");
                notesPrompt.html(`Welcome ${userData.email.split("@")[0]}, here are your notes: <br><br>${userNotes}`);
            })

    } else {
        txtEmail.removeClass("d-none");
        txtPassword.removeClass("d-none");
        btnLogin.removeClass("d-none");
        btnSignUp.removeClass("d-none");
        btnLogOut.addClass("d-none")
        addNote.addClass("d-none")
        notesPrompt.empty();
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
            console.log(userData.notes);
            addNote.val("");
            console.log(auth.currentUser.uid);
            
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

$(".btn").on("click", function(event) {
    event.preventDefault();
}) 

//-------------------------End of User Notes ----------------------------//

//End of file
