'use strict';

var fire = require('./firebase');
var movieDB = require('./api');
var $ = require('jquery');

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
  }
};

module.exports = handler;
