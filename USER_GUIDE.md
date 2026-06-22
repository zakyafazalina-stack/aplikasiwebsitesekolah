# 📚 PANDUAN LENGKAP - Website Sekolah SMA Maju Jaya

## ✅ Status Sistem

**Backend Server:** ✅ Running di `http://localhost:3000`  
**Database:** ✅ SQLite initialized  
**Admin Panel:** ✅ Accessible di `http://localhost:3000/admin/`  
**Frontend:** ✅ Responsive design dengan API integration  

---

## 🎯 Akses Website

### 1. **Website Frontend (Untuk Pengunjung)**
```
http://localhost:3000/
```

**Halaman yang Tersedia:**
- 🏠 **Beranda** (`/index.html`) - Hero section, berita terbaru, statistik
- ℹ️ **Tentang** (`/pages/about.html`) - Profil sekolah, visi misi
- 📚 **Akademik** (`/pages/academics.html`) - Program, kurikulum
- 👨‍🏫 **Guru** (`/pages/teachers.html`) - Daftar guru (load dari database)
- 📰 **Berita** (`/pages/news.html`) - Artikel berita (load dari database)
- 💌 **Kontak** (`/pages/contact.html`) - Form kontak (kirim ke database)
- 🎨 **Galeri** (`/gallery.html`) - Galeri sekolah

### 2. **Admin Panel (Untuk Staff)**
```
http://localhost:3000/admin/
```

**Login Credentials:**
- **Username:** admin
- **Password:** admin123

**Fitur Admin:**
- 📊 **Dashboard** - Statistik & aktivitas terbaru
- 📰 **Berita** - CRUD berita
- 👨‍🏫 **Guru** - CRUD data guru
- 💌 **Kontak** - Lihat & kelola pesan masuk
- ⚙️ **Pengaturan** - Informasi sekolah

---

## 🔄 Workflow Lengkap

### **Skenario 1: Pengunjung Mengirim Pesan Kontak**

1. Pengunjung membuka halaman Kontak
2. Isi form dengan nama, email, subjek, pesan
3. Klik tombol "Kirim Pesan"
4. Pesan otomatis disimpan ke database
5. Admin menerima notifikasi & lihat di admin panel

### **Skenario 2: Admin Mengelola Berita**

1. Admin login ke admin panel
2. Klik menu "Berita"
3. Pilih aksi:
   - **Tambah**: Klik "Tambah Berita" → isi form → submit
   - **Edit**: Klik tombol "Edit" → ubah konten → submit
   - **Hapus**: Klik tombol "Hapus" → konfirmasi
4. Berita otomatis tampil di website

### **Skenario 3: Admin Mengelola Guru**

1. Admin login ke admin panel
2. Klik menu "Guru"
3. Lakukan aksi yang sama seperti berita
4. Data guru tampil di halaman "Guru" website

### **Skenario 4: Admin Membalas Kontak**

1. Admin login → Klik menu "Kontak"
2. Lihat daftar pesan masuk
3. Klik tombol "Lihat" untuk membaca detail
4. Ubah status:
   - **Baru** → **Dibaca** (saat dibaca)
   - **Dibaca** → **Dijawab** (saat sudah dibalas via email)
5. Klik "Hapus" untuk menghapus pesan

---

## 📡 API Endpoints Reference

### **Public Endpoints** (Tidak perlu login)

```bash
# 1. GET semua guru
curl http://localhost:3000/api/teachers

# Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Nama Guru",
      "subject": "Mata Pelajaran",
      "experience": 15,
      "certification": "S2 Pendidikan"
    },
    ...
  ]
}
```

```bash
# 2. GET guru spesifik
curl http://localhost:3000/api/teachers/1

# Response: Single teacher object
```

```bash
# 3. GET semua berita (sorted terbaru duluan)
curl http://localhost:3000/api/news

# Response: Array of news objects
```

```bash
# 4. POST pesan kontak (dari form website)
curl -X POST http://localhost:3000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nama Pengunjung",
    "email": "pengunjung@email.com",
    "phone": "08123456789",
    "subject": "Pertanyaan",
    "category": "Umum",
    "message": "Isi pesan"
  }'

# Response:
{
  "success": true,
  "message": "Pesan berhasil dikirim"
}
```

### **Protected Endpoints** (Perlu token JWT)

```bash
# 1. LOGIN - Dapatkan token
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'

# Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@smamajujaya.sch.id"
  }
}
```

```bash
# 2. POST guru baru (Perlu token)
TOKEN="eyJhbGc..." # dari login response

curl -X POST http://localhost:3000/api/teachers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Nama Guru Baru",
    "subject": "Matematika",
    "experience": 10,
    "certification": "S1 Matematika",
    "email": "guru@email.com",
    "phone": "08123456789"
  }'
```

```bash
# 3. GET semua kontak masuk (Perlu token)
curl http://localhost:3000/api/contacts \
  -H "Authorization: Bearer $TOKEN"

# Response: Array of contacts dengan status
```

```bash
# 4. GET detail kontak (Perlu token)
curl http://localhost:3000/api/contacts/1 \
  -H "Authorization: Bearer $TOKEN"
```

```bash
# 5. UPDATE status kontak (Perlu token)
curl -X PATCH http://localhost:3000/api/contacts/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "status": "answered"
  }'

# Status options: "new", "read", "answered"
```

```bash
# 6. DELETE kontak (Perlu token)
curl -X DELETE http://localhost:3000/api/contacts/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 💾 Database Structure

```
database/
└── sekolah.db (SQLite3)
    ├── admin (Admin accounts)
    ├── teachers (Data guru)
    ├── news (Artikel berita)
    ├── contacts (Pesan masuk)
    ├── gallery (Galeri sekolah)
    └── settings (Konfigurasi)
