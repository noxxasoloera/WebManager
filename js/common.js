const USERS_URL = "https://raw.githubusercontent.com/noxxasoloera/WebManager/refs/heads/main/users.json";
const TOKENS_URL = "https://raw.githubusercontent.com/noxxasoloera/WebManager/refs/heads/main/tokens.json";

let users = [];
let tokens = [];
// Ambil current user dari localStorage
let current = JSON.parse(localStorage.getItem("currentUser") || "null");

// Fungsi cek role untuk create akun
function canCreateRole(role, target) {
  if (role === 'owner') return true;
  if (role === 'CEO') return target !== 'owner';
  if (role === 'mods') return ['partner','reseller'].includes(target);
  if (role === 'partner') return target === 'reseller';
  return false;
}

async function loadData(){
  try {
    const u = await fetch(USERS_URL).then(r=>r.json());
    const t = await fetch(TOKENS_URL).then(r=>r.json());
    users = Array.isArray(u)? u : u.users;
    tokens = Array.isArray(t)? t : t.tokens;
  } catch(e){ console.error(e); }
}

function renderProfile(){
  if(!current) return;
  const el=document.getElementById("profile");
  if(el) el.innerHTML=`Login sebagai: <b>${current.username}</b> (role: ${current.role})`;
}