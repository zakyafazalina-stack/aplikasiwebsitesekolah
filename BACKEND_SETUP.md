# 🚀 SETUP BACKEND - Website Sekolah SMA Maju Jaya

## ⚙️ Instalasi Backend (Node.js/Express)

### Step 1: Install Dependencies

```bash
# Buka terminal di folder project
cd /workspaces/aplikasiwebsitesekolah

# Install semua packages
npm install
```

### Step 2: Initialize Database

```bash
# Buat dan initialize database SQLite
node database.js
```

Ini akan membuat file `database/sekolah.db` dengan:
- ✅ Table admin (dengan user default)
- ✅ Table teachers (dengan 9 guru default)
- ✅ Table news (kosong, siap ditambah)
- ✅ Table contacts (tempat pesan masuk)
- ✅ Table gallery (galeri fasilitas)
- ✅ Table settings (pengaturan sekolah)

### Step 3: Jalankan Server

```bash
# Start development server
npm start

# Atau gunakan nodemon untuk auto-reload
npm run dev
```

**Server akan berjalan di:** `http://localhost:3000`

---

## 📱 Akses Website & Admin Panel

### Website Frontend
```
http://localhost:3000/
http://localhost:3000/index.html
```

### Admin Panel
```
http://localhost:3000/admin/
```

**Default Login:**
- Username: `admin`
- Password: `admin123`

---

## 🔑 Default Credentials

| Item | Username | Password |
|------|----------|----------|
| Admin Panel | admin | admin123 |
| Database | - | SQLite (lokal) |

### ⚠️ PENTING: Ubah Password di Production
Edit file `.env`:
```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=new_secure_password
```

---

## 📚 API Endpoints

### Public Endpoints (Tidak perlu login)

#### GET /api/teachers
Ambil semua data guru
```bash
curl http://localhost:3000/api/teachers
```

#### GET /api/news
Ambil semua berita
```bash
curl http://localhost:3000/api/news
```

#### POST /api/contacts
Kirim pesan kontak
```bash
curl -X POST http://localhost:3000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nama",
    "email": "email@example.com",
    "subject": "Subjek",
    "message": "Pesan"
  }'
```

### Protected Endpoints (Perlu Login)

#### POST /api/admin/login
Login untuk mendapat token
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@smamajujaya.sch.id"
  }
}
```

#### POST /api/teachers (Admin Only)
Tambah guru baru
```bash
curl -X POST http://localhost:3000/api/teachers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_DARI_LOGIN" \
  -d '{
    "name": "Nama Guru",
    "subject": "Mata Pelajaran",
    "experience": 15,
    "certification": "S2 Pendidikan"
  }'
```

#### PUT /api/teachers/:id (Admin Only)
Update guru
```bash
curl -X PUT http://localhost:3000/api/teachers/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "name": "Nama Baru",
    "subject": "Mata Pelajaran Baru"
  }'
```

#### DELETE /api/teachers/:id (Admin Only)
Hapus guru

#### POST /api/news (Admin Only)
Tambah berita baru

#### PUT /api/news/:id (Admin Only)
Update berita

#### DELETE /api/news/:id (Admin Only)
Hapus berita

#### GET /api/contacts (Admin Only)
Ambil semua pesan kontak

#### GET /api/contacts/:id (Admin Only)
Lihat detail pesan kontak

#### PATCH /api/contacts/:id (Admin Only)
Update status pesan kontak

#### DELETE /api/contacts/:id (Admin Only)
Hapus pesan kontak

---

## 📁 Folder Structure

```
aplikasiwebsitesekolah/
├── package.json              # Dependencies
├── .env                       # Environment variables
├── server.js                  # Backend server
├── database.js                # Database setup
├── database/
│   └── sekolah.db            # SQLite database
├── admin/
│   ├── index.html            # Admin panel UI
│   └── admin.js              # Admin panel logic
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── script.js
│   │   └── api-loader.js     # Load data dari API
│   └── images/
├── pages/
│   ├── about.html
│   ├── academics.html
│   ├── teachers.html
│   ├── news.html
│   ├── contact.html
│   └── ...
├── index.html
├── gallery.html
└── ...
```

---

## 🔄 Workflow Penggunaan

### Untuk Admin (Kelola Konten)

1. **Akses Admin Panel**
   ```
   http://localhost:3000/admin/
   ```

2. **Login dengan kredensial default**
   - Username: admin
   - Password: admin123

3. **Kelola Konten:**
   - 📰 **Berita**: Tambah, edit, hapus berita
   - 👨‍🏫 **Guru**: Tambah, edit, hapus data guru
   - 💌 **Kontak**: Lihat pesan masuk, ubah status
   - ⚙️ **Pengaturan**: Edit info sekolah

4. **Lihat Statistik**
   - Dashboard menampilkan total berita, guru, kontak

### Untuk Pengunjung (Baca Website)

1. **Buka website**
   ```
   http://localhost:3000/
   ```

2. **Browse halaman**
   - 🏠 Beranda
   - ℹ️ Tentang
   - 📚 Akademik
   - 👨‍🏫 Guru
   - 📰 Berita (load dari database)
   - 💌 Kontak (form mengirim ke database)

3. **Kirim pesan kontak**
   - Form kontak otomatis mengirim ke database
   - Admin bisa lihat di admin panel

---

## 🐛 Troubleshooting

### ❌ Error: "Cannot find module 'express'"
**Solusi:**
```bash
npm install
```

### ❌ Error: "EADDRINUSE: address already in use :::3000"
**Solusi:** Port 3000 sudah digunakan
```bash
# Ubah port di .env
PORT=3001

