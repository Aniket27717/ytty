import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  set
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Firebase config
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

// Clear all input fields
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
      createdAt: timestamp,
      // password: password // ⚠️ Never store plain text passwords in production
    });

    localStorage.setItem("uid", uid);
    errorMsg.style.color = "green";
    resetForms();
    showForm("login");
    errorMsg.textContent = "✅ Sign-up complete. Please login to continue...";
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
    const loginTime = new Date().toISOString();

    localStorage.setItem("uid", uid);

    // Optional update (overwrites existing user data)
    await set(ref(db, `users/${uid}`), {
      email: email,
      lastLogin: loginTime,
      password: password // ⚠️ Store securely if needed (NEVER plain text in real apps)
    });

    errorMsg.style.color = "green";
    errorMsg.textContent = "✅ Login successful. Redirecting...";

    setTimeout(() => {
      window.location.href = `board.html?uid=${uid}`;
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
