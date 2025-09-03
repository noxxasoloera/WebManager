// =======================
// Konfigurasi GitHub API
// =======================
const REPO = "noxxasoloera/WebManager";
const USERS_FILE = "settings/users.json";
const TOKENS_FILE = "settings/tokens.json";
const GITHUB_API = "https://api.github.com/repos/" + REPO + "/contents/";
const GITHUB_TOKEN = "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"; // ⚠️ isi token GitHub pribadi

let currentUser = null;

// =======================
// Fungsi Login
// =======================
async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const users = await fetchFile(USERS_FILE);
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    alert("❌ Login gagal!");
    return;
  }

  currentUser = user;
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("dashboard").style.display = "flex";

  document.getElementById("profileName").innerText = user.username;
  document.getElementById("profileRole").innerText = "Role: " + user.role;
  document.getElementById("profileExp").innerText = "Exp: " + (user.exp || 0);

  loadMenu(user.role);
  startClock();
}

// =======================
// Menu Role
// =======================
function loadMenu(role) {
  const menu = document.getElementById("menuDropdown");
  menu.innerHTML = "";

  if (role === "owner") {
    addMenuButton(menu, "➕ Add Token", () => addToken());
    addMenuButton(menu, "❌ Del Token", () => delToken());
    addMenuButton(menu, "📜 List Token", () => listToken());
    addMenuButton(menu, "👤 Add User", () => addUser());
    addMenuButton(menu, "🗑️ Del User", () => delUser());
  } else if (role === "partner") {
    addMenuButton(menu, "➕ Add Token", () => addToken());
    addMenuButton(menu, "❌ Del Token", () => delToken());
    addMenuButton(menu, "👤 Add Reseller", () => addUser("reseller"));
  } else if (role === "reseller") {
    addMenuButton(menu, "➕ Add Token", () => addToken());
    addMenuButton(menu, "❌ Del Token", () => delToken());
  }
}

function addMenuButton(menu, text, onclick) {
  const btn = document.createElement("button");
  btn.innerText = text;
  btn.onclick = onclick;
  menu.appendChild(btn);
}

function toggleMenu() {
  const menu = document.getElementById("menuDropdown");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// =======================
// Real-time Clock
// =======================
function startClock() {
  setInterval(() => {
    const now = new Date();
    document.getElementById("clock").innerText = now.toLocaleTimeString();
  }, 1000);
}

// =======================
// GitHub Fetch & Save
// =======================
async function fetchFile(path) {
  const res = await fetch(GITHUB_API + path, {
    headers: { Authorization: `token ${GITHUB_TOKEN}` }
  });
  const data = await res.json();
  return JSON.parse(atob(data.content));
}

async function saveFile(path, content, message) {
  const url = GITHUB_API + path;
  const res = await fetch(url, {
    headers: { Authorization: `token ${GITHUB_TOKEN}` }
  });
  const file = await res.json();

  await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message,
      content: btoa(JSON.stringify(content, null, 2)),
      sha: file.sha
    })
  });
}

// =======================
// Fitur Token & User
// =======================
async function addToken() {
  const token = prompt("Masukkan token bot:");
  if (!token) return;

  const tokens = await fetchFile(TOKENS_FILE);
  tokens.push({ token, addedBy: currentUser.username, time: new Date().toISOString() });
  await saveFile(TOKENS_FILE, tokens, "Add token");

  alert("✅ Token ditambahkan!");
}

async function delToken() {
  const tokens = await fetchFile(TOKENS_FILE);
  const token = prompt("Masukkan token yang ingin dihapus:");
  const newTokens = tokens.filter(t => t.token !== token);
  await saveFile(TOKENS_FILE, newTokens, "Delete token");
  alert("✅ Token dihapus!");
}

async function listToken() {
  const tokens = await fetchFile(TOKENS_FILE);
  alert("📜 Tokens:\n" + tokens.map(t => "- " + t.token).join("\n"));
}

async function addUser(forceRole = null) {
  const username = prompt("Username:");
  const password = prompt("Password:");
  const role = forceRole || prompt("Role (partner/reseller):");

  const users = await fetchFile(USERS_FILE);
  users.push({ username, password, role, exp: 0 });
  await saveFile(USERS_FILE, users, "Add user");

  alert("✅ User ditambahkan!");
}

async function delUser() {
  const username = prompt("Masukkan username yang ingin dihapus:");
  const users = await fetchFile(USERS_FILE);
  const newUsers = users.filter(u => u.username !== username);
  await saveFile(USERS_FILE, newUsers, "Delete user");
  alert("✅ User dihapus!");
}