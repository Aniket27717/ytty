


// import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
// import {
//   getAuth,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   sendPasswordResetEmail
// } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// import {
//   getDatabase,
//   ref,
//   set
// } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

// const firebaseConfig = {
//   apiKey: "AIzaSyCW87BPPsuA_AsNCzqfEEVFSvHF-SP100k",
//   authDomain: "android-service-54676.firebaseapp.com",
//   databaseURL: "https://android-service-54676-default-rtdb.firebaseio.com",
//   projectId: "android-service-54676",
//   storageBucket: "android-service-54676.appspot.com",
//   messagingSenderId: "446333235153",
//   appId: "1:446333235153:web:f7366fd64166b83d5b3af0"
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getDatabase(app);

// const loginForm = document.getElementById("loginForm");
// const signupForm = document.getElementById("signupForm");
// const forgotForm = document.getElementById("forgotForm");
// const errorMsg = document.getElementById("error");
// const formTitle = document.getElementById("formTitle");

// // 🔁 Toggle Forms
// document.getElementById("showSignup").onclick = () => {
//   loginForm.style.display = "none";
//   signupForm.style.display = "block";
//   forgotForm.style.display = "none";
//   formTitle.textContent = "Create Account";
//   errorMsg.textContent = "";
// };

// document.getElementById("showLoginFromSignup").onclick = () => {
//   loginForm.style.display = "block";
//   signupForm.style.display = "none";
//   forgotForm.style.display = "none";
//   formTitle.textContent = "Spyder Login";
//   errorMsg.textContent = "";
// };

// document.getElementById("showForgot").onclick = () => {
//   loginForm.style.display = "none";
//   signupForm.style.display = "none";
//   forgotForm.style.display = "block";
//   formTitle.textContent = "Reset Password";
//   errorMsg.textContent = "";
// };

// document.getElementById("showLoginFromForgot").onclick = () => {
//   loginForm.style.display = "block";
//   signupForm.style.display = "none";
//   forgotForm.style.display = "none";
//   formTitle.textContent = "Spyder Login";
//   errorMsg.textContent = "";
// };

// function signUpToLogin() {
//   loginForm.style.display = "block";
//   signupForm.style.display = "none";
//   forgotForm.style.display = "none";
//   formTitle.textContent = "Spyder Login";

//   document.getElementById("signupEmail").value = "";
//   document.getElementById("signupPassword").value = "";
//   document.getElementById("loginEmail").value = "";
//   document.getElementById("loginPassword").value = "";
// }

// // ✅ SIGN UP + Save to Database
// document.getElementById("signupBtn").addEventListener("click", async () => {
//   const email = document.getElementById("signupEmail").value;
//   const password = document.getElementById("signupPassword").value;

//   try {
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;
//     const uid = user.uid;
//     const timestamp = new Date().toISOString();

//     // 🔐 Save to Firebase Realtime Database
//     await set(ref(db, `users/${uid}`), {
//       email: user.email,
//       timestamp: timestamp
//     });

//     localStorage.setItem("uid", uid);

//     errorMsg.style.color = "green";
//     errorMsg.textContent = "✅ Sign-up Successful. Please login.";
//     signUpToLogin();
//   } catch (error) {
//     errorMsg.style.color = "red";
//     errorMsg.textContent = `❌ Sign-up failed: ${error.message}`;
//   }
// });

// // ✅ Login
// document.getElementById("loginBtn").addEventListener("click", async () => {
//   const email = document.getElementById("loginEmail").value;
//   const password = document.getElementById("loginPassword").value;

//   try {
//     const userCredential = await signInWithEmailAndPassword(auth, email, password);
//     const uid = userCredential.user.uid;
//     localStorage.setItem("uid", uid);

//     errorMsg.style.color = "green";
//     errorMsg.textContent = "✅ Login successful. Redirecting...";

//     setTimeout(() => {
//       window.location.href = `board.html?uid=${uid}`;
//     }, 1000);
//   } catch (error) {
//     errorMsg.style.color = "red";
//     errorMsg.textContent = `❌ Login failed: ${error.message}`;
//   }
// });

// // ✅ Forgot Password
// document.getElementById("resetBtn").addEventListener("click", async () => {
//   const email = document.getElementById("forgotEmail").value;

//   try {
//     await sendPasswordResetEmail(auth, email);
//     errorMsg.style.color = "green";
//     errorMsg.textContent = "✅ Reset email sent.";
//   } catch (error) {
//     errorMsg.style.color = "red";
//     errorMsg.textContent = `❌ Reset failed: ${error.message}`;
//   }
// });

// Firebase Setup
// import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
// import {
//   getAuth,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   sendPasswordResetEmail
// } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// import {
//   getDatabase,
//   ref,
//   set
// } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";


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

// Elements
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const forgotForm = document.getElementById("forgotForm");
const errorMsg = document.getElementById("error");
const formTitle = document.getElementById("formTitle");

// Form Switching
const showForm = (formType) => {
  loginForm.style.display = formType === "login" ? "block" : "none";
  signupForm.style.display = formType === "signup" ? "block" : "none";
  forgotForm.style.display = formType === "forgot" ? "block" : "none";

  formTitle.textContent = formType === "login"
    ? "Spyder Login"
    : formType === "signup"
    ? "Create Account"
    : "Reset Password";

  errorMsg.textContent = "";
};

document.getElementById("showSignup").onclick = () => showForm("signup");
document.getElementById("showLoginFromSignup").onclick = () => showForm("login");
document.getElementById("showForgot").onclick = () => showForm("forgot");
document.getElementById("showLoginFromForgot").onclick = () => showForm("login");

// Form Reset
function resetForms() {
  ["loginEmail", "loginPassword", "signupEmail", "signupPassword", "forgotEmail"].forEach(id => {
    const input = document.getElementById(id);
    if (input) input.value = "";
  });
}

// ✅ SIGN UP
document.getElementById("signupBtn").addEventListener("click", async () => {
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;

  if (!email || !password) {
    errorMsg.style.color = "red";
    errorMsg.textContent = "❌ Email and password are required.";
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    const timestamp = new Date().toISOString();

    await set(ref(db, `users/${uid}`), {
      email: email,
      createdAt: timestamp
    });

    localStorage.setItem("uid", uid);
    errorMsg.style.color = "green";
    errorMsg.textContent = "✅ Account created. Please login.";
    resetForms();
    showForm("login");
  } catch (error) {
    errorMsg.style.color = "red";
    errorMsg.textContent = `❌ ${error.message}`;
  }
});

// ✅ LOGIN
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    errorMsg.style.color = "red";
    errorMsg.textContent = "❌ Email and password are required.";
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    localStorage.setItem("uid", uid);
    
    errorMsg.style.color = "green";
    errorMsg.textContent = "✅ Login successful. Redirecting...";

    setTimeout(() => {
      window.location.href = `board.html?uid=${uid}`;//////////////////
    }, 1000);
  } catch (error) {
    errorMsg.style.color = "red";
    errorMsg.textContent = `❌ ${error.message}`;
  }
});

// ✅ RESET PASSWORD
document.getElementById("resetBtn").addEventListener("click", async () => {
  const email = document.getElementById("forgotEmail").value.trim();

  if (!email) {
    errorMsg.style.color = "red";
    errorMsg.textContent = "❌ Please enter your email.";
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    errorMsg.style.color = "green";
    errorMsg.textContent = "✅ Password reset email sent!";
    resetForms();
    showForm("login");
  } catch (error) {
    errorMsg.style.color = "red";
    errorMsg.textContent = `❌ ${error.message}`;
  }
});
