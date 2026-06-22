# 📋 IMPLEMENTATION GUIDE - Website SMA Maju Jaya

## 🎯 Quick Start

### Step 1: Setup Lokal
```bash
# 1. Clone atau download repository
git clone <repository-url>
cd aplikasiwebsitesekolah

# 2. Buka di VS Code
code .

# 3. Install Live Server extension di VS Code
# Cari "Live Server" di Extensions

# 4. Klik kanan index.html > Open with Live Server
```

### Step 2: Kustomisasi Awal
```bash
# Find & Replace nama sekolah
# Ctrl+H atau Cmd+H
# Cari: "SMA Maju Jaya"
# Replace dengan nama sekolah Anda
```

### Step 3: Edit Konten
1. Buka setiap halaman HTML
2. Ubah:
   - Nama sekolah
   - Alamat dan kontak
   - Daftar guru
   - Berita/pengumuman
   - Data akademik

---

## 📱 Responsive Testing

### Mobile Sizes to Test
- iPhone SE: 375px
- iPhone 12: 390px
- Android (Samsung S20): 360px
- iPad Mini: 768px
- iPad Pro: 1024px
- Desktop: 1920px

### Testing Tools
```bash
# Chrome DevTools
# F12 > Toggle device toolbar (Ctrl+Shift+M)

# Firefox Developer Tools
# F12 > Responsive Design Mode
```

---

## 🎨 Customization Guide

### 1. Mengubah Warna

**File:** `assets/css/style.css`

```css
:root {
    --primary-color: #2c3e50;      /* Warna utama (navbar) */
    --secondary-color: #3498db;    /* Warna highlight */
    --accent-color: #e74c3c;       /* Warna aksen */
    --light-color: #ecf0f1;        /* Warna terang */
    --dark-color: #34495e;         /* Warna gelap */
    --text-color: #333;            /* Warna teks */
}
```

**Contoh perubahan warna:**
```css
/* Material Design Colors */
--primary-color: #1976d2;      /* Blue */
--secondary-color: #dc004e;    /* Pink */
--accent-color: #ff9800;       /* Orange */

/* atau Teal Theme */
--primary-color: #00796b;      /* Teal */
--secondary-color: #4db6ac;    /* Light Teal */
--accent-color: #00897b;       /* Dark Teal */
```

### 2. Menambah Halaman Baru

**Template minimal:**
```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Halaman Baru - SMA Maju Jaya</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <!-- Navbar -->
    <!-- Content -->
    <!-- Footer -->
    
    <script src="assets/js/script.js"></script>
</body>
</html>
```

### 3. Menambah Guru Baru

**File:** `pages/teachers.html`

```html
<!-- Copy template ini dan ubah data -->
<div class="teacher-card">
    <div class="teacher-avatar">
        <i class="fas fa-user-tie"></i>
    </div>
    <div class="teacher-info">
        <h3>Nama Guru</h3>
        <div class="subject">Mata Pelajaran</div>
        <p style="font-size: 0.9rem; color: #666;">X tahun pengalaman</p>
        <div class="qualifications">
            <strong>Sertifikasi:</strong> Pendidikan + Kualifikasi
        </div>
    </div>
</div>
```

### 4. Menambah Berita

**File:** `pages/news.html`

```html
<!-- Copy template ini dan ubah konten -->
<article class="article">
    <div class="article-meta">
        <span class="article-date"><i class="fas fa-calendar"></i> DD Bulan YYYY</span>
        <span class="article-category">Kategori</span>
    </div>
    <h3>Judul Berita</h3>
    <p>Konten paragraph pertama...</p>
    <p>Konten paragraph kedua...</p>
    <a href="#">Baca Selengkapnya →</a>
</article>
```

---

## 💻 Backend Integration

### Option 1: PHP dengan Kontak Form

**File:** `php/send-email.php`

```php
<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $subject = htmlspecialchars($_POST['subject']);
    $message = htmlspecialchars($_POST['message']);
    
    // Validasi email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Email tidak valid']);
        exit;
    }
    
    // Kirim email
    $to = 'admin@smamajujaya.sch.id';
    $headers = "From: " . $email;
    $fullMessage = "Dari: $name\nEmail: $email\n\n$message";
    
    if (mail($to, $subject, $fullMessage, $headers)) {
        echo json_encode(['success' => true, 'message' => 'Pesan terkirim']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Gagal mengirim']);
    }
}
?>
```

**Update di contact.html:**
```javascript
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    
    const response = await fetch('php/send-email.php', {
        method: 'POST',
        body: formData
    });
    
    const result = await response.json();
    
    if (result.success) {
        showNotification(result.message, 'success');
        this.reset();
    } else {
        showNotification(result.message, 'error');
    }
});
```

### Option 2: Node.js dengan Express

**File:** `server.js`

