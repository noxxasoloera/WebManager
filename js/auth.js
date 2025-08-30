let users = [];
let current = null;
const USERS_URL = "users.json";
const btnLogin = document.getElementById("btnLogin");

async function loadUsers(){
  try{
    const res = await fetch(USERS_URL);
    users = await res.json();
    console.log("✅ Users loaded:", users);
    btnLogin.disabled = false;
  }catch(e){
    console.error("❌ Gagal load users:",e);
  }
}
loadUsers();

btnLogin.onclick = () => {
  const u = document.getElementById("loginUser").value.trim();
  const p = document.getElementById("loginPass").value;

  const found = users.find(x=>x.username===u && x.password===p);

  if(!found){ console.log("❌ Login gagal 😢"); return; }

  current = found;
  localStorage.setItem("currentUser", JSON.stringify(current));
  console.log("✅ Login sukses:", current);

  location.href = "dashboard.html";
};
