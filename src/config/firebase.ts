import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBdCVlDKiWyuZyNFwTlWE6LiHAq2vA8WKU",
  authDomain: "autonova-salon.firebaseapp.com",
  projectId: "autonova-salon",
  storageBucket: "autonova-salon.firebasestorage.app",
  messagingSenderId: "166105733449",
  appId: "1:166105733449:web:f27874792da9c67ccb6298"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;