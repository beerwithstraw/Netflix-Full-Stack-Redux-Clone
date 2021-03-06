import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyA1HP06mazjixTlShhypXYSDSltVVRPAlI",
  authDomain: "netflix-full-stack-clone.firebaseapp.com",
  projectId: "netflix-full-stack-clone",
  storageBucket: "netflix-full-stack-clone.appspot.com",
  messagingSenderId: "605440231974",
  appId: "1:605440231974:web:ee70690f91fe42148374e7"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore()
const auth = firebase.auth()

export { auth }
export default db;