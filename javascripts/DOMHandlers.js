'use strict';

var fire = require('./firebase');
var movieDB = require('./api');

var handler = {
  addToFB: function() {
    $('.addButton').on('click', function(e) {
      let manipID = $(e.target).attr('id');
      let movieId = manipID.slice(manipID.indexOf('--')+2, manipID.length);
      // This is probably unecessarry below but basically this just needs to push to firebase

      // fire.getWatchList()
      // .then((data) => {
      //   console.log("data", data);
      //   let keys = Object.keys(data);
      //   console.log("keys", keys);
      //   $(keys).each((windex, witem) => {
      //     let thisMovie = data[witem];
      //     if (thisMovie.movieID === movieId) {
      //       console.log("title", thisMovie.title);
      //     }
      //   });
      // });
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
        console.log('cast', data.cast);
        let cast = data.cast.slice(0, 4);
        for (var i = 0; i < cast.length; i++) {
          let member = cast[i].name;
          $(`#castReveal${id}`).append(`${member} | `);
        }
      });
    });
  }
};

module.exports = handler;
