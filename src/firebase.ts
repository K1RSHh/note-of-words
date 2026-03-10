// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCilAoQHP-B3aaUW697nTe6IRf3bFdlPNM",
  authDomain: "node-of-words.firebaseapp.com",
  projectId: "node-of-words",
  storageBucket: "node-of-words.firebasestorage.app",
  messagingSenderId: "101091206196",
  appId: "1:101091206196:web:81d32e49dc24a17ad6d661",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
