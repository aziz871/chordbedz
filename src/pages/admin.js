import { SongService } from '../services/songService.js';
import { SongRequestService } from '../services/songRequestService.js';
import { BedzAI } from '../utils/bedzAI.js';

export class AdminPanel {
    constructor() {
        this.songService = new SongService();
        this.songRequestService = new SongRequestService();
        this.bedzAI = new BedzAI();
        this.songs = [];
        this.requests = [];
        this.currentTab = 'songs';
        this.aiData = {};
    }

    async render() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="admin-panel">
                <header class="admin-header">
                    <h1>🎸 ChordBedz Admin Panel</h1>
                    <button class="btn-logout" onclick="window.location.hash = '/'\">← Keluar</button>
                </header>

                <nav class="admin-nav">
                    <button class="tab-btn active" data-tab="songs">📚 Daftar Lagu</button>
                    <button class="tab-btn" data-tab="add-song">➕ Tambah Lagu</button>
                    <button class="tab-btn" data-tab="requests">🎤 Request Lagu</button>
                </nav>

                <main class="admin-content">
                    <section class="tab-content active" id="tab-songs">
                        <h2>Daftar Lagu</h2>
                        <input type="text" id="searchSongs" class="search-bar" placeholder="Cari lagu...">
                        <div class="songs-table-container" id="songsTable"></div>
                    </section>

                    <section class="tab-content" id="tab-add-song">
                        <h2>Tambah Lagu Baru</h2>
                        <div class="add-song-container">
                            <div class="ai-input-section">
                                <h3>🤖 Gunakan BedzAI untuk Extract Data</h3>
                                <div class="form-group">
                                    <label>Paste Link (ChordTela, YouTube, Spotify, dll)</label>
                                    <input type="text" id="aiLinkInput" placeholder="https://www.chordtela.com/...">
                                    <button class="btn-primary" id="aiExtractBtn">Extract Data</button>
                                </div>
                                <div id="aiChatBox" class="ai-chat-box"></div>
                            </div>

                            <div class="manual-form-section">
                                <h3>Atau Tambah Manual</h3>
                                <form id="addSongForm" class="song-form">
                                    <div class="form-group">
                                        <label>Judul Lagu</label>
                                        <input type="text" id="formJudul" required>
                                    </div>
                                    <div class="form-group">
                                        <label>Nama Artis</label>
                                        <input type="text" id="formArtis" required>
                                    </div>
                                    <div class="form-group">
                                        <label>Kunci Dasar</label>
                                        <select id="formKunci">
                                            <option>C</option><option>C#</option><option>D</option><option>D#</option>
                                            <option>E</option><option>F</option><option>F#</option><option>G</option>
                                            <option>G#</option><option>A</option><option>A#</option><option>B</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label>Kategori/Genre</label>
                                        <select id="formKategori">
                                            <option>Pop</option><option>Rock</option><option>Ballad</option>
                                            <option>Dangdut</option><option>Jazz</option><option>Indie</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label>Lirik dengan Chord</label>
                                        <textarea id="formLirik" placeholder="[C]Lirik dengan chord..." required></textarea>
                                    </div>
                                    <div class="form-group">
                                        <label>URL Audio</label>
                                        <input type="url" id="formAudioUrl" required>
                                    </div>
                                    <div class="form-group">
                                        <label>URL Cover</label>
                                        <input type="url" id="formCoverUrl" required>
                                    </div>
                                    <button type="submit" class="btn-primary">💾 Simpan Lagu</button>
                                </form>
                            </div>
                        </div>
                    </section>

