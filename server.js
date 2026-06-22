const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); 
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname)));

// JWT Middleware
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Token tidak ditemukan' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: 'Token tidak valid' });
    }
};

// ===== ADMIN ENDPOINTS =====

// Login Admin
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username dan password harus diisi' });
    }

    db.get(
        'SELECT * FROM admin WHERE username = ?',
        [username],
        (err, user) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Database error' });
            }

            if (!user) {
                return res.status(401).json({ success: false, message: 'Username atau password salah' });
            }

            const isPasswordValid = bcryptjs.compareSync(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ success: false, message: 'Username atau password salah' });
            }

            const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
                expiresIn: '24h'
            });

            res.json({
                success: true,
                message: 'Login berhasil',
                token: token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            });
        }
    );
});

// ===== GURU ENDPOINTS =====

// GET semua guru
app.get('/api/teachers', (req, res) => {
    db.all('SELECT * FROM teachers ORDER BY id', (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.json({ success: true, data: rows });
    });
});

// GET guru by ID
app.get('/api/teachers/:id', (req, res) => {
    db.get('SELECT * FROM teachers WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        if (!row) {
            return res.status(404).json({ success: false, message: 'Guru tidak ditemukan' });
        }
        res.json({ success: true, data: row });
    });
});

// ADD guru (admin only)
app.post('/api/teachers', verifyToken, (req, res) => {
    const { name, subject, experience, certification, email, phone } = req.body;

    if (!name || !subject) {
        return res.status(400).json({ success: false, message: 'Nama dan mata pelajaran harus diisi' });
    }

    db.run(
        'INSERT INTO teachers (name, subject, experience, certification, email, phone) VALUES (?, ?, ?, ?, ?, ?)',
        [name, subject, experience, certification, email, phone],
        function(err) {
            if (err) {
                return res.status(500).json({ success: false, message: 'Gagal menambah guru' });
            }
            res.json({ success: true, message: 'Guru berhasil ditambahkan', id: this.lastID });
        }
    );
});

// UPDATE guru (admin only)
app.put('/api/teachers/:id', verifyToken, (req, res) => {
    const { name, subject, experience, certification, email, phone } = req.body;

    db.run(
        'UPDATE teachers SET name = ?, subject = ?, experience = ?, certification = ?, email = ?, phone = ? WHERE id = ?',
        [name, subject, experience, certification, email, phone, req.params.id],
        function(err) {
            if (err) {
                return res.status(500).json({ success: false, message: 'Gagal mengupdate guru' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ success: false, message: 'Guru tidak ditemukan' });
            }
            res.json({ success: true, message: 'Guru berhasil diupdate' });
        }
    );
});

// DELETE guru (admin only)
app.delete('/api/teachers/:id', verifyToken, (req, res) => {
    db.run('DELETE FROM teachers WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ success: false, message: 'Gagal menghapus guru' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ success: false, message: 'Guru tidak ditemukan' });
        }
        res.json({ success: true, message: 'Guru berhasil dihapus' });
    });
});

// ===== BERITA ENDPOINTS =====

// GET semua berita
app.get('/api/news', (req, res) => {
    db.all('SELECT * FROM news ORDER BY created_at DESC', (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.json({ success: true, data: rows });
    });
});

// GET berita by ID
app.get('/api/news/:id', (req, res) => {
    db.get('SELECT * FROM news WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        if (!row) {
            return res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
        }
        res.json({ success: true, data: row });
    });
});

// ADD berita (admin only)
app.post('/api/news', verifyToken, (req, res) => {
    const { title, content, category, author } = req.body;

    if (!title || !content || !category) {
        return res.status(400).json({ success: false, message: 'Judul, konten, dan kategori harus diisi' });
    }

    db.run(
        'INSERT INTO news (title, content, category, author) VALUES (?, ?, ?, ?)',
        [title, content, category, author || 'Admin'],
        function(err) {
            if (err) {
                return res.status(500).json({ success: false, message: 'Gagal menambah berita' });
            }
            res.json({ success: true, message: 'Berita berhasil ditambahkan', id: this.lastID });
        }
    );
});

