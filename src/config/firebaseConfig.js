import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB4kj4or3ZZ_MaK9phD95ysn7EdzBo6ZlM",
    authDomain: "rungo-app-mob.firebaseapp.com",
    projectId: "rungo-app-mob",
    storageBucket: "rungo-app-mob.firebasestorage.app",
    messagingSenderId: "769814669483",
    appId: "1:769814669483:web:4a3d24988e6ff3a9edafee",
    measurementId: "G-YLGVRM34ZC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
