// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4LmFW8ouk6ND-Z7ea1QWbGZbea-M8dOA",
  authDomain: "pnvc-app-eb818.firebaseapp.com",
  projectId: "pnvc-app-eb818",
  storageBucket: "pnvc-app-eb818.firebasestorage.app",
  messagingSenderId: "333108330520",
  appId: "1:333108330520:web:1f18b74fd045c477c6436d",
  measurementId: "G-YZ9EMB6SG5",
  databaseURL:"https://pnvc-app-eb818-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export default app;
