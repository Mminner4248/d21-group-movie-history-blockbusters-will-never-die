'use strict';

let movieAPILoader = require('./api.js'),
    movieTemplate = require("../templates/movie-card.hbs"),
    userTemplate = require('../templates/userCards.hbs'),
    handlebarHelper = require("./hbsHelpers.js"),
    handlers = require("./DOMHandlers.js"),
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

user.logout();
// firebase.testPush(testInput);

$("#searchBar").on('keyup', function(e){ //clicks or presses enter
    // gets value from search
    if (e.keyCode === 13) {
      let movieSearch = document.getElementById("searchBar").value;
      let movieObject = {};
      $("#mainSearchResults").html(" ");
      movieAPILoader.getMovies(movieSearch)
        .then((movieData)=>{
           let movies = movieData.results;
           $(movies).each((index, item)=>{
             let year = item.release_date.slice(0, item.release_date.indexOf('-'));
             movieObject[index] = {
               title: item.title,
               year: year,
               poster: `http://image.tmdb.org/t/p/w342${item.poster_path}`,
               overview: item.overview,
               movieID: item.id,
               rating: 0,
               watched: false,
               inFB: false
             };
           });
          //  console.log("movieObject", movieObject);
          //  loadMoviesToDOM(movieObject);
          loadMoviesToDOM(movieObject);
          $("#searchBar").val(function() {
            if (this.value.length == 0) {
              return $(this).attr('placeholder');
            }
          });
        });
    }
});

$('#userSearchBar').on('keyup', function(e) {
  if (e.keyCode === 13) {
    $("#untracked").removeClass("is-hidden");
    $(".range-field").addClass("is-hidden");
    var movieObj = {};
    $("#untracked").fadeIn(2000).removeClass("is-hidden");
    firebase.getWatchList()
    .then((data) => {
      let movieIDArr = [];
      let movieRatingArr = [];
      let movieKeys = Object.keys(data);
      $(movieKeys).each((findex, fitem) => {
        movieIDArr.push(data[fitem].movieID);
        movieRatingArr.push(data[fitem].rating);
      });
      let search = $('#userSearchBar').val();
      movieAPILoader.getMovies(search)
      .then((movieData) => {
        let movies = movieData.results;
        $(movies).each((mindex, mitem) => {
          let year = mitem.release_date.slice(0, mitem.release_date.indexOf('-'));
          movieObj[mindex] = {
            title: mitem.title,
            year: year,
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
        $("#userSearchBar").val(function() {
          if (this.value.length == 0) {
            return $(this).attr('placeholder');
          }
        });
      });
      // loadMoviesToDOM(data);
      // $("#userMovies").append(movieTemplate(data));
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
  // this needs to be changed once auth works correctly
  if (firebase.getCurrentUser() !== undefined) {
    $("#userMovies").html('');
    $('#mainSearchResults').html('');
    $("#userMovies").append(userTemplate(movieData));
    handlers.addToFB();
    $('.rateYo').each((index, item) => {
      $(`#${item.id}`).rateYo({
         fullStar: true,
         numStars: 10,
         rating: ($(item).attr('rating'))/2,
         starWidth: "20px",
         spacing: "7px"
       })
        .on("rateyo.set", function (e, data) {
               let rating = data.rating * 2;
               // handler.rateMovie(movieObj, rating);
         });
    });

  } else {
    $('#mainSearchResults').html('');
    $("#userMovies").html('');
    $('#mainSearchResults').append(movieTemplate(movieData));
  }
  handlers.loadCast();
}





//This is where we are starting the firebase logInGoogle
$("#auth-btn").click(function() {
  console.log("clicked auth");
  user.logInGoogle();
});
$("#logout").click(() => {
  console.log("logout clicked");
  user.logout();
  $("#profileView").hide();
  $("#searchView").show();

});