// UPDATE berita (admin only)
app.put('/api/news/:id', verifyToken, (req, res) => {
    const { title, content, category, author } = req.body;

    db.run(
        'UPDATE news SET title = ?, content = ?, category = ?, author = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [title, content, category, author, req.params.id],
        function(err) {
            if (err) {
                return res.status(500).json({ success: false, message: 'Gagal mengupdate berita' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
            }
            res.json({ success: true, message: 'Berita berhasil diupdate' });
        }
    );
});

// DELETE berita (admin only)
app.delete('/api/news/:id', verifyToken, (req, res) => {
    db.run('DELETE FROM news WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ success: false, message: 'Gagal menghapus berita' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
        }
        res.json({ success: true, message: 'Berita berhasil dihapus' });
    });
});

// ===== KONTAK ENDPOINTS =====

// GET semua kontak (admin only)
app.get('/api/contacts', verifyToken, (req, res) => {
    db.all('SELECT * FROM contacts ORDER BY created_at DESC', (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.json({ success: true, data: rows });
    });
});

// GET kontak by ID (admin only)
app.get('/api/contacts/:id', verifyToken, (req, res) => {
    db.get('SELECT * FROM contacts WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        if (!row) {
            return res.status(404).json({ success: false, message: 'Kontak tidak ditemukan' });
        }
        
        // Mark as read
        db.run('UPDATE contacts SET read_at = CURRENT_TIMESTAMP, status = ? WHERE id = ?', 
            [row.status === 'new' ? 'read' : row.status, req.params.id]);
        
        res.json({ success: true, data: row });
    });
});

// POST kontak baru (public)
app.post('/api/contacts', (req, res) => {
    const { name, email, phone, subject, message, category } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ 
            success: false, 
            message: 'Nama, email, subjek, dan pesan harus diisi' 
        });
    }

    // Validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Email tidak valid' });
    }

    db.run(
        'INSERT INTO contacts (name, email, phone, subject, message, category, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, email, phone || null, subject, message, category || 'general', 'new'],
        function(err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: 'Gagal mengirim pesan' });
            }
            res.json({ 
                success: true, 
                message: 'Pesan berhasil dikirim. Tim kami akan segera menghubungi Anda.',
                id: this.lastID 
            });
        }
    );
});

// UPDATE status kontak (admin only)
app.patch('/api/contacts/:id', verifyToken, (req, res) => {
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ success: false, message: 'Status harus diisi' });
    }

    db.run(
        'UPDATE contacts SET status = ? WHERE id = ?',
        [status, req.params.id],
        function(err) {
            if (err) {
                return res.status(500).json({ success: false, message: 'Gagal mengupdate status' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ success: false, message: 'Kontak tidak ditemukan' });
            }
            res.json({ success: true, message: 'Status kontak berhasil diupdate' });
        }
    );
});

// DELETE kontak (admin only)
app.delete('/api/contacts/:id', verifyToken, (req, res) => {
    db.run('DELETE FROM contacts WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ success: false, message: 'Gagal menghapus kontak' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ success: false, message: 'Kontak tidak ditemukan' });
        }
        res.json({ success: true, message: 'Kontak berhasil dihapus' });
    });
});

// ===== HEALTH CHECK =====

app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Server berjalan dengan baik' });
});

// Start server
app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════╗
    ║  🏫 SMA MAJU JAYA WEBSITE BACKEND      ║
    ║  Server running on port ${PORT}                ║
    ║  Environment: ${process.env.NODE_ENV}               ║
    ╚════════════════════════════════════════╝

    📍 Local:   http://localhost:${PORT}
    
    🔑 Default Admin:
       Username: admin
       Password: admin123

    📚 API Endpoints:
       - GET  /api/teachers
       - GET  /api/news
       - POST /api/contacts
       - POST /api/admin/login
       
    ℹ️  Buka admin panel: http://localhost:${PORT}/admin/
    `);
});

module.exports = app;
