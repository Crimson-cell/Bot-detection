const config = require('./config');
const firebase = require('firebase/app');
require('firebase/firestore');
require('firebase/auth');

firebase.initializeApp(config.firebaseConfig);

module.exports.auth = firebase.auth();

module.exports.fireauth = firebase.auth;

//const settings = {timestampsInSnapshots: true};
//firebase.firestore().settings(settings);
module.exports.firestore = firebase.firestore();

module.exports.firebasestore = firebase.firestore;