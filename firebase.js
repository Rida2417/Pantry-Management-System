// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// import { getAnalytics, isSupported } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDO4BeUeku8npNiX5ZaxIxo7hNhZRpBVnU",
  authDomain: "pantry-management-system-6f1d8.firebaseapp.com",
  projectId: "pantry-management-system-6f1d8",
  storageBucket: "pantry-management-system-6f1d8.appspot.com",
  messagingSenderId: "1075716726148",
  appId: "1:1075716726148:web:6861c4cedd5cca199711d1",
  measurementId: "G-BEPDEWCWLP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const firestore=getFirestore(app);
const storage = getStorage(app);

export {firestore,storage}