 
 // Side menu hide and unhide
const hideBtn = document.getElementById("hideBtn");
const showBtn = document.getElementById("showBtn");
let navHeading = document.querySelector(" .navHeading");

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

hideBtn.addEventListener("click", hideSidebar);
showBtn.addEventListener("click", showSidebar);

 document.getElementById("refreshSiteBtn")?.addEventListener("click", () => location.reload());

//Content loader in future i have to change it ;
 document.addEventListener("DOMContentLoaded", () => {
  fetch("dashboard.html")
    .then(response => response.text())
    .then(html => {
      document.querySelector(".main-content").innerHTML = html;
      history.replaceState(null, null, "http://127.0.0.1:5500/board.html?uid=AY66SuZVXmdqLAtiTBK3Z4fI5zW2"); //this is not good
   // history.replaceState(null, null, "dashboard.html");
    })

    .catch(err => console.error("Error loading dashboard:", err));
});


 document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("sidebar");
    const hideBtn = document.getElementById("hideBtn");
    const showBtn = document.getElementById("showBtn");

    if (hideBtn && showBtn) {
      hideBtn.onclick = () => document.body.classList.add("hide-sidebar");
      showBtn.onclick = () => document.body.classList.remove("hide-sidebar");
    }
  });

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

  // ✅ Logout handler
  window.logout = () => {
    signOut(auth).then(() => {
      localStorage.removeItem("uid");
      window.location.href = "index.html";
    });
  };



  // ✅ Page loader with script refresh and forced execution
window.dashboard = (pageName) => {
  pageName = pageName.replace(/\.(html|php)$/i, ""); // Sanitize

  fetch(`${pageName}.html`)
    .then(res => res.text())
    .then(html => {
      const contentContainer = document.querySelector(".main-content");
      contentContainer.innerHTML = html;

      // Remove and reload dynamic script (fresh execution every time)
      const existingScript = document.getElementById("dynamic-script");
      if (existingScript) existingScript.remove();

      const newScript = document.createElement("script");
      newScript.type = "module";
      newScript.src = `${pageName}.js?nocache=${Date.now()}`; // Force no-cache
      newScript.id = "dynamic-script";
      document.body.appendChild(newScript);

      // Highlight active menu
      const links = document.querySelectorAll(".sidebar .menu-link");
      links.forEach(link => link.classList.remove("active"));
      const activeLink = Array.from(links).find(link =>
        link.getAttribute("onclick")?.includes(pageName)
      );
      if (activeLink) activeLink.classList.add("active");
    })
    .catch(err => console.error(`❌ Failed to load ${pageName}:`, err));
};


  // ✅ Auth listener → load default dashboard.html
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "index.html";
    } else {
      const uid = user.uid;
      localStorage.setItem("uid", uid);

      // ✅ Always load dashboard.html
      dashboard("dashboard");

      // Optional: Load user data
      const userRef = ref(db, `users/${uid}`);
      try {
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          console.log("✅ User Data:", snapshot.val());
        }
      } catch (err) {
        console.error("❌ Error loading user data:", err);
      }
    }
  });