                    <section class="tab-content" id="tab-requests">
                        <h2>Riwayat Request Lagu</h2>
                        <input type="text" id="searchRequests" class="search-bar" placeholder="Cari request...">
                        <select id="filterStatus">
                            <option value="">Semua Status</option>
                            <option value="baru">Baru</option>
                            <option value="diproses">Diproses</option>
                            <option value="ditambahkan">Ditambahkan</option>
                            <option value="ditolak">Ditolak</option>
                        </select>
                        <div class="requests-table-container" id="requestsTable"></div>
                    </section>
                </main>
            </div>
        `;

        await this.loadData();
        this.setupEventListeners();
    }

    async loadData() {
        try {
            this.songs = await this.songService.getAllSongs();
            this.requests = await this.songRequestService.getAllRequests();
            this.displaySongs();
            this.displayRequests();
        } catch (error) {
            console.error('Error loading data:', error);
            alert('Gagal memuat data');
        }
    }

    displaySongs() {
        const table = document.getElementById('songsTable');
        table.innerHTML = `
            <table class="admin-table">
                <thead>
                    <tr><th>Judul</th><th>Artis</th><th>Kunci</th><th>Genre</th><th>Aksi</th></tr>
                </thead>
                <tbody>
                    ${this.songs.map(song => `
                        <tr>
                            <td>${song.judul}</td>
                            <td>${song.artis}</td>
                            <td>${song.kunci_dasar}</td>
                            <td>${song.kategori}</td>
                            <td>
                                <button class="btn-small" onclick="admin.editSong('${song.id}')\">✏️ Edit</button>
                                <button class="btn-small btn-danger" onclick="admin.deleteSong('${song.id}')\">🗑️ Hapus</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    displayRequests() {
        const table = document.getElementById('requestsTable');
        table.innerHTML = `
            <table class="admin-table">
                <thead>
                    <tr><th>Judul</th><th>Artis</th><th>Tanggal</th><th>Status</th><th>Aksi</th></tr>
                </thead>
                <tbody>
                    ${this.requests.map(req => `
                        <tr>
                            <td>${req.judul}</td>
                            <td>${req.artis}</td>
                            <td>${new Date(req.tanggal_request).toLocaleDateString('id-ID')}</td>
                            <td><span class="status-badge status-${req.status}">${req.status}</span></td>
                            <td>
                                <select class="status-select" data-id="${req.id}">
                                    <option value="baru" ${req.status === 'baru' ? 'selected' : ''}>Baru</option>
                                    <option value="diproses" ${req.status === 'diproses' ? 'selected' : ''}>Diproses</option>
                                    <option value="ditambahkan" ${req.status === 'ditambahkan' ? 'selected' : ''}>Ditambahkan</option>
                                    <option value="ditolak" ${req.status === 'ditolak' ? 'selected' : ''}>Ditolak</option>
                                </select>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    setupEventListeners() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        const extractBtn = document.getElementById('aiExtractBtn');
        if (extractBtn) {
            extractBtn.addEventListener('click', () => this.handleAIExtract());
        }

        const form = document.getElementById('addSongForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleAddSong(e));
        }

        document.querySelectorAll('.status-select').forEach(select => {
            select.addEventListener('change', (e) => this.updateRequestStatus(e.target.dataset.id, e.target.value));
        });

        const searchSongs = document.getElementById('searchSongs');
        if (searchSongs) {
            searchSongs.addEventListener('input', (e) => this.searchSongs(e.target.value));
        }

        const searchRequests = document.getElementById('searchRequests');
        if (searchRequests) {
            searchRequests.addEventListener('input', (e) => this.searchRequests(e.target.value));
        }
    }

    switchTab(tab) {
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        
        document.getElementById(`tab-${tab}`).classList.add('active');
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    }

    async handleAIExtract() {
        const url = document.getElementById('aiLinkInput').value;
        if (!url) {
            alert('Masukkan URL terlebih dahulu');
            return;
        }

        try {
            const chatBox = document.getElementById('aiChatBox');
            chatBox.innerHTML = '<p class="loading">🤖 BedzAI sedang menganalisis link...</p>';

            const data = await this.bedzAI.extract(url);
            this.aiData = data;
            
            chatBox.innerHTML = `
                <div class="ai-preview">
                    <h4>Preview Data Ekstrak</h4>
                    <div class="preview-grid">
                        <div class="preview-item">
                            <label>Judul</label>
                            <input type="text" value="${data.judul}" data-field="judul" class="preview-input">
                        </div>
                        <div class="preview-item">
                            <label>Artis</label>
                            <input type="text" value="${data.artis}" data-field="artis" class="preview-input">
                        </div>
                        <div class="preview-item">
                            <label>Kunci Dasar</label>
                            <input type="text" value="${data.kunci_dasar}" data-field="kunci_dasar" class="preview-input">
                        </div>
                        <div class="preview-item">
                            <label>Genre</label>
                            <input type="text" value="${data.kategori}" data-field="kategori" class="preview-input">
                        </div>
                    </div>
                    <div class="preview-item full-width">
                        <label>Lirik + Chord</label>
                        <textarea class="preview-input" data-field="lirik" rows="6">${data.lirik}</textarea>
                    </div>
                    <button class="btn-primary" onclick="admin.saveSongFromAI()\">💾 Simpan Lagu</button>
                </div>
            `;
        } catch (error) {
            console.error('Error extracting data:', error);
            document.getElementById('aiChatBox').innerHTML = `<p class="error">❌ Gagal mengekstrak data: ${error.message}</p>`;
        }
    }

    async saveSongFromAI() {
        const inputs = document.querySelectorAll('.preview-input');
        const data = {};
        inputs.forEach(input => {
            data[input.dataset.field] = input.value;
        });

        try {
            await this.songService.addSong({
                ...data,
                audio_url: this.aiData.audio_url,
                cover_url: this.aiData.cover_url,
                sumber_url: this.aiData.sumber_url,
                tanggal_rilis: this.aiData.tanggal_rilis,
                platform: this.aiData.platform
            });
            alert('✅ Lagu berhasil disimpan!');
            document.getElementById('aiLinkInput').value = '';
            document.getElementById('aiChatBox').innerHTML = '';
            await this.loadData();
        } catch (error) {
            console.error('Error saving song:', error);
            alert('Gagal menyimpan lagu');
        }
    }

    async handleAddSong(e) {
        e.preventDefault();
        
        const data = {
            judul: document.getElementById('formJudul').value,
            artis: document.getElementById('formArtis').value,
            kunci_dasar: document.getElementById('formKunci').value,
            kategori: document.getElementById('formKategori').value,
            lirik: document.getElementById('formLirik').value,
            audio_url: document.getElementById('formAudioUrl').value,
            cover_url: document.getElementById('formCoverUrl').value,
            sumber_url: '',
            tanggal_rilis: new Date().toISOString().split('T')[0]
        };

        try {
            await this.songService.addSong(data);
            alert('✅ Lagu berhasil ditambahkan!');
            document.getElementById('addSongForm').reset();
            await this.loadData();
        } catch (error) {
            console.error('Error adding song:', error);
            alert('Gagal menambahkan lagu');
        }
    }

    async editSong(id) {
        const song = this.songs.find(s => s.id === id);
        if (!song) return;

        const newTitle = prompt('Edit Judul:', song.judul);
        if (newTitle) {
            try {
                await this.songService.updateSong(id, { judul: newTitle });
                await this.loadData();
            } catch (error) {
                console.error('Error updating song:', error);
            }
        }
    }

    async deleteSong(id) {
        if (confirm('Yakin ingin menghapus lagu ini?')) {
            try {
                await this.songService.deleteSong(id);
                await this.loadData();
            } catch (error) {
                console.error('Error deleting song:', error);
            }
        }
    }

    async updateRequestStatus(id, status) {
        try {
            await this.songRequestService.updateRequest(id, { status });
            await this.loadData();
        } catch (error) {
            console.error('Error updating request:', error);
        }
    }

    searchSongs(query) {
        const table = document.getElementById('songsTable');
        const filtered = this.songs.filter(s => 
            s.judul.toLowerCase().includes(query.toLowerCase()) ||
            s.artis.toLowerCase().includes(query.toLowerCase())
        );
        
        table.innerHTML = `
            <table class="admin-table">
                <thead>
                    <tr><th>Judul</th><th>Artis</th><th>Kunci</th><th>Genre</th><th>Aksi</th></tr>
                </thead>
                <tbody>
                    ${filtered.map(song => `
                        <tr>
                            <td>${song.judul}</td>
                            <td>${song.artis}</td>
                            <td>${song.kunci_dasar}</td>
                            <td>${song.kategori}</td>
                            <td>
                                <button class="btn-small" onclick="admin.editSong('${song.id}')\">✏️ Edit</button>
                                <button class="btn-small btn-danger" onclick="admin.deleteSong('${song.id}')\">🗑️ Hapus</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    searchRequests(query) {
        const table = document.getElementById('requestsTable');
        const filtered = this.requests.filter(r => 
            r.judul.toLowerCase().includes(query.toLowerCase()) ||
            r.artis.toLowerCase().includes(query.toLowerCase())
        );
        
        this.displayRequestsTable(filtered);
    }

    displayRequestsTable(requests) {
        const table = document.getElementById('requestsTable');
        table.innerHTML = `
            <table class="admin-table">
                <thead>
                    <tr><th>Judul</th><th>Artis</th><th>Tanggal</th><th>Status</th><th>Aksi</th></tr>
                </thead>
                <tbody>
                    ${requests.map(req => `
                        <tr>
                            <td>${req.judul}</td>
                            <td>${req.artis}</td>
                            <td>${new Date(req.tanggal_request).toLocaleDateString('id-ID')}</td>
                            <td><span class="status-badge status-${req.status}">${req.status}</span></td>
                            <td>
                                <select class="status-select" data-id="${req.id}">
                                    <option value="baru" ${req.status === 'baru' ? 'selected' : ''}>Baru</option>
                                    <option value="diproses" ${req.status === 'diproses' ? 'selected' : ''}>Diproses</option>
                                    <option value="ditambahkan" ${req.status === 'ditambahkan' ? 'selected' : ''}>Ditambahkan</option>
                                    <option value="ditolak" ${req.status === 'ditolak' ? 'selected' : ''}>Ditolak</option>
                                </select>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
}

window.admin = new AdminPanel();
