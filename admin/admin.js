// Admin Panel JavaScript

const API_URL = 'http://localhost:3000/api';
let authToken = localStorage.getItem('authToken');
let currentEditId = null;
let currentEditType = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (authToken) {
        showDashboard();
        loadDashboardData();
    } else {
        document.getElementById('loginForm').addEventListener('submit', handleLogin);
    }
});

// ===== LOGIN =====
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');

    try {
        const response = await fetch(`${API_URL}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            document.getElementById('adminUsername').textContent = data.user.username;
            showDashboard();
            loadDashboardData();
            document.getElementById('loginForm').reset();
        } else {
            errorDiv.textContent = data.message;
            errorDiv.style.display = 'block';
        }
    } catch (err) {
        errorDiv.textContent = 'Error: ' + err.message;
        errorDiv.style.display = 'block';
    }
}

// ===== DASHBOARD =====
function showDashboard() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    setupMenuLinks();
}

function setupMenuLinks() {
    document.querySelectorAll('.menu-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const section = e.target.dataset.section;
            switchSection(section);
        });
    });
}

function switchSection(section) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.menu-link').forEach(link => link.classList.remove('active'));

    // Show selected section
    document.getElementById(section).classList.add('active');
    document.querySelector(`[data-section="${section}"]`).classList.add('active');

    // Update title
    const titles = {
        dashboard: '📊 Dashboard',
        news: '📰 Berita',
        teachers: '👨‍🏫 Guru',
        contacts: '💌 Kontak Masuk',
        settings: '⚙️ Pengaturan'
    };
    document.getElementById('pageTitle').textContent = titles[section];

    // Load data if needed
    if (section === 'news') loadNews();
    if (section === 'teachers') loadTeachers();
    if (section === 'contacts') loadContacts();
}

async function loadDashboardData() {
    try {
        // Load stats
        const newsRes = await fetch(`${API_URL}/news`);
        const newsData = await newsRes.json();
        document.getElementById('totalNews').textContent = newsData.data.length;

        const teachersRes = await fetch(`${API_URL}/teachers`);
        const teachersData = await teachersRes.json();
        document.getElementById('totalTeachers').textContent = teachersData.data.length;

        const contactsRes = await fetch(`${API_URL}/contacts`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const contactsData = await contactsRes.json();
        document.getElementById('totalContacts').textContent = contactsData.data.length;
        const newCount = contactsData.data.filter(c => c.status === 'new').length;
        document.getElementById('newContacts').textContent = newCount;

        // Load recent activity
        const recentActivity = document.getElementById('recentActivity');
        if (contactsData.data.length > 0) {
            const recent = contactsData.data.slice(0, 5);
            recentActivity.innerHTML = recent.map(contact => `
                <div style="padding: 10px; border-bottom: 1px solid #eee;">
                    <strong>${contact.name}</strong> - ${contact.subject}
                    <span style="float: right; color: #999; font-size: 0.85rem;">${new Date(contact.created_at).toLocaleDateString('id-ID')}</span>
                </div>
            `).join('');
        }
    } catch (err) {
        console.error('Error loading dashboard data:', err);
    }
}

// ===== NEWS MANAGEMENT =====
async function loadNews() {
    try {
        const response = await fetch(`${API_URL}/news`);
        const data = await response.json();
        
        const tbody = document.getElementById('newsList');
        tbody.innerHTML = data.data.map((news, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${news.title.substring(0, 50)}...</td>
                <td>${news.category}</td>
                <td>${news.author || 'Admin'}</td>
                <td>${new Date(news.created_at).toLocaleDateString('id-ID')}</td>
                <td>
                    <button class="btn-small btn-edit" onclick="editNews(${news.id})">Edit</button>
                    <button class="btn-small btn-delete" onclick="deleteNews(${news.id})">Hapus</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('Error loading news:', err);
    }
}

function showAddNewsModal() {
    currentEditId = null;
    currentEditType = 'news';
    document.getElementById('newsModalTitle').textContent = 'Tambah Berita Baru';
    document.getElementById('newsForm').reset();
    document.getElementById('newsModal').classList.add('show');
}

function editNews(id) {
    currentEditId = id;
    currentEditType = 'news';
    // In a real app, you'd fetch the news data and populate the form
    document.getElementById('newsModalTitle').textContent = 'Edit Berita';
    document.getElementById('newsModal').classList.add('show');
}

function closeNewsModal() {
    document.getElementById('newsModal').classList.remove('show');
    currentEditId = null;
}

document.getElementById('newsForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newsData = {
        title: document.getElementById('newsTitle').value,
        content: document.getElementById('newsContent').value,
        category: document.getElementById('newsCategory').value,
        author: document.getElementById('newsAuthor').value
    };

    try {
        const url = currentEditId 
            ? `${API_URL}/news/${currentEditId}`
            : `${API_URL}/news`;
        const method = currentEditId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(newsData)
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message);
            closeNewsModal();
            loadNews();
            loadDashboardData();
        } else {
            alert('Error: ' + data.message);
        }
    } catch (err) {
        alert('Error: ' + err.message);
    }
});

async function deleteNews(id) {
    if (!confirm('Yakin ingin menghapus berita ini?')) return;

    try {
        const response = await fetch(`${API_URL}/news/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        const data = await response.json();

        if (data.success) {
            alert('Berita berhasil dihapus');
            loadNews();
            loadDashboardData();
        } else {
            alert('Error: ' + data.message);
        }
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

// ===== TEACHERS MANAGEMENT =====
async function loadTeachers() {
    try {
        const response = await fetch(`${API_URL}/teachers`);
        const data = await response.json();
        
        const tbody = document.getElementById('teachersList');
        tbody.innerHTML = data.data.map((teacher, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${teacher.name}</td>
                <td>${teacher.subject}</td>
                <td>${teacher.experience || '-'} tahun</td>
                <td>${teacher.email || '-'}</td>
                <td>
                    <button class="btn-small btn-edit" onclick="editTeacher(${teacher.id})">Edit</button>
                    <button class="btn-small btn-delete" onclick="deleteTeacher(${teacher.id})">Hapus</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('Error loading teachers:', err);
    }
}

function showAddTeacherModal() {
    currentEditId = null;
    currentEditType = 'teacher';
    document.getElementById('teacherModalTitle').textContent = 'Tambah Guru Baru';
    document.getElementById('teacherForm').reset();
    document.getElementById('teacherModal').classList.add('show');
}

function editTeacher(id) {
    currentEditId = id;
    currentEditType = 'teacher';
    document.getElementById('teacherModalTitle').textContent = 'Edit Guru';
    document.getElementById('teacherModal').classList.add('show');
}

function closeTeacherModal() {
    document.getElementById('teacherModal').classList.remove('show');
    currentEditId = null;
}

document.getElementById('teacherForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const teacherData = {
        name: document.getElementById('teacherName').value,
        subject: document.getElementById('teacherSubject').value,
        experience: parseInt(document.getElementById('teacherExperience').value) || 0,
        certification: document.getElementById('teacherCertification').value,
        email: document.getElementById('teacherEmail').value,
        phone: document.getElementById('teacherPhone').value
    };

    try {
        const url = currentEditId 
            ? `${API_URL}/teachers/${currentEditId}`
            : `${API_URL}/teachers`;
        const method = currentEditId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(teacherData)
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message);
            closeTeacherModal();
            loadTeachers();
            loadDashboardData();
        } else {
            alert('Error: ' + data.message);
        }
    } catch (err) {
        alert('Error: ' + err.message);
    }
});

