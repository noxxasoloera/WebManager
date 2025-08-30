document.addEventListener("DOMContentLoaded",()=>{
  renderProfile();
  loadData().then(()=>{
    const tbody=document.getElementById("tokensTbody");
    function renderTokens(){
      tbody.innerHTML="";
      if(['owner','CEO'].includes(current.role)){
        tokens.forEach((t,i)=>{
          const tr=document.createElement("tr");
          tr.innerHTML=`<td>${t.value}</td><td>${t.owner}</td>`;
          const td=document.createElement("td");
          const btn=document.createElement("button");
          btn.textContent="Delete";
          btn.className="primary";
          btn.onclick=()=>{ if(confirm("Hapus token?")){ tokens.splice(i,1); renderTokens(); } };
          td.appendChild(btn);
          tr.appendChild(td);
          tbody.appendChild(tr);
        });
      } else {
        tbody.innerHTML="<tr><td colspan='3'>Tidak bisa melihat token</td></tr>";
      }
    }
    renderTokens();

    if(['owner','CEO','mods','partner','reseller'].includes(current.role)){
      document.getElementById("tokenControls").classList.remove("hidden");
    }
    document.getElementById("btnAddToken").onclick=()=>{
      const val=document.getElementById("tokenValue").value.trim();
      if(!val) return;
      tokens.push({value:val,owner:current.username});
      renderTokens();
    };
  });
});