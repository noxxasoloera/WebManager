// =======================
// Konfigurasi
// =======================
const API_USERS   = 'https://api.github.com/repos/noxxasoloera/WebManager/contents/settings/users.json';
const API_NUMBERS = 'https://api.github.com/repos/noxxasoloera/WebManager/contents/settings/numbers.json';
const API_TOKENS  = 'https://api.github.com/repos/noxxasoloera/WebManager/contents/settings/tokens.json';
const TOKEN_GITHUB  = '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';  // ganti dengan token GitHub repo kamu

let state = { 
  user:null, 
  role:null, 
  loginList:[], 
  numbers:[], 
  tokens:[], 
  numbersSha:null,
  tokensSha:null,
  usersSha:null        // << tambahan
};

// =======================
// Helper umum
// =======================
function toast(el, msg, ok=true){ 
  if(!el) return;
  el.textContent = msg; 
  el.style.color = ok? 'var(--success)':'var(--danger)'; 
}

function setView(id){
  document.querySelectorAll('main[id^="view-"]').forEach(m=>m.classList.add('hidden'));
  document.getElementById('view-'+id).classList.remove('hidden');
  document.querySelectorAll('.menu a').forEach(a=>a.classList.remove('active'));
  const link = document.querySelector(`.menu a[data-view="${id}"]`);
  if(link) link.classList.add('active');
  drawer.classList.remove('open');
  window.scrollTo({top:0, behavior:'smooth'});
}

// =======================
// Login / Session
// =======================
async function loadLogins(){
  const res = await githubGet(API_USERS);
  if(res.notFound){ 
    state.loginList = []; 
    state.usersSha = null; 
  } else {
    state.loginList = Array.isArray(res.content) ? res.content : [];
    state.usersSha = res.sha;
  }
}

async function doLogin(username, password){
  await loadLogins();
  const found = state.loginList.find(u => u.username === username && u.password === password);
  if(!found) return null;
  state.user = username; 
  state.role = found.role;
  localStorage.setItem('session', JSON.stringify({u:username, r:found.role}));
  return found;
}

function restoreSession(){
  const s = localStorage.getItem('session');
  if(!s) return;
  const {u, r} = JSON.parse(s);
  state.user = u; 
  state.role = r;
  document.getElementById('who').textContent = u + ' • ' + r;
  document.getElementById('userBadge').classList.remove('hidden');
  document.getElementById('roleChip').textContent = r;
  document.getElementById('btnHamburger').classList.remove('hidden');
  if(r === 'admin') document.getElementById('adminSection').classList.remove('hidden');
  setView('dashboard');
  renderAccounts();
  loadNumbers();
  loadTokens();
}

function logout(){
  localStorage.removeItem('session'); 
  location.reload();
}

