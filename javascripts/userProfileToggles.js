"use strict";
console.log("user toggles, yo!");

let $ = require('jquery');

$("#unwatched").on("click", function(){
    $(".range-field").fadeOut(1000).addClass("is-hidden");
});

$("#watched").click(function(){
    $(".range-field").fadeIn(2000).removeClass("is-hidden");

});