```javascript
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Setup email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;
    
    try {
        await transporter.sendMail({
            from: email,
            to: 'admin@smamajujaya.sch.id',
            subject: subject,
            text: `Dari: ${name}\nEmail: ${email}\n\n${message}`
        });
        
        res.json({ success: true, message: 'Pesan terkirim' });
    } catch (error) {
        res.json({ success: false, message: 'Gagal mengirim' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### Option 3: Database dengan MySQL

```sql
-- Create database
CREATE DATABASE sma_maju_jaya;
USE sma_maju_jaya;

-- Teachers table
CREATE TABLE teachers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    subject VARCHAR(50),
    experience INT,
    certification TEXT,
    photo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- News table
CREATE TABLE news (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    content LONGTEXT,
    category VARCHAR(50),
    author VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Contact messages table
CREATE TABLE contacts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    subject VARCHAR(200),
    message LONGTEXT,
    status VARCHAR(20) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students table (future)
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    class VARCHAR(10),
    parent_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔒 Security Checklist

### Frontend Security
- [ ] Validasi form input
- [ ] Sanitize user input
- [ ] HTTPS only
- [ ] No sensitive data in code

### Backend Security
- [ ] Validate all input server-side
- [ ] Use prepared statements for SQL
- [ ] Hash passwords dengan bcrypt/argon2
- [ ] Rate limiting untuk API
- [ ] CORS configuration
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection

### Deployment Security
- [ ] SSL/TLS certificate
- [ ] Firewall configuration
- [ ] Regular backups
- [ ] Update dependencies
- [ ] Monitor access logs
- [ ] Disable file listing
- [ ] Set proper permissions

---

## 📊 Analytics Integration

### Google Analytics

**Tambahkan di head semua halaman:**
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Event Tracking

```javascript
// Track button clicks
document.querySelector('.btn').addEventListener('click', function() {
    gtag('event', 'button_click', {
        'button_text': this.textContent
    });
});

// Track form submissions
document.getElementById('contactForm').addEventListener('submit', function() {
    gtag('event', 'form_submit', {
        'form_name': 'contact_form'
    });
});
```

---

## 🚀 Deployment Options

### Option 1: Shared Hosting (PHP)
1. Upload via FTP
2. Database MySQL included
3. Cost: $5-15/bulan
3. Providers: Hostinger, Niagahoster, Bluehost

### Option 2: VPS
1. Full control
2. SSH access
3. Can run Node.js, Python, etc.
4. Cost: $5-50+/bulan
5. Providers: DigitalOcean, Linode, AWS

### Option 3: Static Hosting (Free)
1. No backend needed initially
2. Vercel, Netlify, GitHub Pages
3. Cost: Free tier available
4. Easy CI/CD

### Option 4: Cloud Platforms
1. AWS, Google Cloud, Azure
2. Auto-scaling
3. CDN included
4. Cost: Pay-as-you-go

---

## 📈 Performance Optimization

### Image Optimization
```bash
# Convert to WebP
cwebp image.jpg -o image.webp

# Resize images
convert image.jpg -resize 1920x1080 optimized.jpg

# Compress
jpegoptim --size=200k image.jpg
```

### CSS/JS Minification
```bash
# Using CSS minifier
npx cssnano input.css -o output.min.css

# Using JS minifier
npx uglify-js input.js -o output.min.js
```

### Caching Strategy
```html
<!-- Cache busting dengan versioning -->
<link rel="stylesheet" href="assets/css/style.css?v=1.0">
<script src="assets/js/script.js?v=1.0"></script>
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Menu tidak muncul di mobile
**Solution:**
```javascript
// Pastikan hamburger click listener aktif
const hamburger = document.querySelector('.hamburger');
if (!hamburger) console.error('Hamburger element tidak ditemukan');
```

### Issue 2: CSS tidak ter-load
```html
<!-- Periksa path relatif -->
<!-- BENAR untuk pages/ -->
<link rel="stylesheet" href="../assets/css/style.css">
<!-- SALAH -->
<link rel="stylesheet" href="assets/css/style.css">
```

### Issue 3: Form tidak submit
```javascript
// Debug form
document.getElementById('contactForm')?.addEventListener('submit', (e) => {
    console.log('Form submitted');
    e.preventDefault();
});
```

### Issue 4: Animasi lambat
```css
/* Gunakan transform + opacity untuk performa terbaik */
.feature-card {
    transition: transform 0.3s ease, opacity 0.3s ease; /* Good */
    /* JANGAN gunakan */
    transition: all 0.3s ease;
}
```

---

## 📞 Support & Documentation

### Resources
- MDN Web Docs: https://developer.mozilla.org
- CSS Tricks: https://css-tricks.com
- JavaScript.info: https://javascript.info
- Font Awesome: https://fontawesome.com

### Get Help
- Stack Overflow: https://stackoverflow.com
- GitHub Issues: Report bugs
- Community Forums: Web development communities

---

**Last Updated**: 22 Juni 2024
**Version**: 1.0
