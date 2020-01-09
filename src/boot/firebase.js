import * as firebase from "firebase/app";

// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/database";


var firebaseConfig = {
  apiKey: "AIzaSyAYZrAoutOpX1iBxX-FLR8H3u9jmvoJozM",
  authDomain: "foods-79887.firebaseapp.com",
  databaseURL: "https://foods-79887.firebaseio.com",
  projectId: "foods-79887",
  storageBucket: "foods-79887.appspot.com",
  messagingSenderId: "418531376895",
  appId: "1:418531376895:web:45607a95f426a8aecd96ca"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let firebaseAuth = firebase.auth()
let firebaseDb = firebase.database()

export { firebaseAuth, firebaseDb }
