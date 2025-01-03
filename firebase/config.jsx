import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWBO1O0Nz41SlEH5pQ5ehMFOyTNXzbRcI",
  authDomain: "mini-blog-91549.firebaseapp.com",
  projectId: "mini-blog-91549",
  storageBucket: "mini-blog-91549.firebasestorage.app",
  messagingSenderId: "528864847786",
  appId: "1:528864847786:web:5e5c584f43c10e2abe6dd3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };