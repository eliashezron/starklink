// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAjCPKPX8qRZxDYhIL5R4MxehwbFveM5l8",
  authDomain: "starklink-11ae1.firebaseapp.com",
  projectId: "starklink-11ae1",
  storageBucket: "starklink-11ae1.appspot.com",
  messagingSenderId: "688622398125",
  appId: "1:688622398125:web:22ec2fbc26dae5b06bf424",
  measurementId: "G-358K6C2KMR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };
