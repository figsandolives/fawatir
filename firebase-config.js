import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, push, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAxjBBtAnpThJoliccuoq0NNIABGPv1dJg",
  authDomain: "fawatir-b6119.firebaseapp.com",
  databaseURL: "https://fawatir-b6119-default-rtdb.firebaseio.com",
  projectId: "fawatir-b6119",
  storageBucket: "fawatir-b6119.firebasestorage.app",
  messagingSenderId: "575777677956",
  appId: "1:575777677956:web:74794fdd3525f2693d18d1",
  measurementId: "G-N3WQQC8XY5"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
export { db, ref, set, push, onValue, update, remove };