```

### **Struktur Tabel**

**admin**
```
id | username | password | email | created_at
1  | admin    | [hashed] | admin@smamajujaya.sch.id | 2024-06-22...
```

**teachers**
```
id | name | subject | experience | certification | email | phone | created_at
1  | Nama | Mapel  | 15        | S2 Pendidikan | email | phone | 2024-06-22...
```

**news**
```
id | title | content | category | author | created_at | updated_at
1  | ... | ... | Umum | Admin | 2024-06-22... | 2024-06-22...
```

**contacts**
```
id | name | email | phone | subject | message | category | status | created_at
1  | ... | ... | ... | ... | ... | Umum | new | 2024-06-22...
```

---

## 🔐 Security & Authentication

### Token JWT
- **Lifetime:** 24 jam
- **Passed in header:** `Authorization: Bearer {token}`
- **Auto-refresh:** Tidak ada (login ulang setelah 24 jam)
- **Storage:** localStorage (browser)

### Password Hashing
- **Algorithm:** bcryptjs (10 salt rounds)
- **Stored:** Hashed di database
- **Verification:** Automatic pada login

### CORS
- **Development:** Enabled untuk semua origin
- **Production:** Set CORS_ORIGIN di .env

---

## 🛠️ Troubleshooting

### ❌ "Server tidak merespons"
```bash
# Pastikan server running
curl http://localhost:3000/api/teachers

# Jika error, restart server
# Tekan Ctrl+C lalu jalankan lagi
npm start
```

### ❌ "Admin panel tidak bisa login"
**Solusi:**
1. Pastikan server running
2. Pastikan database ter-initialize
3. Cek console browser (F12)
4. Reset database:
   ```bash
   rm database/sekolah.db
   node database.js
   npm start
   ```

### ❌ "Form kontak tidak kirim"
**Solusi:**
1. Cek browser console (F12)
2. Pastikan email format valid
3. Lihat Network tab untuk error response
4. Pastikan backend server running

### ❌ "Guru/Berita tidak muncul"
**Solusi:**
1. Buka admin panel & tambah data
2. Refresh halaman website
3. Cek browser console untuk error
4. Periksa API endpoint:
   ```bash
   curl http://localhost:3000/api/teachers
   curl http://localhost:3000/api/news
   ```

---

## 📝 Cheat Sheet

### Quick Commands

```bash
# Start server
npm start

# Install dependencies
npm install

# Reset database
rm database/sekolah.db && node database.js

# Test API
curl http://localhost:3000/api/teachers

# Check if port 3000 is busy
lsof -i :3000

# Kill process on port 3000
kill -9 $(lsof -ti:3000)
```

### URLs to Remember

| Nama | URL |
|------|-----|
| Website | http://localhost:3000 |
| Admin Panel | http://localhost:3000/admin |
| Teachers API | http://localhost:3000/api/teachers |
| News API | http://localhost:3000/api/news |
| Contacts API | http://localhost:3000/api/contacts |

### Default Credentials

| Username | Password |
|----------|----------|
| admin | admin123 |

---

## 🚀 Production Checklist

Sebelum deployment production:

- [ ] Ubah ADMIN_PASSWORD di .env
- [ ] Ubah JWT_SECRET di .env ke string kompleks
- [ ] Set NODE_ENV=production
- [ ] Set CORS_ORIGIN ke domain spesifik
- [ ] Setup HTTPS
- [ ] Backup database regular
- [ ] Monitor error logs
- [ ] Setup email notifications untuk kontak

---

## 📚 File Struktur

```
aplikasiwebsitesekolah/
│
├── 📄 README.md                 (Dokumentasi utama)
├── 📄 BACKEND_SETUP.md          (Setup backend detail)
├── 📄 QUICK_START.md            (Panduan cepat)
├── 📄 package.json              (Dependencies)
├── 📄 .env                       (Environment config)
│
├── 🔧 server.js                 (Backend server Express)
├── 🔧 database.js               (Database initialization)
│
├── 📁 database/
│   └── sekolah.db               (SQLite database)
│
├── 📁 admin/
│   ├── index.html               (Admin panel UI)
│   └── admin.js                 (Admin panel logic)
│
├── 📁 assets/
│   ├── css/style.css            (Responsive styling)
│   ├── js/
│   │   ├── script.js            (Main JavaScript)
│   │   └── api-loader.js        (API integration)
│   └── images/
│
├── 📁 pages/
│   ├── about.html
│   ├── academics.html
│   ├── teachers.html
│   ├── news.html
│   ├── contact.html
│   └── gallery.html
│
└── 📄 index.html                (Homepage)
```

---

## 💬 FAQs

**Q: Bagaimana cara reset admin password?**  
A: Edit .env → ubah ADMIN_PASSWORD → restart server atau reset database

**Q: Bagaimana cara backup database?**  
A: Copy file `database/sekolah.db` ke tempat aman

**Q: Bisa ganti port 3000?**  
A: Edit .env → ubah PORT=3001 → restart server

**Q: Gimana cara deploy?**  
A: Lihat bagian "Deployment Options" di BACKEND_SETUP.md

**Q: Data akan hilang jika restart?**  
A: Tidak, data tersimpan di database/sekolah.db

---

## 📞 Dukungan

**Pertanyaan Teknis:**
- Cek browser console (F12)
- Cek terminal server untuk error
- Test API dengan cURL atau Postman
- Reinstall dependencies

**Tanya Jawab:**
- Baca dokumentasi di atas
- Cek folder docs/
- Tanya ke developer

---

**Website Version:** 2.0 (Full-Stack)  
**Backend:** Node.js + Express  
**Database:** SQLite3  
**Last Updated:** 22 Juni 2024  
**Status:** ✅ Production Ready
