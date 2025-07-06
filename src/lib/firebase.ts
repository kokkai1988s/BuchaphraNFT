import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC6hG69Z06fkx7shrG793QR1bnU-U1GHV8",
  authDomain: "amulet-insight.firebaseapp.com",
  projectId: "amulet-insight",
  storageBucket: "amulet-insight.appspot.com",
  messagingSenderId: "225589316729",
  appId: "1:225589316729:web:f719ab42723204d8a8"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
