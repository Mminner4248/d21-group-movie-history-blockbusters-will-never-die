"use strict";
console.log("user toggles, yo!");


//this code makes the buttons in the user view work
let $ = require('jquery'),
    movieTemplate = require("../templates/movie-card.hbs"),
    handlebarHelper = require("./hbsHelpers.js"),
    firebase= require("./firebase.js");

let toggleObject = {};

//display items from watchlist to the DOM
$("#unwatched").on("click", function(){
    $(".range-field").addClass("is-hidden");
    console.log("Display items from watchlist to the DOM");
    $("#userMovies").html(" ");
    toggleObject = {};
    firebase.getWatchList()
    .then(function(data){
        let userData = Object.keys(data);
        userData.forEach((item, index)=>{
            if (data[item].watched === false){
                toggleObject[index] = data[item];
            }
        });
    })
    .then((data) => {
        $("#userMovies").append(movieTemplate(toggleObject));
    });
});

//display items from watchED to the DOM
$("#watched").click(function(){
    $(".range-field").removeClass("is-hidden");
    console.log("Display items from watchED to the DOM");
    $("#userMovies").html(" ");
    toggleObject = {};
    firebase.getWatchList()
    .then(function(data){
        let userData = Object.keys(data);
        userData.forEach((item, index)=>{
            if (data[item].watched === true){
                toggleObject[index] = data[item];
            }
        });
    })
    .then((data) => {
        $("#userMovies").append(movieTemplate(toggleObject));
    });
});

//display ALL MOVIES IN USER FB to the DOM
$("#allMovies").click(function(){
    console.log("Display ALL MOVIES");
    $("#userMovies").html(" ");
    firebase.getWatchList()
    .then((data) => {
        $("#userMovies").append(movieTemplate(data));
    });
});

$("#ratingSlider").change(function(){
    $("#userMovies").html(" ");
    toggleObject = {};
    var starRating = $("#ratingSlider").val();
    firebase.getWatchList()
    .then(function(data){
        let keys = Object.keys(data);
        keys.forEach((item, index)=>{
                //input is a string so no triple ===
                if(starRating == data[item].rating){
                toggleObject[index] = data[item];
            }
        });
    })
    .then((data) => {
        $("#userMovies").append(movieTemplate(toggleObject));
    });
});