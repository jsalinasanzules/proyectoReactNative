import firebase from "firebase/app";
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyACbdijbo3qojbaS4kzHfVo_VoXSJZHgPM",
    authDomain: "catalogo-cotzul.firebaseapp.com",
    projectId: "catalogo-cotzul",
    storageBucket: "catalogo-cotzul.appspot.com",
    messagingSenderId: "779722590521",
    appId: "1:779722590521:web:9227dda9f5477f0f0400e8"
};

const app = firebase.initializeApp(firebaseConfig); 

const db = firebase.firestore(app);

export const locationsRef = db.collection("locations");
