// firebaseConfig.js
import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDug876N6goI-5wthlWiCENiXkLwqfO7qM",
  authDomain: "cropselection-23708.firebaseapp.com",
  projectId: "cropselection-23708",
  storageBucket: "cropselection-23708.appspot.com",
  messagingSenderId: "768409793290",
  appId: "1:768409793290:web:2b59e0fa68242cc5ae80f3",
  measurementId: "G-NGJHP5RSFY"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (e) {
  auth = getAuth(app); 
}
// export const db = getFirestore(app);

export { auth, app };
