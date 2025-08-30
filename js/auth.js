let users = [];
let current = null;
const USERS_URL = "https://raw.githubusercontent.com/noxxasoloera/WebManager/main/users.json";

// Tombol login
const btnLogin = document.getElementById("btnLogin");

// Load users dulu
async function loadUsers() {
  try {
    const res = await fetch(USERS_URL);
    users = await res.json();
    console.log("✅ Users loaded:", users);
    btnLogin.disabled = false; // tombol aktif setelah data load
  } catch (e) {
    console.error("❌ Gagal load users:", e);
  }
}
loadUsers();

// Login
btnLogin.onclick = () => {
  const u = document.getElementById("loginUser").value.trim();
  const p = document.getElementById("loginPass").value;

  console.log("Input login:", u, p);

  const found = users.find(x => x.username === u && x.password === p);

  if (!found) {
    console.log("❌ Login gagal 😢");
    return; // tidak redirect
  }

  current = found;
  localStorage.setItem("currentUser", JSON.stringify(current));
  console.log("✅ Login sukses:", current);

  location.href = "dashboard.html"; // redirect ke dashboard
};