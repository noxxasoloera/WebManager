document.addEventListener("DOMContentLoaded",()=>{
  renderProfile();
  loadData().then(()=>{
    const tbody=document.getElementById("usersTbody");
    function renderUsers(){
      tbody.innerHTML="";
      users.forEach((u,i)=>{
        const tr=document.createElement("tr");
        tr.innerHTML=`<td>${u.username}</td><td>${u.role}</td>`;
        const td=document.createElement("td");
        if(['owner','CEO'].includes(current.role)){
          const btn=document.createElement("button");
          btn.textContent="Delete";
          btn.className="primary";
          btn.onclick=()=>{ if(confirm("Hapus "+u.username+"?")){ users.splice(i,1); renderUsers(); } };
          td.appendChild(btn);
        }
        tr.appendChild(td);
        tbody.appendChild(tr);
      });
    }
    renderUsers();

    if(canCreateRole(current.role,"reseller")){
      document.getElementById("userControls").classList.remove("hidden");
    }
    document.getElementById("btnCreate").onclick=()=>{
      const username=document.getElementById("newUser").value.trim();
      const password=document.getElementById("newPass").value;
      const role=document.getElementById("newRole").value;
      const exp=document.getElementById("newExp").value;
      if(!canCreateRole(current.role,role)) return alert("Tidak bisa buat role ini");
      if(users.find(u=>u.username===username)) return alert("Sudah ada");
      users.push({username,password,role,exp});
      renderUsers();
    };
  });
});
