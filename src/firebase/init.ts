import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyAWMv2kCPi_zrisXZH8OWOqJ1A7J0_CAuk",
	authDomain: "project-5-5dc0d.firebaseapp.com",
	projectId: "project-5-5dc0d",
	storageBucket: "project-5-5dc0d.firebasestorage.app",
	messagingSenderId: "725354656574",
	appId: "1:725354656574:web:bc7c18d234b9173406b26f",
};

const app: FirebaseApp = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);
export default db;