async function deleteTeacher(id) {
    if (!confirm('Yakin ingin menghapus guru ini?')) return;

    try {
        const response = await fetch(`${API_URL}/teachers/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        const data = await response.json();

        if (data.success) {
            alert('Guru berhasil dihapus');
            loadTeachers();
            loadDashboardData();
        } else {
            alert('Error: ' + data.message);
        }
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

// ===== CONTACTS MANAGEMENT =====
async function loadContacts() {
    try {
        const response = await fetch(`${API_URL}/contacts`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await response.json();
        
        const tbody = document.getElementById('contactsList');
        tbody.innerHTML = data.data.map((contact, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${contact.name}</td>
                <td>${contact.email}</td>
                <td>${contact.subject.substring(0, 30)}...</td>
                <td><span class="status-badge status-${contact.status}">${contact.status}</span></td>
                <td>${new Date(contact.created_at).toLocaleDateString('id-ID')}</td>
                <td>
                    <button class="btn-small btn-view" onclick="viewContact(${contact.id})">Lihat</button>
                    <button class="btn-small btn-delete" onclick="deleteContact(${contact.id})">Hapus</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('Error loading contacts:', err);
    }
}

async function viewContact(id) {
    try {
        const response = await fetch(`${API_URL}/contacts/${id}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await response.json();
        const contact = data.data;

        const detailDiv = document.getElementById('contactDetail');
        detailDiv.innerHTML = `
            <div style="line-height: 1.8;">
                <p><strong>Nama:</strong> ${contact.name}</p>
                <p><strong>Email:</strong> <a href="mailto:${contact.email}">${contact.email}</a></p>
                <p><strong>Telepon:</strong> ${contact.phone || '-'}</p>
                <p><strong>Kategori:</strong> ${contact.category || '-'}</p>
                <p><strong>Subjek:</strong> ${contact.subject}</p>
                <p><strong>Pesan:</strong></p>
                <div style="background: #f9f9f9; padding: 15px; border-radius: 6px; margin-top: 10px;">
                    ${contact.message}
                </div>
                <p><strong>Tanggal:</strong> ${new Date(contact.created_at).toLocaleString('id-ID')}</p>
                <p><strong>Status:</strong> 
                    <select onchange="updateContactStatus(${id}, this.value)" style="padding: 5px;">
                        <option value="new" ${contact.status === 'new' ? 'selected' : ''}>Baru</option>
                        <option value="read" ${contact.status === 'read' ? 'selected' : ''}>Dibaca</option>
                        <option value="answered" ${contact.status === 'answered' ? 'selected' : ''}>Dijawab</option>
                    </select>
                </p>
            </div>
        `;
        document.getElementById('contactModal').classList.add('show');
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

async function updateContactStatus(id, status) {
    try {
        const response = await fetch(`${API_URL}/contacts/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ status })
        });

        const data = await response.json();

        if (data.success) {
            loadContacts();
            loadDashboardData();
        }
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

function closeContactModal() {
    document.getElementById('contactModal').classList.remove('show');
}

async function deleteContact(id) {
    if (!confirm('Yakin ingin menghapus kontak ini?')) return;

    try {
        const response = await fetch(`${API_URL}/contacts/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        const data = await response.json();

        if (data.success) {
            alert('Kontak berhasil dihapus');
            loadContacts();
            loadDashboardData();
        } else {
            alert('Error: ' + data.message);
        }
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

// ===== LOGOUT =====
function logout() {
    if (confirm('Yakin ingin logout?')) {
        localStorage.removeItem('authToken');
        authToken = null;
        location.reload();
    }
}

// ===== CLOSE MODALS =====
window.onclick = function(event) {
    const newsModal = document.getElementById('newsModal');
    const teacherModal = document.getElementById('teacherModal');
    const contactModal = document.getElementById('contactModal');

    if (event.target === newsModal) newsModal.classList.remove('show');
    if (event.target === teacherModal) teacherModal.classList.remove('show');
    if (event.target === contactModal) contactModal.classList.remove('show');
}
