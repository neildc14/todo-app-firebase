const firebaseConfig = {
  apiKey: "AIzaSyCkaRp-BmVsV1XLqo6E8_j3VfaB6b_75XE",
  authDomain: "todo-app-15a66.firebaseapp.com",
  projectId: "todo-app-15a66",
  storageBucket: "todo-app-15a66.appspot.com",
  messagingSenderId: "867632875437",
  appId: "1:867632875437:web:58440bf8027e02d4f30324",
  measurementId: "G-VZ96YXS3TW",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
// db.settings({ timestampsInSnapshots: true, merge: true });
