"use strict";

let firebase = require('../lib/node_modules/firebase');
let provider = new firebase.auth.GoogleAuthProvider();
let currentUser = null;

firebase.auth().onAuthStateChanged((user) => {
    if (user){
        currentUser = user.uid;
        console.log("current user Logged in?", currentUser);
        $("#searchView").hide();
        $("#profileView").show();
    }else {
        currentUser = null;
        $("#mainSearchResults").html(" ");
        $("#profileView").hide();
        $("#searchView").show();
        console.log("current user NOT logged in:", currentUser);
    }
});

function logInGoogle() {
    //all firebase functions return a promise!! Add a then when called
    return firebase.auth().signInWithPopup(provider);
}

function logout(){
    return firebase.auth().signOut();
}
function getUser(){
    return currentUser;
}

function setUser(val){
    currentUser = val;
}

module.exports = {logInGoogle, logout, getUser, setUser};
