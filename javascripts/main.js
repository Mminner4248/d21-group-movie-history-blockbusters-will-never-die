'use strict';

let movieAPILoader = require('./api.js'),
    $ = require('jquery'),
    movieTemplate = require("../templates/movie-card.hbs"),
    handlebarHelper = require("./hbsHelpers.js"),
    firebase = require("./firebase.js"),
    handlers = require('./DOMHandlers'),
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
    var movieObj = {};
    firebase.getWatchList()
    .then((data) => {
      let movieIDArr = [];
      let movieRatingArr = [];
      let movieKeys = Object.keys(data);
      $(movieKeys).each((findex, fitem) => {
        movieIDArr.push(data[fitem].movieID);
        movieRatingArr.push(data[fitem].rating);
      });
      console.log("movieIDArr", movieIDArr);
      console.log("movieRatingArr", movieRatingArr);
      let search = $('#userSearchBar').val();
      movieAPILoader.getMovies(search)
      .then((movieData) => {
        let movies = movieData.results;
        $(movies).each((mindex, mitem) => {
          console.log('poster_path', mitem.poster_path);
          movieObj[mindex] = {
            title: mitem.title,
            year: mitem.release_date,
            poster: `http://image.tmdb.org/t/p/w342${mitem.poster_path}`,
            overview: mitem.overview,
            movieID: mitem.id,
            rating: 0,
            watched: false,
            inFB: false
          };

          if (movieIDArr.indexOf(mitem.id) !== -1) {
            console.log("mitem", mitem);
             movieObj[mindex].inFB = true;
             let thisMovieIndex = movieIDArr.indexOf(mitem.id);
             movieObj[mindex].rating = movieRatingArr[thisMovieIndex];
          }
        });
        loadMoviesToDOM(movieObj);
      });
      // loadMoviesToDOM(data);
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
    $("#userMovies").append(movieTemplate(movieData));
    handlers.addToFB();
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
