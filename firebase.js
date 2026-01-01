// إعداد فايربيس للمتصفح مباشرة
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

// تهيئة الخدمات
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);
