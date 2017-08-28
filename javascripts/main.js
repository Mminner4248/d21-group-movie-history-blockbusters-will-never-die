'use strict';

let movieAPILoader = require('./api.js'),
    $ = require('jquery'),
    buildCard = require("./dom-builder.js"),
    movieTemplate = require("../templates/movie-card.hbs"),
    handlebarHelper = require("./hbsHelpers.js"),
    firebase= require("./firebase.js"),
    user = require("./user.js");

var movieIDsArray = [];
var movieObjArray = [];

let testInput = {
  title: "Michael",
  overview: "hello I am michael",
  poster_path: "/lakdjfaklsdfjas.jpg",
  id: 238,
  release_date: '1972-03-14',
  rating: 0,
  watched: false,
  inFB: false
};

// firebase.testPush(testInput);

$("#searchBar").on('keyup', function(e){ //clicks or presses enter
    // gets value from search
    if (e.keyCode === 13) {
      let movieSearch = document.getElementById("searchBar").value;
      let movieObject = {};

      movieAPILoader.getMovies(movieSearch)
        .then((movieData)=>{
           console.log('movie data retrieved', movieData);
           let movies = movieData.results;
           movies.forEach((item, index)=>{
               movieObject[index] = item;
           });
           console.log("movieObject", movieObject);
        });
    }

});

function requestMovieByID(movieID) {
  movieAPILoader.getMoviesWithCredits(movieID.id)
      .then((movieDataWithCredits)=>{
      // movieObjArray = [];
      // movieObjArray.push(movieDataWithCredits);
      // loadMoviesToDOM(movieObjArray);
  });
}


function loadMoviesToDOM(movieData) {
    console.log(movieData);
    $(".row").append(movieTemplate(movieData));
}





//This is where we are starting the firebase logInGoogle
$("#auth-btn").click(function() {
  console.log("clicked auth");
  user.logInGoogle();
});
$("#logout").click(() => {
  console.log("logout clicked");
  user.logout();
});
