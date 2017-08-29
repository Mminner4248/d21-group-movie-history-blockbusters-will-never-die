"use strict";

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

Handlebars.registerHelper('alreadyFB', (movieObj) => {
  if (movieObj.inFB === true) {
    return new Handlebars.SafeString(`<a class="btn-floating btn-large waves-effect waves-light red"><i class="material-icons addButton" id="addButton--${movieObj.movieID}">remove</i></a>`);
  } else {
    return new Handlebars.SafeString(`<a class="btn-floating btn-large waves-effect waves-light green"><i class="material-icons addButton" id="addButton--${movieObj.movieID}">add</i></a>`);
  }
});


Handlebars.registerHelper('modal', (movieObj) => {
  $('.modal').modal();
});

$(document).ready(function(){
// the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
	$('#modal1').click(() => {
		$('.modal').modal();
	});
});
