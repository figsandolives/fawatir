const firebaseConfig = {
  apiKey: "AIzaSyAxjBBtAnpThJoliccuoq0NNIABGPv1dJg",
  authDomain: "fawatir-b6119.firebaseapp.com",
  projectId: "fawatir-b6119",
  storageBucket: "fawatir-b6119.appspot.com",
  messagingSenderId: "575777677956",
  appId: "1:575777677956:web:74794fdd3525f2693d18d1"
};
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
