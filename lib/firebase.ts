// lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {

  apiKey: "AIzaSyATtIs44ytFgNijP6Nub7n8v1Dvdh4FI0M",

  authDomain: "cerfa-app.firebaseapp.com",

  projectId: "cerfa-app",

  storageBucket: "cerfa-app.firebasestorage.app",

  messagingSenderId: "10151422817",

  appId: "1:10151422817:web:be91770bbb478af17cf320",

  measurementId: "G-ELWWWJ2DBC"

};



const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };