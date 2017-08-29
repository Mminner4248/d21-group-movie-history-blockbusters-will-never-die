'use strict';

var fire = require('./firebase');
var movieDB = require('./api');

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
    });
  }
};

module.exports = handler;
