import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
 apiKey: "AIzaSyD6SJqncZOiIVM7dLEqT0OQAH7iYM0eDhg",
  authDomain: "hikotek.firebaseapp.com",
  projectId: "hikotek",
  storageBucket: "hikotek.firebasestorage.app",
  messagingSenderId: "871573444811",
  appId: "1:871573444811:web:6809d4df444e75584e234e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };