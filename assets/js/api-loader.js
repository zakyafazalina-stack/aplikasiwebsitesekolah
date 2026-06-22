// Load teachers dari API
async function loadTeachersFromAPI() {
    try {
        const response = await fetch('http://localhost:3000/api/teachers');
        const data = await response.json();

        if (data.success && data.data.length > 0) {
            const container = document.querySelector('.teachers-grid');
            if (container) {
                container.innerHTML = data.data.map(teacher => `
                    <div class="teacher-card">
                        <div class="teacher-avatar">
                            <i class="fas fa-user-tie"></i>
                        </div>
                        <div class="teacher-info">
                            <h3>${teacher.name}</h3>
                            <div class="subject">${teacher.subject}</div>
                            <p style="font-size: 0.9rem; color: #666;">${teacher.experience || 0} tahun pengalaman</p>
                            <div class="qualifications">
                                <strong>Sertifikasi:</strong> ${teacher.certification || 'N/A'}
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }
    } catch (err) {
        console.error('Error loading teachers:', err);
    }
}

// Load news dari API
async function loadNewsFromAPI() {
    try {
        const response = await fetch('http://localhost:3000/api/news');
        const data = await response.json();

        if (data.success && data.data.length > 0) {
            const container = document.querySelector('.news-grid');
            if (container) {
                container.innerHTML = data.data.slice(0, 3).map(news => `
                    <article class="news-card">
                        <div class="news-image">📰</div>
                        <h3>${news.title}</h3>
                        <p>${news.content.substring(0, 150)}...</p>
                        <a href="#">Baca Selengkapnya →</a>
                    </article>
                `).join('');
            }
        }
    } catch (err) {
        console.error('Error loading news:', err);
    }
}

// Load all news ke halaman berita
async function loadAllNewsFromAPI() {
    try {
        const response = await fetch('http://localhost:3000/api/news');
        const data = await response.json();

        if (data.success && data.data.length > 0) {
            const container = document.querySelector('.content-section');
            if (container) {
                const newsHTML = data.data.map(news => `
                    <article class="article">
                        <div class="article-meta">
                            <span class="article-date"><i class="fas fa-calendar"></i> ${new Date(news.created_at).toLocaleDateString('id-ID')}</span>
                            <span class="article-category">${news.category}</span>
                        </div>
                        <h3>${news.title}</h3>
                        <p>${news.content}</p>
                        <a href="#">Baca Selengkapnya →</a>
                    </article>
                `).join('');

                // Find the news grid container
                const newsGrid = document.querySelector('.news-grid') || 
                               document.querySelector('[class*="article"]');
                if (newsGrid) {
                    newsGrid.innerHTML = newsHTML;
                }
            }
        }
    } catch (err) {
        console.error('Error loading all news:', err);
    }
}

// Run when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadTeachersFromAPI();
    loadNewsFromAPI();
    if (window.location.pathname.includes('news')) {
        loadAllNewsFromAPI();
    }
});
