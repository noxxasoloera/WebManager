if(btnLogin){
  btnLogin.onclick=()=>{
    const u=document.getElementById("loginUser").value.trim();
    const p=document.getElementById("loginPass").value;
    const found=users.find(x=>x.username===u && x.password===p);
    if(!found){
      console.log("❌ Login gagal 😢");
      return;
    }
    current=found;
    localStorage.setItem("currentUser",JSON.stringify(current));
    location.href="dashboard.html"; // ⬅️ diarahkan ke dashboard
  };
}