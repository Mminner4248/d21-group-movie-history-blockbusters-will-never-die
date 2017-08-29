'use strict';

var fire = require('./firebase');
var movieDB = require('./api');
let userTemplate = require('../templates/userCards.hbs');
let movieTemplate = require('../templates/movie-card.hbs');

var handler = {
  addToFB: function() {
    $('.addButton').on('click', function(e) {
      let manipID = $(e.target).attr('id');
      let movieId = manipID.slice(manipID.indexOf('--')+2, manipID.length);
      movieDB.getSingleMovie(movieId)
      .then((data) => {
        let year = data.release_date.slice(0, data.release_date.indexOf('-'));
        let movie = {
          title: data.title,
          year: year,
          poster: `http://image.tmdb.org/t/p/w342${data.poster_path}`,
          overview: data.overview,
          movieID: data.id,
          rating: $(e.target).attr('rating')*2,
          watched: false,
          inFB: true,
          uid: fire.getCurrentUser()
        };
        console.log("movie", movie);
        fire.addToFB(movie);
        $(e.target).parent().remove();
        $(`#reveal${movieId}`).before(`<a class="btn-floating btn-large waves-effect waves-light red"><i class="material-icons removeButton" id="removeButton--${movieId}">remove</i></a>`);
        handler.removeFromFB();
      });
    });
  },

  loadCast: function() {
    $('img.activator').on('click', function(e) {
      let manipID = $(e.target).parent().attr('id');
      let thisMovieID = manipID.slice(9, manipID.length);
      movieDB.getCredits(thisMovieID)
      .then((data) => {
        let id = data.id;
        $(`#castReveal${id}`).html('');
        let cast = data.cast.slice(0, 4);
        for (var i = 0; i < cast.length; i++) {
          let member = cast[i].name;
          $(`#castReveal${id}`).append(`${member} | `);
        }
      });
    });
  },

  removeFromFB: function() {
    $('.removeButton').on('click', function(e) {
      let manipID = $(e.target).attr('id');
      let movieId = manipID.slice(manipID.indexOf('--')+2, manipID.length);
      movieId = Number(movieId);
      fire.removeFromFB(movieId);
      $(`#card--${movieId}`).remove();
    });
  },

  loadMoviesToDOM: function(movieData) {
    if (fire.getCurrentUser() !== undefined) {
      $("#userMovies").html('');
      $('#mainSearchResults').html('');
      $("#userMovies").append(userTemplate(movieData));
      $('.rateYo').each((index, item) => {
        $(`#${item.id}`).rateYo({
           fullStar: true,
           numStars: 10,
           rating: ($(item).attr('rating'))/2,
           starWidth: "20px",
           spacing: "7px"
         })
          .on("rateyo.set", function (e, data) {
             let starDiv = $(item).attr('id');
             let movieID = starDiv.slice(6, starDiv.length);
             let rating = data.rating * 2;
             handler.rateMovie(movieID, rating);
           });
      });
      handler.addToFB();
      handler.removeFromFB();

    } else {
      $('#mainSearchResults').html('');
      $("#userMovies").html('');
      $('#mainSearchResults').append(movieTemplate(movieData));
    }
    handler.loadCast();
  },

  rateMovie: function(movieID, rating) {
    fire.getWatchList()
    .then((data) => {
      console.log("rateMovieData", data);
      let movieId = Number(movieID);
      console.log("movidId", movieId);
      let keys = Object.keys(data);
      let uglyID;
      let movieIDsArray = [];
      $(keys).each((index, item) => {
        let thisMovie = data[item];
        console.log("thisMovie.outside.movieID", thisMovie.movieID);
        if(thisMovie.movieID === movieId) {
          console.log("indside", thisMovie.movieID);
          uglyID = keys[index];
          movieIDsArray.push(thisMovie.movieID);
        }
      });
      console.log("uglyID", uglyID);
      console.log("idarray", movieIDsArray);
      if (movieIDsArray.indexOf(movieId) === -1) {
        movieDB.getSingleMovie(movieId)
        .then((data) => {
          let year = data.release_date.slice(0, data.release_date.indexOf('-'));
          let movie = {
            title: data.title,
            year: year,
            poster: `http://image.tmdb.org/t/p/w342${data.poster_path}`,
            overview: data.overview,
            movieID: data.id,
            rating: rating,
            watched: true,
            inFB: true,
            uid: fire.getCurrentUser()
          };
          console.log("movie", movie);
          fire.addToFB(movie);
          $(`#addButton--${movieId}`).remove();
          $(`#reveal${movieId}`).before(`<a class="btn-floating btn-large waves-effect waves-light red"><i class="material-icons removeButton" id="removeButton--${movieId}">remove</i></a>`);
          handler.removeFromFB();
        });
      } else {
          fire.updateRating(uglyID, rating);
      }
    });


  },

  updateRating: function() {

  }


};

module.exports = handler;
