"use strict";

let $ = require('jquery');
let Handlebars = require('hbsfy/runtime');
let movieFactory = require("./api.js");

Handlebars.registerHelper('incrementer', (value) => parseInt(value) + 1);
Handlebars.registerHelper("castArray", () => {
  console.log("This is working");
  let mvObj = movieFactory.getMovies();
  let castName = "";

  for (var i = 0; i < 5; i++) {
    castName = mvObj.credits.cast[i].name;
  }
  return castName;
});

$(document).ready(function(){
// the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
		$('.modal').modal();
});
