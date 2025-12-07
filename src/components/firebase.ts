// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyChs9Tv5IkDjyr6AJ_a85j1Ge75kVwWac8",
  authDomain: "finance-tracker-83bd1.firebaseapp.com",
  projectId: "finance-tracker-83bd1",
  storageBucket: "finance-tracker-83bd1.firebasestorage.app",
  messagingSenderId: "206482492850",
  appId: "1:206482492850:web:1269578c6190f1be5028ab",
  measurementId: "G-B5510F4R5N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
