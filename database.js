const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'sekolah.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Gagal membuka database:', err);
    } else {
        console.log('Database terhubung');
        initDatabase();
    }
});

function initDatabase() {
    // Tabel Admin
    db.run(`
        CREATE TABLE IF NOT EXISTS admin (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            email TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.log('Table admin sudah ada atau error:', err);
    });

    // Tabel Guru
    db.run(`
        CREATE TABLE IF NOT EXISTS teachers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            subject TEXT NOT NULL,
            experience INTEGER,
            certification TEXT,
            email TEXT,
            phone TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.log('Table teachers sudah ada atau error:', err);
    });

    // Tabel Berita
    db.run(`
        CREATE TABLE IF NOT EXISTS news (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            category TEXT NOT NULL,
            author TEXT,
            image_url TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.log('Table news sudah ada atau error:', err);
    });

    // Tabel Kontak
    db.run(`
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            subject TEXT NOT NULL,
            message TEXT NOT NULL,
            category TEXT,
            status TEXT DEFAULT 'new',
            read_at DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.log('Table contacts sudah ada atau error:', err);
    });

    // Tabel Galeri
    db.run(`
        CREATE TABLE IF NOT EXISTS gallery (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            image_url TEXT NOT NULL,
            category TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.log('Table gallery sudah ada atau error:', err);
    });

    // Tabel Settings
    db.run(`
        CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key TEXT UNIQUE NOT NULL,
            value TEXT,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.log('Table settings sudah ada atau error:', err);
        else insertDefaultData();
    });
}

function insertDefaultData() {
    const bcrypt = require('bcryptjs');
    
    // Insert default admin
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.run(
        `INSERT OR IGNORE INTO admin (username, password, email) VALUES (?, ?, ?)`,
        ['admin', hashedPassword, 'admin@smamajujaya.sch.id'],
        (err) => {
            if (err) console.log('Admin sudah ada atau error:', err);
            else console.log('Admin default dibuat');
        }
    );

    // Insert default teachers
    const teachers = [
        ['Drs. Budi Santoso', 'Fisika', 20, 'S2 Pendidikan Fisika, TOEFL'],
        ['Siti Nurhaliza, M.Pd', 'Bahasa Indonesia', 15, 'S2 Pendidikan Bahasa, Penulis'],
        ['Ir. Ahmad Wijaya', 'Kimia', 18, 'S2 Pendidikan Kimia'],
        ['Dr. Lidia Kusuma', 'Biologi', 22, 'S3 Pendidikan Biologi'],
        ['Hendra Gunawan, M.Si', 'Matematika', 17, 'S2 Matematika, Pelatih Olimpiade'],
        ['Sophie Anderson, BA', 'Bahasa Inggris', 12, 'Native Speaker, TOEIC, Cambridge'],
        ['Dr. Bambang Heriyanto', 'Sejarah', 19, 'S3 Pendidikan Sejarah, Dosen Tamu'],
        ['Rini Prasetyo, M.Pd', 'Ekonomi', 14, 'S2 Pendidikan Ekonomi'],
        ['Yoga Pratama', 'Olahraga', 11, 'Pelatih Cabang Olahraga Nasional']
    ];

    teachers.forEach(teacher => {
        db.run(
            `INSERT OR IGNORE INTO teachers (name, subject, experience, certification) VALUES (?, ?, ?, ?)`,
            teacher,
            (err) => {
                if (err) console.log('Error insert teacher:', err);
            }
        );
    });

    console.log('Default data inserted successfully');
}

module.exports = db;
