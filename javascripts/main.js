'use strict';

let movieAPILoader = require('./api.js'),
    $ = require('jquery'),
    movieTemplate = require("../templates/movie-card.hbs"),
    handlebarHelper = require("./hbsHelpers.js"),
    firebase= require("./firebase.js"),
    user = require("./user.js"),
    toggleKeys = require("./userProfileToggles.js");

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
  inFB: false,
  uid: 111
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
           loadMoviesToDOM(movieObject);
        });
    }
});

$('#userSearchBar').on('keyup', function(e) {
  if (e.keyCode === 13) {
    $("#untracked").fadeIn(2000).removeClass("is-hidden");
    firebase.getWatchList()
    .then((data) => {
      loadMoviesToDOM(data);
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
    //for the userView: $("#userMovies").append(movieTemplate(movieData));
    //for the searchView: $("#searchView").append(movieTemplate(movieData));
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
