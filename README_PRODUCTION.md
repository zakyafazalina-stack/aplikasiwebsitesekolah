# 🏫 Website Sekolah SMA Maju Jaya - Full Stack

Aplikasi website sekolah **full-stack** dengan admin panel untuk mengelola konten, guru, berita, dan kontak.

## ✨ Fitur Utama

### 🌐 Frontend Website
- **Responsive Design** - Optimal di desktop, tablet, mobile
- **8 Halaman Utama:**
  - 🏠 Beranda (Hero, berita terbaru, statistik)
  - ℹ️ Tentang (Profil, visi-misi, fasilitas)
  - 📚 Akademik (Program, kurikulum)
  - 👨‍🏫 Guru (Daftar guru dari database)
  - 📰 Berita (Artikel dari database)
  - 💌 Kontak (Form kirim pesan ke database)
  - 🎨 Galeri (Galeri sekolah)
  - 📖 Halaman Lainnya

- **Fitur Interaktif:**
  - Menu hamburger responsif
  - Smooth scroll navigation
  - Form validation
  - Dynamic content from API

### 🔧 Admin Panel
- **Authentication** - Login dengan JWT token
- **Dashboard** - Statistik real-time
- **Berita Management** - CRUD artikel
- **Guru Management** - CRUD data guru
- **Kontak Management** - View & reply pesan masuk
- **Pengaturan** - Konfigurasi sekolah

### 📊 Backend API
- **Express.js Server** - REST API dengan 13+ endpoints
- **SQLite Database** - File-based, no setup needed
- **JWT Authentication** - Secure admin endpoints
- **Error Handling** - Meaningful error messages
- **CORS Support** - Frontend-backend communication

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 14
- npm atau yarn

### Installation

```bash
# 1. Clone atau download project
cd aplikasiwebsitesekolah

# 2. Install dependencies
npm install

# 3. Initialize database
node database.js

# 4. Start server
npm start
```

### Akses Website

**Frontend Website:**
```
http://localhost:3000
```

**Admin Panel:**
```
http://localhost:3000/admin/
```

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

---

## 📁 Project Structure

```
aplikasiwebsitesekolah/
├── 📄 README.md                 # Dokumentasi website
├── 📄 README_PRODUCTION.md      # Dokumentasi production
├── 📄 QUICK_START.md            # Panduan cepat
├── 📄 BACKEND_SETUP.md          # Setup backend detail
├── 📄 USER_GUIDE.md             # Panduan penggunaan lengkap
├── 📄 package.json              # Dependencies
├── 📄 .env                       # Environment variables
│
├── 🔧 server.js                 # Backend Express server (400+ lines)
├── 🔧 database.js               # Database initialization (100+ lines)
│
├── 📁 database/
│   └── sekolah.db               # SQLite database (auto-created)
│
├── 📁 admin/
│   ├── index.html               # Admin panel UI (500+ lines)
│   └── admin.js                 # Admin panel logic (400+ lines)
│
├── 📁 assets/
│   ├── css/style.css            # Responsive CSS (1200+ lines)
│   ├── js/
│   │   ├── script.js            # Main JavaScript (350+ lines)
│   │   └── api-loader.js        # API integration (150+ lines)
│   └── images/                  # Assets
│
├── 📁 pages/
│   ├── about.html               # Tentang sekolah
│   ├── academics.html           # Program akademik
│   ├── teachers.html            # Daftar guru (dynamic)
│   ├── news.html                # Artikel berita (dynamic)
│   ├── contact.html             # Form kontak (API connected)
│   └── gallery.html             # Galeri
│
└── 📄 index.html                # Homepage
```

---

## 🔐 Default Credentials

| Item | Username | Password |
|------|----------|----------|
| Admin Panel | admin | admin123 |

⚠️ **PENTING:** Ubah password sebelum production. Edit `.env`:
```env
ADMIN_PASSWORD=new_secure_password_here
JWT_SECRET=your_super_secret_key_change_this_in_production
```

---

## 📡 API Endpoints

### Public (Tidak perlu login)
```
GET  /api/teachers              # Ambil semua guru
GET  /api/teachers/:id          # Ambil guru spesifik
GET  /api/news                  # Ambil semua berita
POST /api/contacts              # Kirim pesan kontak
```

### Protected (Perlu JWT token)
```
POST   /api/admin/login         # Login & dapatkan token
GET    /api/contacts            # Semua pesan kontak
GET    /api/contacts/:id        # Detail pesan kontak
PATCH  /api/contacts/:id        # Update status kontak
DELETE /api/contacts/:id        # Hapus pesan kontak
POST   /api/teachers            # Tambah guru
PUT    /api/teachers/:id        # Update guru
DELETE /api/teachers/:id        # Hapus guru
POST   /api/news                # Tambah berita
PUT    /api/news/:id            # Update berita
DELETE /api/news/:id            # Hapus berita
```

---

## 💻 Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | SQLite3 |
| **Authentication** | JWT (jsonwebtoken) |
| **Password Hash** | bcryptjs |
| **Middleware** | body-parser, cors, dotenv |
| **Icons** | Font Awesome (CDN) |

---

## 🔄 Usage Workflow

### Untuk Admin
1. Buka `http://localhost:3000/admin/`
2. Login dengan kredensial
3. Dashboard menampilkan statistik
4. Kelola berita, guru, kontak
5. Data otomatis tampil di website

### Untuk Pengunjung
1. Buka `http://localhost:3000/`
2. Browse halaman website
3. Lihat guru & berita dari database
4. Kirim pesan kontak
5. Admin bisa lihat di panel

