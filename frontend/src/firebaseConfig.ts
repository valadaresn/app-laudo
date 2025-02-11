import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxLWGqn8FkH9h1ix8CBZY2fqf_gDz0nII",
  authDomain: "app-laudo-31fb5.firebaseapp.com",
  projectId: "app-laudo-31fb5",
  storageBucket: "app-laudo-31fb5.firebasestorage.app",
  messagingSenderId: "870252935851",
  appId: "1:870252935851:web:9cc34a5a2ab1ea75c655ee",
  measurementId: "G-DKFGT9F0LP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with persistence
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});

// Initialize Auth
const auth = getAuth(app);

console.log("Firestore initialized with persistence");

export { app, db, auth };