// =======================
// Account management
// =======================
function renderAccounts(){
  const body = document.getElementById('accountsTable');
  if(!body) return;
  body.innerHTML = '';
  state.loginList.forEach((u, i)=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${i+1}</td><td>${u.username}</td><td>${u.role}</td>
      <td><button class="btn danger" data-deluser="${u.username}"><i class="fa-solid fa-user-xmark"></i> Hapus</button></td>`;
    body.appendChild(tr);
  });
  document.querySelectorAll('[data-deluser]').forEach(b=>{
    b.onclick = async ()=>{
      if(!confirm('Hapus user '+b.dataset.deluser+' ?')) return;
      state.loginList = state.loginList.filter(x=>x.username!==b.dataset.deluser);
      const result = await githubPut(API_USERS, state.loginList, `delete user ${b.dataset.deluser}`, state.usersSha);
      state.usersSha = result.content?.sha || result.sha || state.usersSha;
      renderAccounts();
      toast(accMsg, "User dihapus", true);
    }
  })
}

async function createAccount(u,p,r){
  if(!u||!p) throw new Error('Username & password wajib');
  if(state.loginList.some(x=>x.username===u)) throw new Error('Username sudah ada');

  const newAcc = {username:u, password:p, role:r};
  state.loginList.push(newAcc);

  const result = await githubPut(API_USERS, state.loginList, `add user ${u}`, state.usersSha);
  state.usersSha = result.content?.sha || result.sha || state.usersSha;

  renderAccounts();
}

// =======================
// GitHub helper
// =======================
async function githubGet(url){
  const res = await fetch(url, { headers:{Authorization:`token ${TOKEN_GITHUB}`, Accept:'application/vnd.github+json'} });
  if(res.status === 404) return {content:null, sha:null, notFound:true};
  if(!res.ok) throw new Error('GitHub GET failed: '+res.status);
  const data = await res.json();
  const decoded = data.content ? JSON.parse(atob(data.content)) : null;
  return {content:decoded, sha:data.sha};
}

async function githubPut(url, jsonContent, message, sha){
  const body = { message, content: btoa(JSON.stringify(jsonContent, null, 2)), sha: sha || undefined };
  const res = await fetch(url, {
    method:'PUT',
    headers:{'Content-Type':'application/json', Authorization:`token ${TOKEN_GITHUB}`, Accept:'application/vnd.github+json'},
    body: JSON.stringify(body)
  });
  if(!res.ok) throw new Error('GitHub PUT failed: '+res.status);
  return await res.json();
}

// =======================
// Numbers feature
// =======================
async function loadNumbers(){
  const res = await githubGet(API_NUMBERS);
  if(res.notFound){ 
    state.numbers = []; 
    state.numbersSha = null; 
  }
  else { 
    state.numbers = Array.isArray(res.content) ? res.content : []; 
    state.numbersSha = res.sha; 
  }
  renderNumbers();
}

async function addNumber(num){
  if(!/^\d{6,20}$/.test(num)) throw new Error('Nomor hanya angka 6-20 digit');
  if(state.numbers.some(n => n.nomor === num)) throw new Error('Nomor sudah ada');
  state.numbers.push({ nomor: num });
  const result = await githubPut(API_NUMBERS, state.numbers, `add number ${num}`, state.numbersSha);
  state.numbersSha = result.content?.sha || result.sha || state.numbersSha;
  renderNumbers();
}

async function deleteNumber(num){
  state.numbers = state.numbers.filter(n=>n.nomor!==num);
  const result = await githubPut(API_NUMBERS, state.numbers, `delete number ${num}`, state.numbersSha);
  state.numbersSha = result.content?.sha || result.sha || state.numbersSha;
  renderNumbers();
}

function renderNumbers(){
  const tbody = document.getElementById('numbersTable');
  if(!tbody) return;
  tbody.innerHTML = '';
  state.numbers.forEach((n,i)=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${i+1}</td><td>${n.nomor}</td>
      <td><button class="btn danger" data-delnum="${n.nomor}"><i class="fa fa-trash"></i> Hapus</button></td>`;
    tbody.appendChild(tr);
  });
  document.querySelectorAll('[data-delnum]').forEach(btn=>{
    btn.onclick=()=>{ if(confirm('Hapus nomor '+btn.dataset.delnum+' ?')) deleteNumber(btn.dataset.delnum); }
  })
}

// =======================
// Tokens feature (Telegram bot)
// =======================
async function loadTokens(){
  const res = await githubGet(API_TOKENS);
  if(res.notFound){ 
    state.tokens = []; 
    state.tokensSha = null; 
  }
  else { 
    state.tokens = Array.isArray(res.content) ? res.content : []; 
    state.tokensSha = res.sha; 
  }
  renderTokens();
}

async function addToken(tok){
  if(!/^(\d+:[\w-]{20,})$/.test(tok)) throw new Error('Token tidak valid');
  if(state.tokens.some(t => t.token === tok)) throw new Error('Token sudah ada');
  state.tokens.push({ token: tok });
  const result = await githubPut(API_TOKENS, state.tokens, `add token`, state.tokensSha);
  state.tokensSha = result.content?.sha || result.sha || state.tokensSha;
  renderTokens();
}

async function deleteToken(tok){
  state.tokens = state.tokens.filter(t=>t.token!==tok);
  const result = await githubPut(API_TOKENS, state.tokens, `delete token`, state.tokensSha);
  state.tokensSha = result.content?.sha || result.sha || state.tokensSha;
  renderTokens();
}

