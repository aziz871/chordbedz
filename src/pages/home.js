import { SongService } from '../services/songService.js';

export class HomePage {
    constructor() {
        this.songService = new SongService();
        this.songs = [];
        this.filteredSongs = [];
    }

    async render() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="container">
                <header class="header">
                    <div class="header-content">
                        <h1 class="logo" data-logo>🎸 ChordBedz</h1>
                        <nav class="nav">
                            <input type="text" id="searchInput" class="search-bar" placeholder="Cari lagu...">
                            <button id="darkModeToggle" class="btn-dark-mode">🌙</button>
                            <a href="#/faq" class="btn-nav">FAQ & Kontak</a>
                        </nav>
                    </div>
                </header>

                <main class="main-content">
                    <section class="hero">
                        <h2>Kumpulan Chord Gitar Indonesia</h2>
                        <p>Temukan chord lagu favorit Anda dengan mudah</p>
                    </section>

                    <section class="songs-grid" id="songsGrid">
                        <div class="loading">Memuat lagu...</div>
                    </section>
                </main>

                <footer class="footer">
                    <p>&copy; 2024 ChordBedz by Bedz | WA: <a href="https://wa.me/628311056439">+62 831-1056-0439</a> | Email: <a href="mailto:ytzizgans@gmail.com">ytzizgans@gmail.com</a></p>
                </footer>
            </div>
        `;

        await this.loadSongs();
        this.setupEventListeners();
    }

    async loadSongs() {
        try {
            this.songs = await this.songService.getAllSongs();
            this.filteredSongs = this.songs;
            this.displaySongs();
        } catch (error) {
            console.error('Error loading songs:', error);
            alert('Gagal memuat lagu');
        }
    }

    displaySongs() {
        const grid = document.getElementById('songsGrid');
        if (this.filteredSongs.length === 0) {
            grid.innerHTML = '<p class="no-results">Lagu tidak ditemukan</p>';
            return;
        }

        grid.innerHTML = this.filteredSongs.map(song => `
            <div class="song-card" onclick="window.location.hash = '/detail/${song.id}'">
                <img src="${song.cover_url || 'https://via.placeholder.com/250x200'}" alt="${song.judul}" class="song-cover">
                <div class="song-info">
                    <h3 class="song-title">${song.judul}</h3>
                    <p class="song-artist">${song.artis}</p>
                    <p class="song-key">Kunci: ${song.kunci_dasar}</p>
                </div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));

        const darkModeBtn = document.getElementById('darkModeToggle');
        darkModeBtn.addEventListener('click', () => this.toggleDarkMode());
    }

    handleSearch(query) {
        query = query.toLowerCase();
        this.filteredSongs = this.songs.filter(song => 
            song.judul.toLowerCase().includes(query) || 
            song.artis.toLowerCase().includes(query)
        );
        this.displaySongs();
    }

    toggleDarkMode() {
        document.documentElement.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.documentElement.classList.contains('dark-mode'));
    }
}
