// auth.js
import { auth, db } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { ref, set, update, get } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';
import { resetForms } from './utils.js';

const errorMsg = document.getElementById("error");

export function signup() {
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;

  if (!email || !password) return showError("Email and password are required.");

  createUserWithEmailAndPassword(auth, email, password)
    .then(async ({ user }) => {
      const uid = user.uid;
      const timestamp = new Date().toISOString();

      // Save new account data
      await set(ref(db, `users/${uid}`), {
        email,
        registerTimestamp: timestamp, // ✅ Renamed for clarity
        lastLogin: timestamp
      });

      localStorage.setItem("uid", uid);
      resetForms();
      window.location.href = `install.html?uid=${uid}`;
    })
    .catch(err => showError(err.message));
}

export function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) return showError("Email and password are required.");

  signInWithEmailAndPassword(auth, email, password)
    .then(async ({ user }) => {
      const uid = user.uid;
      const loginTime = new Date().toISOString();
      localStorage.setItem("uid", uid);

      // ✅ Update only lastLogin and email, keep all other data
      await update(ref(db, `users/${uid}`), {
        email,
        lastLogin: loginTime
      });

      showSuccess("Login successful. Redirecting...");
      setTimeout(() => window.location.href = `board.html?uid=${uid}`, 1000);
    })
    .catch(err => showError(err.message));
}

export function resetPassword() {
  const email = document.getElementById("forgotEmail").value.trim();
  if (!email) return showError("Please enter your email.");

  sendPasswordResetEmail(auth, email)
    .then(() => {
      showSuccess("Password reset email sent!");
      resetForms();
      document.getElementById("loginForm").style.display = "block";
      document.getElementById("forgotForm").style.display = "none";
    })
    .catch(err => showError(err.message));
}

function showError(msg) {
  errorMsg.style.color = "red";
  errorMsg.textContent = `❌ ${msg}`;
}

function showSuccess(msg) {
  errorMsg.style.color = "green";
  errorMsg.textContent = `✅ ${msg}`;
}



// // auth.js
// import { auth, db } from './firebase-config.js';
// import {
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   sendPasswordResetEmail
// } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
// import { ref, set } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';
// import { resetForms } from './utils.js';

// const errorMsg = document.getElementById("error");

// export function signup() {
//   const email = document.getElementById("signupEmail").value.trim();
//   const password = document.getElementById("signupPassword").value;

//   if (!email || !password) return showError("Email and password are required.");

//   createUserWithEmailAndPassword(auth, email, password)
//     .then(({ user }) => {
//       const uid = user.uid;
//       const timestamp = new Date().toISOString();

//       return set(ref(db, `users/${uid}`), {
//         email,
//         createdAt: timestamp
//       }).then(() => {
//         localStorage.setItem("uid", uid);
//         resetForms();
//         window.location.href = `install.html?uid=${uid}`;
//       });
//     })
//     .catch(err => showError(err.message));
// }

// export function login() {
//   const email = document.getElementById("loginEmail").value.trim();
//   const password = document.getElementById("loginPassword").value;

//   if (!email || !password) return showError("Email and password are required.");

//   signInWithEmailAndPassword(auth, email, password)
//     .then(({ user }) => {
//       const uid = user.uid;
//       const loginTime = new Date().toISOString();

//       localStorage.setItem("uid", uid);
//       return set(ref(db, `users/${uid}`), {
//         email,
//         lastLogin: loginTime
//       }).then(() => {
//         showSuccess("Login successful. Redirecting...");
//         setTimeout(() => window.location.href = `board.html?uid=${uid}`, 1000);
//       });
//     })
//     .catch(err => showError(err.message));
// }

// export function resetPassword() {
//   const email = document.getElementById("forgotEmail").value.trim();
//   if (!email) return showError("Please enter your email.");

//   sendPasswordResetEmail(auth, email)
//     .then(() => {
//       showSuccess("Password reset email sent!");
//       resetForms();
//       document.getElementById("loginForm").style.display = "block";
//       document.getElementById("forgotForm").style.display = "none";
//     })
//     .catch(err => showError(err.message));
// }

// function showError(msg) {
//   errorMsg.style.color = "red";
//   errorMsg.textContent = `❌ ${msg}`;
// }
// function showSuccess(msg) {
//   errorMsg.style.color = "green";
//   errorMsg.textContent = `✅ ${msg}`;
// }
