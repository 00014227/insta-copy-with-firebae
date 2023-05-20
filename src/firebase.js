import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; 
import { getStorage } from "firebase/storage";
import { getDatabase, ref, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBZE4VbjCXs26hCsdRzoEvDZ7DJQrVJp9Y",
  authDomain: "instagram-a2f68.firebaseapp.com",
  projectId: "instagram-a2f68",
  storageBucket: "instagram-a2f68.appspot.com",
  messagingSenderId: "298753996448",
  appId: "1:298753996448:web:47616d2b73d9e2452b7bc5",
  measurementId: "G-LL30KPZX4E"
};
const app = initializeApp(firebaseConfig); 
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage()
export default app




// Initialize Firebase
