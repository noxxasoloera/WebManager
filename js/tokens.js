if(!current){ location.href="index.html"; }

document.getElementById("profileInfo").innerHTML = 
`<b>${current.username}</b> (role: ${current.role}, exp: ${current.exp}, time: ${new Date().toLocaleString()})`;

const tbody = document.getElementById("tokensTbody");
const tokenControls = document.getElementById("tokenControls");

async function loadTokens(){
  const res = await fetch("tokens.json");
  let tokens = await res.json();
  render(tokens);
  if(['owner','CEO','mods','partner','reseller'].includes(current.role)){
    tokenControls.classList.remove("hidden");
  }

  document.getElementById("btnAddToken").onclick = ()=>{
    const val = document.getElementById("tokenValue").value.trim();
    if(!val) return;
    tokens.push({value: val, owner: current.username});
    render(tokens);
    document.getElementById("tokenValue").value="";
  };
}

function render(tokens){
  tbody.innerHTML="";
  tokens.forEach((t,i)=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${t.value}</td><td>${t.owner}</td>`;
    const td = document.createElement("td");
    if(['owner','CEO'].includes(current.role)){
      const btn = document.createElement("button");
      btn.className="danger"; btn.textContent="Delete";
      btn.onclick=()=>{ if(confirm("Delete token?")){ tokens.splice(i,1); render(tokens); } };
      td.appendChild(btn);
    }
    tr.appendChild(td);
    tbody.appendChild(tr);
  });
}

document.getElementById("btnLogout").onclick = ()=>{
  localStorage.removeItem("currentUser");
  location.href="index.html";
};

loadTokens();