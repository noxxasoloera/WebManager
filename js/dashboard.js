document.addEventListener("DOMContentLoaded",()=>{
  if(!current) return location.href="index.html";
  renderDashboard();
});

function renderDashboard(){
  document.getElementById("welcome").innerHTML=
    `<h2>Halo, ${current.username} 👋</h2>
     <p>Role kamu: <b>${current.role}</b></p>`;

  const totalUsers=users.length;
  const totalTokens=tokens.length;
  const expiringUsers=users.filter(u=>u.exp && new Date(u.exp)<new Date(Date.now()+3*24*60*60*1000)).length;
  const expiringTokens=tokens.filter(t=>t.exp && new Date(t.exp)<new Date(Date.now()+3*24*60*60*1000)).length;

  document.getElementById("stats").innerHTML=`
    <ul>
      <li>👥 Total Users: <b>${totalUsers}</b></li>
      <li>🔑 Total Tokens: <b>${totalTokens}</b></li>
      <li>⚠️ User hampir Expired (3 hari): <b>${expiringUsers}</b></li>
      <li>⚠️ Token hampir Expired (3 hari): <b>${expiringTokens}</b></li>
    </ul>
  `;
}