if(!current){ location.href="index.html"; }

document.getElementById("profileInfo").innerHTML = 
`<b>${current.username}</b> (role: ${current.role}, exp: ${current.exp}, time: ${new Date().toLocaleString()})`;

const tbody = document.getElementById("usersTbody");
const createArea = document.getElementById("createArea");

async function loadUsers(){
  const res = await fetch("users.json");
  const users = await res.json();
  tbody.innerHTML="";
  users.forEach((u,i)=>{
    const tr = document.createElement("tr");
    tr.innerHTML=`<td>${u.username}</td><td>${u.role}</td><td>${u.exp}</td>`;
    const td = document.createElement("td");
    if(['owner','CEO'].includes(current.role)){
      const btn = document.createElement("button");
      btn.className="danger"; btn.textContent="Delete";
      btn.onclick=()=>{ if(confirm("Delete "+u.username+"?")){ users.splice(i,1); render(users); } };
      td.appendChild(btn);
    }
    tr.appendChild(td);
    tbody.appendChild(tr);
  });

  if(canCreateRole(current.role,'reseller')) createArea.classList.remove("hidden");
}
function render(users){ tbody.innerHTML=""; users.forEach((u,i)=>{
  const tr = document.createElement("tr");
  tr.innerHTML=`<td>${u.username}</td><td>${u.role}</td><td>${u.exp}</td>`;
  const td = document.createElement("td");
  if(['owner','CEO'].includes(current.role)){
    const btn = document.createElement("button");
    btn.className="danger"; btn.textContent="Delete";
    btn.onclick=()=>{ if(confirm("Delete "+u.username+"?")){ users.splice(i,1); render(users); } };
    td.appendChild(btn);
  }
  tr.appendChild(td);
  tbody.appendChild(tr);
}); }

document.getElementById("btnCreate").onclick = ()=>{
  const username=document.getElementById("newUser").value.trim();
  const password=document.getElementById("newPass").value;
  const role=document.getElementById("newRole").value;
  const exp=document.getElementById("newExp").value;
  if(!canCreateRole(current.role,role)) return console.log("❌ Tidak bisa buat role ini");
  users.push({username,password,role,exp});
  render(users);
};

document.getElementById("btnLogout").onclick = ()=>{
  localStorage.removeItem("currentUser");
  location.href="index.html";
};

loadUsers();