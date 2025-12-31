import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBR84vQLOjsF9uZyPrNh3obYyJDnBDG-78",
  authDomain: "habit-tracker-1df89.firebaseapp.com",
  projectId: "habit-tracker-1df89",
  storageBucket: "habit-tracker-1df89.firebasestorage.app",
  messagingSenderId: "821971089270",
  appId: "1:821971089270:web:9d52f3d231753755eeec57",
  measurementId: "G-1V9CW6D5SD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

