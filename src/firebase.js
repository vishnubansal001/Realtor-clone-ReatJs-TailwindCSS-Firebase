// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBunR--tMXcbrE4I1Pt-XEs5bca1CRAF60",
  authDomain: "realtor-clone-by-vb.firebaseapp.com",
  projectId: "realtor-clone-by-vb",
  storageBucket: "realtor-clone-by-vb.appspot.com",
  messagingSenderId: "38042381766",
  appId: "1:38042381766:web:96d7b77840cfbb4039d6c7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth(app);