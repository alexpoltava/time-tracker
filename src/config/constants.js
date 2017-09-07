import firebase from 'firebase';

const config = {
    apiKey: 'AIzaSyDz2vRcOrIN6vzcLiW8EZ1vZFDx-97dtZo',
    authDomain: 'time-tracker-2d47c.firebaseapp.com',
    databaseURL: 'https://time-tracker-2d47c.firebaseio.com',
    projectId: 'time-tracker-2d47c',
    storageBucket: 'time-tracker-2d47c.appspot.com',
    messagingSenderId: '251100417686'
};

firebase.initializeApp(config);

export const ref = firebase.database().ref();
export const firebaseAuth = firebase.auth;

export const defaultCategories = [
    {id: 1, name: 'Work'},
    {id: 2, name: 'Shopping'},
    {id: 3, name: 'Entertainment'},
    {id: 4, name: 'Sport'},
    {id: 5, name: 'Other'}
];
export const DEFAULT_CATEGORIES_NUMBER = defaultCategories.length + 1;
