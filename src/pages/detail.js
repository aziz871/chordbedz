import { SongService } from '../services/songService.js';
import { ChordTranspose } from '../utils/chordTranspose.js';

export class DetailPage {
    constructor(songId) {
        this.songId = songId;
        this.songService = new SongService();
        this.song = null;
        this.currentTranspose = 0;
        this.isPlaying = false;
        this.chordTranspose = new ChordTranspose();
    }

    async render() {
        const app = document.getElementById('app');
        app.innerHTML = '<div class="loading">Memuat...</div>';

        try {
            this.song = await this.songService.getSongById(this.songId);
            if (!this.song) {
                app.innerHTML = '<p class="error">Lagu tidak ditemukan</p>';
                return;
            }

            this.displaySongDetail();
            this.setupEventListeners();
        } catch (error) {
            console.error('Error loading song:', error);
            app.innerHTML = '<p class="error">Gagal memuat lagu</p>';
        }
    }

    displaySongDetail() {
        const app = document.getElementById('app');
        const chordHtml = this.formatChordLyrics(this.song.lirik);

        app.innerHTML = `
            <div class="detail-container">
                <header class="detail-header">
                    <button class="btn-back" onclick="window.history.back()">← Kembali</button>
                    <h1 class="logo" data-logo>🎸 ChordBedz</h1>
                </header>

                <main class="detail-content">
                    <div class="song-header">
                        <img src="${this.song.cover_url || 'https://via.placeholder.com/400x300'}" alt="${this.song.judul}" class="detail-cover">
                        <div class="song-meta">
                            <h1 class="detail-title">${this.song.judul}</h1>
                            <p class="detail-artist">${this.song.artis}</p>
                            <p class="detail-genre">Genre: ${this.song.kategori || 'Pop'}</p>
                            <p class="detail-key">Kunci: <span id="currentKey">${this.song.kunci_dasar}</span></p>
                        </div>
                    </div>

                    <div class="player-controls">
                        <button id="playBtn" class="btn-play">▶ Play</button>
                        <button id="stopBtn" class="btn-stop">⏹ Stop</button>
                        <div class="transpose-controls">
                            <button id="transposeDown" class="btn-transpose">-1</button>
                            <span class="transpose-label">Transpose</span>
                            <button id="transposeUp" class="btn-transpose">+1</button>
                        </div>
                        <label class="auto-scroll-label">
                            <input type="checkbox" id="autoScroll">
                            Auto Scroll
                        </label>
                    </div>

                    <audio id="audioPlayer" src="${this.song.audio_url || ''}"></audio>

                    <div class="fretboard-container">
                        <h3>Diagram Kunci</h3>
                        <div id="fretboard" class="fretboard"></div>
                    </div>

                    <div class="lyrics-container" id="lyricsContainer">
                        <h3>Lirik & Chord</h3>
                        <pre class="lyrics" id="lyrics">${chordHtml}</pre>
                    </div>
                </main>

                <footer class="footer">
                    <p>&copy; 2024 ChordBedz by Bedz</p>
                </footer>
            </div>
        `;

        this.renderFretboard();
    }

    formatChordLyrics(lirik) {
        return lirik.replace(/\[([A-G][#b]?m?)\]/g, '<span class="chord">[$1]</span>');
    }

    renderFretboard() {
        const fretboardContainer = document.getElementById('fretboard');
        const chord = this.song.kunci_dasar;
        const chordShapes = {
            'C': [[0, 0, 2, 3, 3, 0]],
            'G': [[3, 2, 0, 0, 0, 3]],
            'D': [[2, 2, 0, 2, 3, 2]],
            'A': [[0, 0, 2, 2, 2, 0]],
            'E': [[0, 2, 2, 1, 0, 0]],
            'F': [[1, 3, 3, 2, 1, 1]],
            'Dm': [[1, 3, 2, 2, 1, 0]],
            'Am': [[0, 0, 2, 2, 1, 0]],
            'Em': [[0, 2, 2, 1, 0, 0]],
            'Gm': [[3, 5, 5, 4, 3, 3]]
        };

        const shape = chordShapes[chord] || chordShapes['C'];
        fretboardContainer.innerHTML = `
            <svg width="200" height="250" class="fretboard-svg">
                ${this.drawFretboard(shape[0])}
            </svg>
        `;
    }

    drawFretboard(positions) {
        let svg = '';
        const stringSpacing = 30;
        const fretSpacing = 40;

        for (let i = 0; i < 5; i++) {
            svg += `<line x1="20" y1="${50 + i * fretSpacing}" x2="200" y2="${50 + i * fretSpacing}" stroke="#999" stroke-width="1"/>`;
        }

        for (let i = 0; i < 6; i++) {
            svg += `<line x1="${30 + i * stringSpacing}" y1="50" x2="${30 + i * stringSpacing}" y2="210" stroke="#333" stroke-width="2"/>`;
            const pos = positions[i];
            if (pos > 0) {
                const y = 50 + pos * fretSpacing;
                svg += `<circle cx="${30 + i * stringSpacing}" cy="${y}" r="8" fill="#FF6B6B"/>`;
            } else if (pos === 0) {
                svg += `<text x="${30 + i * stringSpacing - 3}" y="30" font-size="16" font-weight="bold">o</text>`;
            }
        }

        return svg;
    }

    setupEventListeners() {
        const playBtn = document.getElementById('playBtn');
        const stopBtn = document.getElementById('stopBtn');
        const transposeUp = document.getElementById('transposeUp');
        const transposeDown = document.getElementById('transposeDown');
        const audioPlayer = document.getElementById('audioPlayer');
        const autoScrollCheckbox = document.getElementById('autoScroll');

        playBtn.addEventListener('click', () => {
            this.isPlaying = !this.isPlaying;
            if (this.isPlaying) {
                audioPlayer.play();
                playBtn.textContent = '⏸ Pause';
            } else {
                audioPlayer.pause();
                playBtn.textContent = '▶ Play';
            }
        });

        stopBtn.addEventListener('click', () => {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
            this.isPlaying = false;
            playBtn.textContent = '▶ Play';
        });

        transposeUp.addEventListener('click', () => this.handleTranspose(1));
        transposeDown.addEventListener('click', () => this.handleTranspose(-1));

        autoScrollCheckbox.addEventListener('change', () => {
            if (autoScrollCheckbox.checked) {
                this.startAutoScroll();
            } else {
                this.stopAutoScroll();
            }
        });
    }

    handleTranspose(semitone) {
        this.currentTranspose += semitone;
        const newKey = this.chordTranspose.transposeChord(this.song.kunci_dasar, this.currentTranspose);
        document.getElementById('currentKey').textContent = newKey;
        
        const lyrics = document.getElementById('lyrics');
        const transposedLyrics = this.transposeAllChords(this.song.lirik, this.currentTranspose);
        lyrics.innerHTML = this.formatChordLyrics(transposedLyrics);
    }

    transposeAllChords(text, semitone) {
        const chords = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        return text.replace(/\[([A-G][#b]?m?)\]/g, (match, chord) => {
            const index = chords.indexOf(chord);
            if (index !== -1) {
                const newIndex = (index + semitone + 120) % 12;
                return `[${chords[newIndex]}]`;
            }
            return match;
        });
    }

    startAutoScroll() {
        const container = document.getElementById('lyricsContainer');
        if (!this.autoScrollInterval) {
            this.autoScrollInterval = setInterval(() => {
                container.scrollTop += 2;
            }, 100);
        }
    }

    stopAutoScroll() {
        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
            this.autoScrollInterval = null;
        }
    }
}
