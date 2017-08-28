"use strict";
console.log("user toggles, yo!");

$ = require('jquery');

$("#unwatched").on("click", function(){
    $("#ratingSlider").hide();
});