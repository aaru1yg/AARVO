import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBErhnLAm5Foku28D0SjIXt-gjxD5QKxmQ",
  authDomain: "aaru-store.firebaseapp.com",
  projectId: "aaru-store",
  storageBucket: "aaru-store.firebasestorage.app",
  messagingSenderId: "732233530200",
  appId: "1:732233530200:web:9673b21b5a3c543dc0432d",
  databaseURL: "https://aaru-store-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);