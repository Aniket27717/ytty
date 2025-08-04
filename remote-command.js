// ✅ Firebase SDK Import
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCW87BPPsuA_AsNCzqfEEVFSvHF-SP100k",
  authDomain: "android-service-54676.firebaseapp.com",
  databaseURL: "https://android-service-54676-default-rtdb.firebaseio.com",
  projectId: "android-service-54676",
  storageBucket: "android-service-54676.appspot.com",
  messagingSenderId: "446333235153",
  appId: "1:446333235153:web:f7366fd64166b83d5b3af0"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// ✅ Send Command Function
function sendCommand(section, commandValue) {
  const user = auth.currentUser;
  if (!user) return console.warn("User not authenticated");

  const commandRef = ref(db, `users/${user.uid}/${section}/command`);

  set(commandRef, {
    value: commandValue,
    timestamp: new Date().toISOString()
  })
  .then(() => console.log(`✅ Sent '${commandValue}' to ${section}`))
  .catch(err => console.error("❌ Command Error:", err));
}

// ✅ Setup Toggle Button Listeners After Auth
onAuthStateChanged(auth, (user) => {
  if (!user) return;

  const hideToggle = document.getElementById("hideToggle");
  const unhideToggle = document.getElementById("unhideToggle");

  if (hideToggle) {
    hideToggle.addEventListener("click", () => {
      sendCommand("remote-command", "hideApp");
    });
  }

  if (unhideToggle) {
    unhideToggle.addEventListener("click", () => {
      sendCommand("remote-command", "unhideApp");
    });
  }
});
