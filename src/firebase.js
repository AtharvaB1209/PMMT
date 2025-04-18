import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC6uZ22OcQTMJ9qD0uO_NnksMCwqa7GQOA",
  authDomain: "project-management-tool-506df.firebaseapp.com",
  projectId: "project-management-tool-506df",
  storageBucket: "project-management-tool-506df.firebasestorage.app",
  messagingSenderId: "74063383812",
  appId: "1:74063383812:web:0aad90b9a3bb4c43a6d451",
  measurementId: "G-R4S81S9WFN"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
