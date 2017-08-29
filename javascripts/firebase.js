'use strict';

var firebase = require('firebase'),
    fb = require("./fb-keys"),
    fbData = fb();
var movies = require('./api');
var $ = require('jquery');
var config = {
  apiKey: fbData.apiKey,
  authDomain: fbData.authDomain,
  databaseURL: fbData.databaseURL,
  projectId: "moviehistorydb",
  storageBucket: "moviehistorydb.appspot.com",
  messagingSenderId: "1015573230583"
};

firebase.initializeApp(config);

movies.getMovies('the godfather')
.then((data) => {
  console.log("data", data);
});

let fdr = firebase.database();
var fire = {
  getCurrentUser: function(){
    if (firebase.auth().currentUser === null) {
      return 111;
    } else {
      return firebase.auth().currentUser.uid;
    }
  },
  testPush: function(item) {
    let year = item.release_date.slice(0, item.release_date.indexOf('-'));
    let dbRef = fdr.ref();
    dbRef.push({
      title: item.title,
      year: year,
      poster: `http://image.tmdb.org/t/p/w500${item.poster_path}`,
      overview: item.overview,
      movieID: item.id,
      rating: 0,
      watched: false,
      inFB: false,
      uid: item.uid
    });
  },

  getWatchList: function() {
    return new Promise((resolve, reject) => {
      let userID = fire.getCurrentUser();
      $.ajax({
        url: `https://moviehistorydb.firebaseio.com/.json?orderBy="uid"&equalTo="${userID}"`
      }).done((data) => {
        console.log("dataAJAX", data);
        resolve(data);
      });
    });
  }
};

module.exports = fire;










// firebase.auth().signInWithPopup(provider).then(function(result) {
//   // This gives you a Google Access Token. You can use it to access the Google API.
//   var token = result.credential.accessToken;
//   // The signed-in user info.
//   var user = result.user;
//   // ...
// }).catch(function(error) {
//   // Handle Errors here.
//   var errorCode = error.code;
//   var errorMessage = error.message;
//   // The email of the user's account used.
//   var email = error.email;
//   // The firebase.auth.AuthCredential type that was used.
//   var credential = error.credential;
//   // ...
// });
