// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Đã gỡ FacebookAuthProvider

const firebaseConfig = {
  apiKey: "AIzaSyA2a1Ygvr1LBbDA5MLFtoMkfI5cCekzEuo",
  authDomain: "pressnews-98dc0.firebaseapp.com",
  projectId: "pressnews-98dc0",
  storageBucket: "pressnews-98dc0.firebasestorage.app",
  messagingSenderId: "102474915543",
  appId: "1:102474915543:web:d28a51be6d57ddaf01da92",
  measurementId: "G-VXYMSMZ9YD"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(); 
// Đã xóa dòng export facebookProvider