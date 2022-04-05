import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const { REACT_APP_FIREBASE_API_KEY } = process.env;

const firebaseConfig = {
  apiKey: REACT_APP_FIREBASE_API_KEY,
  authDomain: "forma1-new.firebaseapp.com",
  projectId: "forma1-new",
  storageBucket: "forma1-new.appspot.com",
  messagingSenderId: "263296390561",
  appId: "1:263296390561:web:28297be1946c9889ada7e0"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);