function renderTokens(){
  const tbody = document.getElementById('tokensTable');
  if(!tbody) return;
  tbody.innerHTML = '';
  state.tokens.forEach((t,i)=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${i+1}</td><td>${t.token}</td>
      <td><button class="btn danger" data-deltok="${t.token}"><i class="fa fa-trash"></i> Hapus</button></td>`;
    tbody.appendChild(tr);
  });
  document.querySelectorAll('[data-deltok]').forEach(btn=>{
    btn.onclick=()=>{ if(confirm('Hapus token ini?')) deleteToken(btn.dataset.deltok); }
  })
}

// =======================
// Event listeners
// =======================
const formLogin = document.getElementById('formLogin');
const loginMsg = document.getElementById('loginMsg');
const accMsg   = document.getElementById('accMsg');
const drawer   = document.getElementById('drawer');

document.getElementById('btnHamburger').onclick = ()=> drawer.classList.toggle('open');
document.getElementById('btnLogout').onclick = logout;

document.querySelectorAll('.menu a[data-view]').forEach(a=>{
  a.addEventListener('click', async (e)=>{
    e.preventDefault(); 
    const v = a.dataset.view; 
    setView(v);
    if(v==='accounts'){ await loadLogins(); renderAccounts(); }
    if(v==='list'){ loadNumbers(); }
  })
})

formLogin?.addEventListener('submit', async (e)=>{
  e.preventDefault(); 
  loginMsg.textContent = 'Memeriksa…';
  const u = document.getElementById('username').value.trim();
  const p = document.getElementById('password').value.trim();
  try{
    const ok = await doLogin(u,p);
    if(!ok){ toast(loginMsg, 'Username atau password salah', false); return; }
    toast(loginMsg, 'Berhasil masuk');
    document.getElementById('who').textContent = u + ' • ' + ok.role;
    document.getElementById('userBadge').classList.remove('hidden');
    document.getElementById('roleChip').textContent = ok.role;
    if(ok.role==='admin') document.getElementById('adminSection').classList.remove('hidden');
    document.getElementById('btnHamburger').classList.remove('hidden');
    setView('dashboard');
    loadNumbers();
    loadTokens();
  }catch(err){ toast(loginMsg, err.message, false); }
});

document.getElementById('btnCreate')?.addEventListener('click', async()=>{
  if(state.role!=='admin'){ toast(accMsg,'Hanya admin', false); return }
  const u = document.getElementById('newUser').value.trim();
  const p = document.getElementById('newPass').value.trim();
  const r = document.getElementById('newRole').value;
  try{ 
    await createAccount(u,p,r); 
    toast(accMsg,'Akun dibuat'); 
    document.getElementById('newUser').value=''; 
    document.getElementById('newPass').value='' 
  }
  catch(e){ toast(accMsg, e.message, false) }
});

document.getElementById('btnAddNumber')?.addEventListener('click', async()=>{
  const field = document.getElementById('numberInput');
  if(!field) return;
  try{ 
    await addNumber(field.value.trim());
    toast(accMsg,'Nomor ditambahkan'); 
    field.value=''; 
  } catch(e){ toast(accMsg, e.message, false) }
});

// =======================
// Animasi + Config
// =======================
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible') })
}, {threshold:.15});
document.querySelectorAll('.reveal').forEach(el=> io.observe(el));

(function(){
  const chars = ["N","o","x","x","a"," ","S","o","l","o"];
  const name = chars.join("");
  document.getElementById("brand").textContent = name;
})();

async function loadConfig(){
  try{
    const res = await fetch("settings/config.json");
    if(!res.ok) throw new Error("Gagal load config.json");
    const cfg = await res.json();
    const year = new Date().getFullYear();
    document.getElementById("code").innerHTML = 
      `© ${year} ${cfg.copyright} <a href="${cfg.link}" target="_blank">${cfg.nama}</a>`;
  }catch(e){ console.error("Config error:", e); }
}

loadConfig();
restoreSession();
