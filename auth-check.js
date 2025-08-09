// auth-check.js
export function checkAuth() {
  const uid = localStorage.getItem("uid");
  if (!uid) {
    window.location.href = "index.html";
  }
  return uid;
}
