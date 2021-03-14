// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app"

// Add the Firebase products that you want to use
import "firebase/auth"
import "firebase/firestore"
import "firebase/functions"
import "firebase/storage"

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyA-qbmaRzzicR5PTFLE0UL8gleBZi-ATxo",
    authDomain: "analitica-cb117.firebaseapp.com",
    databaseURL: "https://analitica-cb117.firebaseio.com",
    projectId: "analitica-cb117",
    storageBucket: "analitica-cb117.appspot.com",
    messagingSenderId: "378311496768",
    appId: "1:378311496768:web:dbdb9d20a2d31f7ce6fba5",
    measurementId: "G-6KTMPGLGVV"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

// Export Firebase
const auth = firebase.auth()
const db = firebase.firestore()
const functions = firebase.app().functions("asia-southeast2")
const timestamp = firebase.firestore.Timestamp
export { firebase, auth, db, functions, timestamp }
export default firebase