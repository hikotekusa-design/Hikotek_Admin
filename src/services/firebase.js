import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAC05kOcCerZ22jCoyHCn4NLzHSg3aZdmM",
  authDomain: "hikotek-35497.firebaseapp.com",
  projectId: "hikotek-35497",
  storageBucket: "hikotek-35497.appspot.com",  // Fixed the storage bucket URL
  messagingSenderId: "67685505573",
  appId: "1:67685505573:web:9e8e728e04df69183e7dcc"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };