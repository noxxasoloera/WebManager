let users = [];
let current = null;

const USERS_URL = "https://raw.githubusercontent.com/noxxasoloera/WebManager/main/users.json";

// Load data dari GitHub
async function loadUsers() {
  try {
    const res = await fetch(USERS_URL);
    users = await res.json();
    console.log("✅ Users loaded:", users);
  } catch (e) {
    console.error("❌ Gagal load users:", e);
  }
}

// Fungsi login
document.getElementById("btnLogin").onclick = async () => {
  await loadUsers(); // pastikan users sudah load sebelum cek login

  const u = document.getElementById("loginUser").value.trim();
  const p = document.getElementById("loginPass").value;

  const found = users.find(x => x.username === u && x.password === p);

  if (!found) {
    console.log("❌ Login gagal 😢");
    return; // tidak redirect, hanya log
  }

  current = found;
  localStorage.setItem("currentUser", JSON.stringify(current));
  console.log("✅ Login sukses:", current);

  location.href = "dashboard.html"; // masuk dashboard
};

// Logout
const btnLogout = document.getElementById("btnLogout");
if (btnLogout) {
  btnLogout.onclick = () => {
    localStorage.removeItem("currentUser");
    location.href = "index.html";
  };
}