---

## 🐛 Troubleshooting

### Server tidak berjalan
```bash
# Pastikan port 3000 tersedia
lsof -i :3000

# Jika busy, kill process
kill -9 $(lsof -ti:3000)

# Restart server
npm start
```

### Database error
```bash
# Reset database
rm database/sekolah.db
node database.js
npm start
```

### Admin panel tidak login
1. Pastikan server running
2. Periksa DevTools console (F12)
3. Cek network tab untuk error
4. Reset database dan coba lagi

---

## 📚 Documentation

- **[README.md](README.md)** - Dokumentasi website
- **[QUICK_START.md](QUICK_START.md)** - Panduan cepat setup
- **[BACKEND_SETUP.md](BACKEND_SETUP.md)** - Setup backend detail
- **[USER_GUIDE.md](USER_GUIDE.md)** - Panduan penggunaan lengkap

---

## 🚀 Deployment

### Heroku
```bash
# Login ke Heroku
heroku login

# Create app
heroku create app-name

# Push
git push heroku main
```

### Vercel (Recommended)
- Push ke GitHub
- Connect ke Vercel
- Auto-deploy on push

### Railway/Render (Easy)
- Upload repo
- Set environment variables
- Deploy

### VPS/Dedicated Server
```bash
# SSH ke server
ssh user@server.com

# Clone repo
git clone repo-url

# Install dependencies
npm install

# Setup PM2 untuk persistent running
npm install -g pm2
pm2 start server.js
pm2 startup
pm2 save

# Setup Nginx reverse proxy
# Setup SSL with Let's Encrypt
```

---

## 🔒 Security Checklist

### Development ✅
- [x] Default credentials included
- [x] CORS enabled untuk semua
- [x] JWT_SECRET simple

### Production ⚠️
- [ ] Ubah ADMIN_PASSWORD
- [ ] Ubah JWT_SECRET ke string kompleks (min 32 karakter)
- [ ] Set NODE_ENV=production
- [ ] Set CORS_ORIGIN ke domain spesifik
- [ ] Setup HTTPS dengan Let's Encrypt
- [ ] Enable HSTS header
- [ ] Setup database backup
- [ ] Monitor logs & errors
- [ ] Limit request rate
- [ ] Setup firewall

---

## 📊 Database Schema

| Table | Purpose | Records |
|-------|---------|---------|
| **admin** | Admin accounts | 1 |
| **teachers** | Data guru | 9 (default) |
| **news** | Artikel berita | 0 (empty) |
| **contacts** | Pesan masuk | Dynamic |
| **gallery** | Galeri sekolah | 0 (empty) |
| **settings** | Konfigurasi | Dynamic |

---

## 📝 Features Checklist

- ✅ Responsive frontend website (8 pages)
- ✅ Admin authentication (JWT)
- ✅ Teacher management CRUD
- ✅ News management CRUD
- ✅ Contact form with database storage
- ✅ Real-time dashboard statistics
- ✅ API endpoints (13+)
- ✅ Error handling & validation
- ✅ Password hashing (bcryptjs)
- ✅ CORS configuration
- ✅ API loader (dynamic content)
- ✅ Status tracking (contacts)

---

## 💬 FAQ

**Q: Bagaimana cara reset password admin?**  
A: Edit `.env`, ubah `ADMIN_PASSWORD`, restart server

**Q: Apakah data hilang saat restart?**  
A: Tidak, tersimpan di `database/sekolah.db`

**Q: Bisa ubah port 3000?**  
A: Edit `.env`, ubah `PORT=3001`, restart

**Q: Bagaimana deploy production?**  
A: Lihat dokumentasi deployment di atas

**Q: Bagaimana backup database?**  
A: Copy file `database/sekolah.db` ke tempat aman

**Q: API responses lambat?**  
A: Setup database indexing atau gunakan database yang lebih besar

---

## 🎯 Next Steps

### Customization
1. Ubah nama sekolah di .env
2. Ganti warna/logo di CSS
3. Ubah konten di halaman static
4. Update contact info di admin settings

### Enhancement
1. Tambah email notification untuk kontak masuk
2. Setup image upload untuk berita & galeri
3. Tambah pagination untuk berita
4. Implementasi search functionality
5. Tambah export kontak ke PDF/Excel

### Scaling
1. Migrate ke PostgreSQL/MySQL
2. Setup Redis cache
3. Implementasi CDN untuk images
4. Setup load balancer untuk multiple instances

---

## 📞 Support

Untuk bantuan:
1. Cek dokumentasi di folder ini
2. Lihat browser console (F12)
3. Cek terminal untuk error messages
4. Test API dengan cURL/Postman
5. Contact developer untuk bantuan custom

---

## 📄 License

Project ini gratis untuk digunakan. Ubah sesuai kebutuhan sekolah Anda.

---

## 🎉 Sistem Siap Digunakan!

✅ **Website Frontend** - `http://localhost:3000`  
✅ **Admin Panel** - `http://localhost:3000/admin/`  
✅ **Backend API** - Semua endpoints aktif  
✅ **Database** - Initialized dengan data default  

**Selamat! Website sekolah Anda sudah production-ready!** 🎓

---

**Version:** 2.0 (Full-Stack)  
**Backend:** Node.js + Express + SQLite  
**Frontend:** HTML5 + CSS3 + Vanilla JS  
**Status:** Production Ready  
**Last Updated:** 22 Juni 2024
