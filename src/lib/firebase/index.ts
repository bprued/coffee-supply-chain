// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD0lEaIpYAjGkBamSiVRXApox7P5YRtAWI",
  authDomain: "coffee-supply-chain-e2129.firebaseapp.com",
  projectId: "coffee-supply-chain-e2129",
  storageBucket: "coffee-supply-chain-e2129.appspot.com",
  messagingSenderId: "159578898158",
  appId: "1:159578898158:web:897f109ed4cf3d4098bdff",
  measurementId: "G-1J34EYTZMX",
  databaseURL: "https://coffee-supply-chain-e2129-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database }