//Global Functions

//Functions










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
var displayPrompt = $("#displayPrompt");

//User data 
var localUser;
var addNote = $("#addNote");

//Remove Notes Btn
var noteBtn = $("#noteBtn");

//-------------------------------Authentication----------------------//

//Creating an account
btnSignUp.on('click', () => {
    const email = txtEmail.val().trim();
    const pass = txtPassword.val().trim();

    auth.createUserWithEmailAndPassword(email, pass).then(user => {
        database.ref("/users").push({
            email: user.email,
            notes: ["Welcome to your notes!"],
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        })
    }).catch(err => {
        console.log(err);
        if (err.code === "auth/weak-password") displayPrompt.text(err.message)
        else if (err.code === "auth/email-already-in-use") displayPrompt.text("Email already in use!")
    })

})

//Logging into an account
btnLogin.on('click', () => {
    const email = txtEmail.val().trim();
    const pass = txtPassword.val().trim();
    auth.signInWithEmailAndPassword(email, pass).catch(err => {
        console.log(err);

        if (err.code === "auth/user-not-found") displayPrompt.text("New email detected. Make sure you have registered first!")
        else if (err.code === "auth/wrong-password") displayPrompt.text("Invalid password.")
        else if (err.code === "auth/invalid-email") displayPrompt.text("Invalid email format.")
        else if (err.code === "auth/wrong-password") displayPrompt.text("Invalid password.")
    });
})

//Log out of the site
btnLogOut.on('click', () => {
    auth.signOut();
    console.log('logged out')
})

//When a user signs in/out listener
auth.onAuthStateChanged(user => {
    if (user) {
        localUser = user.email;
        /*Add/Remove a class "hide" for instant. */
        txtEmail.addClass("hide");
        txtPassword.addClass("hide");
        btnLogin.addClass("hide");
        btnSignUp.addClass("hide");
        btnLogOut.removeClass('hide')
        console.log(localUser + " has now logged in.");

        //Get the current user data obj
        var userData;
        database.ref("/users").orderByChild("email").equalTo(localUser).once('value')
            .then(function (snapshot) {
                userData = Object.values(snapshot.val())[0];
                //Convert the object to a list of numbered notes and display it to the screen
                var userNotes = userData.notes.map((perNote, index) => ((index + 1) + ". " + perNote)).join("\n");
                displayPrompt.html(`Welcome ${userData.email.split("@")[0]}, here are your notes: <br><br>${userNotes}`);
            })

    } else {
        //reset global-local user  
        localUser = null;
        txtEmail.removeClass("hide");
        txtPassword.removeClass("hide");
        btnLogin.removeClass("hide");
        btnSignUp.removeClass("hide");
        btnLogOut.addClass('hide')
        console.log("User has now logged out.");
        displayPrompt.text("Please Log in!")
    }
}) 
// ------------------------End Of Authentication----------------------//

// --------------------------- User Notes ----------------------------//
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
    database.ref("/users").orderByChild("email").equalTo(email).once('value')
        .then(function (snapshot) {
            userData = Object.values(snapshot.val())[0];
            if (type === "add") userData.notes.push(note);
            else userData.notes.splice(note, 1);

            /*
                ToDo: Set this new data back to the user list in firebase, 
                preferably with an update method and not a set method

                //Example
                var hopperRef = usersRef.child("gracehop");
                hopperRef.update({
                    "nickname": "Amazing Grace"
                });
            */
        })
}

//Adding a new note into our list
addNote.submit(function (event) {
    event.preventDefault();
    /*
        //ToDo: When a user hits enter in the textbox, accept it as a submit
        (So that we wont need a submit button)
    */
    updateUserNotes("add", addNote.val().trim());
});

//-------------------------End of User Notes ----------------------------//

//End of file
