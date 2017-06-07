import firebase from 'firebase'

var config = {
    apiKey: "AIzaSyDz2vRcOrIN6vzcLiW8EZ1vZFDx-97dtZo",
    authDomain: "time-tracker-2d47c.firebaseapp.com",
    databaseURL: "https://time-tracker-2d47c.firebaseio.com",
    projectId: "time-tracker-2d47c",
    storageBucket: "time-tracker-2d47c.appspot.com",
    messagingSenderId: "251100417686"
};

firebase.initializeApp(config)

export const ref = firebase.database().ref()
export const firebaseAuth = firebase.auth