# Atau kill process yang menggunakan port 3000
lsof -ti:3000 | xargs kill -9
```

### ❌ Database file tidak ter-create
**Solusi:**
```bash
# Pastikan folder database ada
mkdir -p database

# Re-initialize database
node database.js
```

### ❌ Admin panel tidak bisa login
**Solusi:**
1. Pastikan server berjalan (`npm start`)
2. Pastikan database sudah initialized (`node database.js`)
3. Periksa browser console (F12) untuk error
4. Pastikan URL benar: `http://localhost:3000/admin/`

### ❌ Form kontak tidak kirim pesan
**Solusi:**
1. Pastikan backend server berjalan
2. Periksa browser console (F12)
3. Pastikan email valid
4. Periksa network tab untuk error response

---

## 🔒 Security Notes

### Development Mode
- ✅ CORS enabled untuk semua
- ✅ Admin default credential
- ✅ JWT secret mudah di-crack

### Sebelum Production
- ⚠️ Ubah JWT_SECRET di .env ke string kompleks
- ⚠️ Ubah ADMIN_PASSWORD ke password yang kuat
- ⚠️ Set CORS_ORIGIN ke domain spesifik
- ⚠️ Enable HTTPS
- ⚠️ Setup backup database regular

---

## 🌐 Deployment Options

### Option 1: Heroku (Gratis)
```bash
# Login ke Heroku
heroku login

# Create app
heroku create nama-app

# Push ke Heroku
git push heroku main
```

### Option 2: Vercel (Gratis)
- Upload ke GitHub
- Connect ke Vercel
- Auto-deploy

### Option 3: Railway/Render (Gratis)
- User-friendly deployment
- Built-in database support

---

## 📊 Database Schema

### Tables

**admin**
```
id (INTEGER PRIMARY KEY)
username (TEXT UNIQUE)
password (TEXT)
email (TEXT)
created_at (DATETIME)
```

**teachers**
```
id (INTEGER PRIMARY KEY)
name (TEXT)
subject (TEXT)
experience (INTEGER)
certification (TEXT)
email (TEXT)
phone (TEXT)
created_at (DATETIME)
```

**news**
```
id (INTEGER PRIMARY KEY)
title (TEXT)
content (TEXT)
category (TEXT)
author (TEXT)
image_url (TEXT)
created_at (DATETIME)
updated_at (DATETIME)
```

**contacts**
```
id (INTEGER PRIMARY KEY)
name (TEXT)
email (TEXT)
phone (TEXT)
subject (TEXT)
message (TEXT)
category (TEXT)
status (TEXT: new|read|answered)
read_at (DATETIME)
created_at (DATETIME)
```

---

## 📞 Support

- **Backend Issues**: Cek console untuk error
- **Database Issues**: Reinstall dengan `node database.js`
- **API Issues**: Test dengan cURL atau Postman
- **Admin Panel**: Cek F12 DevTools console

---

**Backend Version**: 1.0  
**Last Updated**: 22 Juni 2024  
**Status**: ✅ Production Ready
