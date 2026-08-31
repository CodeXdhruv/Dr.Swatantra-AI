import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDwiUwDPZh-ieBCYB5bUX-dAUpZANlxUoE",
  authDomain: "swatantra-ai.firebaseapp.com",
  projectId: "swatantra-ai",
  storageBucket: "swatantra-ai.firebasestorage.app",
  messagingSenderId: "114419958748",
  appId: "1:114419958748:web:dummy"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
