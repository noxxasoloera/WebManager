document.addEventListener("DOMContentLoaded", async () => {
  if (!current) return location.href = "index.html";

  renderProfile();
  startClock();
  await loadData();
  renderUsers();

  // Atur create akun sesuai role
  if (canCreateRole(current.role, "reseller")) {
    document.getElementById("userControls").classList.remove("hidden");
  }

  document.getElementById("btnCreate").onclick = () => {
    const username = document.getElementById("newUser").value.trim();
    const password = document.getElementById("newPass").value;
    const role = document.getElementById("newRole").value;
    const exp = document.getElementById("newExp").value;

    if (!canCreateRole(current.role, role)) return alert("Tidak bisa buat role ini");
    if (users.find(u => u.username === username)) return alert("Sudah ada");

    users.push({ username, password, role, exp });
    renderUsers();
  };

  // Logout
  document.getElementById("btnLogout").onclick = () => {
    localStorage.removeItem("currentUser");
    location.href = "index.html";
  };
});

// render profil login
function renderProfile() {
  const el = document.getElementById("profile");
  el.innerHTML = `
    <p><b>Username:</b> ${current.username}</p>
    <p><b>Password:</b> ${current.password}</p>
    <p><b>Role:</b> ${current.role}</p>
    <p><b>Exp:</b> ${current.exp || '-'}</p>
  `;
}

// clock real-time
function startClock() {
  setInterval(() => {
    document.getElementById("clock").textContent = "⏰ " + new Date().toLocaleString();
  }, 1000);
}

// render tabel semua user
function renderUsers() {
  const tbody = document.getElementById("usersTbody");
  tbody.innerHTML = "";

  users.forEach((u, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${u.username}</td><td>${u.role}</td><td>${u.exp || '-'}</td>`;
    const td = document.createElement("td");

    if (['owner', 'CEO'].includes(current.role)) {
      const btn = document.createElement("button");
      btn.textContent = "Hapus";
      btn.className = "danger"; // tombol merah
      btn.onclick = () => {
        if (confirm(`Hapus user ${u.username}?`)) {
          users.splice(i, 1);
          renderUsers();
        }
      };
      td.appendChild(btn);
    } else {
      td.textContent = "❌"; // tidak bisa hapus
    }

    tr.appendChild(td);
    tbody.appendChild(tr);
  });
}