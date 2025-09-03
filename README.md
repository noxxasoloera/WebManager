# 🤖 Cyberpunk Telegram Token Manager

Sistem manajemen **Token Telegram Bot** & **User Role** (Owner / Partner / Reseller)  
dengan **database otomatis di GitHub** (`users.json` & `tokens.json`).  
UI bertema **dark cyberpunk 3D glowing** ⚡


## ✨ Fitur

### 🔑 Role & Hak Akses
- **Owner**
  - ➕ Add Token
  - ❌ Delete Token
  - 📜 List Token
  - 👤 Add User (Partner & Reseller)
  - 🗑️ Delete User
- **Partner**
  - ➕ Add Token
  - ❌ Delete Token
  - 👤 Add Reseller
- **Reseller**
  - ➕ Add Token
  - ❌ Delete Token


### 🛠️ Teknologi
- **Frontend**: HTML, CSS (Cyberpunk UI)
- **Logic**: Vanilla JavaScript
- **Database**: GitHub Repository (REST API v3)
- **Auth**: GitHub Personal Access Token


## 📂 Struktur Repo

WebManager/ ├── index.html       # UI login & dashboard ├── script.js        # Logic CRUD GitHub API └── settings/ ├── users.json  # Database akun (owner, partner, reseller) └── tokens.json # Database token Telegram bot


## ⚡ Konfigurasi

### 1. Buat Repo GitHub
- Nama misalnya: `WebManager`
- Buat folder `settings/`  
- Tambahkan file:
  - `users.json`
  - `tokens.json`

### 2. Isi Awal JSON
`settings/users.json`
```json
[
  {
    "username": "admin",
    "password": "12345",
    "role": "owner",
    "exp": "2099-12-31"
  }
]

settings/tokens.json

[]

3. Buat GitHub Token

Masuk Settings > Developer settings > PAT

Buat token dengan scope:

repo (untuk read & write file JSON)



4. Edit script.js

Isi:

const REPO = "username/WebManager"; // ganti dengan repo kamu
const GITHUB_TOKEN = "ghp_xxxxxxxx"; // isi token kamu



🚀 Jalankan

1. Deploy ke Vercel / Netlify atau buka langsung index.html.


2. Login dengan username & password dari users.json.


3. Atur token dan akun reseller/partner langsung dari dashboard.





📸 Screenshots

### 🔐 Login Page
![Login Page](https://files.catbox.moe/abcd12.png)

### 🛰️ Dashboard (Owner)
![Dashboard Owner](https://files.catbox.moe/xyz789.png)

### 🛒 Dashboard (Reseller)
![Dashboard Reseller](https://files.catbox.moe/qwe456.png)








⚡ Catatan

Semua perubahan (addtoken, deltoken, adduser, dll) otomatis commit ke GitHub.

exp bisa dipakai untuk sistem expired akun (opsional).




🧑‍💻 Author

Made with ❤️ by Noxxasoloera