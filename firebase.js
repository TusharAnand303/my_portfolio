// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBliQW9xN-w-EZ7kx8skKrO20Hxven4eBE",
  authDomain: "myportfolio26-e4dea.firebaseapp.com",
  projectId: "myportfolio26-e4dea",
  storageBucket: "myportfolio26-e4dea.firebasestorage.app",
  messagingSenderId: "246607527386",
  appId: "1:246607527386:web:1d6d0de87cbade919714e3",
  measurementId: "G-X025CM6YHX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);