// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyASuURuwH0J1xxzTpHpAxweZGQunxkUvJU",
  authDomain: "ai-cooking-helper.firebaseapp.com",
  projectId: "ai-cooking-helper",
  storageBucket: "ai-cooking-helper.firebasestorage.app",
  messagingSenderId: "954680164636",
  appId: "1:954680164636:web:b881e62960777b09387ad9",
  measurementId: "G-259WV87RK5",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

signInAnonymously(auth).catch(console.error);
