import { SongRequestService } from '../services/songRequestService.js';

export class FAQPage {
    constructor() {
        this.songRequestService = new SongRequestService();
    }

    async render() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="container">
                <header class="header">
                    <div class="header-content">
                        <h1 class="logo" data-logo>🎸 ChordBedz</h1>
                        <nav class="nav">
                            <button class="btn-back" onclick="window.location.hash = '/'\">← Kembali</button>
                        </nav>
                    </div>
                </header>

                <main class="main-content">
                    <section class="faq-section">
                        <h2>FAQ & Panduan Penggunaan</h2>

                        <div class="faq-item">
                            <h3>Bagaimana cara menggunakan transpose?</h3>
                            <p>Gunakan tombol +1 dan -1 untuk naik atau turun nada. Setiap klik akan mengubah kunci sesuai dengan transpose yang Anda pilih.</p>
                        </div>

                        <div class="faq-item">
                            <h3>Apa itu auto-scroll?</h3>
                            <p>Auto-scroll adalah fitur yang secara otomatis menggulir lirik saat Anda memutar lagu. Aktifkan checkbox untuk menggunakannya.</p>
                        </div>

                        <div class="faq-item">
                            <h3>Bagaimana cara request lagu?</h3>
                            <p>Isi formulir di bawah dengan judul dan artis lagu yang Anda inginkan. Request akan langsung dikirim ke pemilik ChordBedz melalui WhatsApp.</p>
                        </div>

                        <div class="faq-item">
                            <h3>Berapa lama lagu yang saya request akan ditambahkan?</h3>
                            <p>Waktu penambahan tergantung ketersediaan waktu admin. Biasanya dalam 1-3 hari kerja. Anda akan menerima notifikasi WhatsApp saat lagu sudah ditambahkan.</p>
                        </div>
                    </section>

                    <section class="contact-section">
                        <h2>Hubungi Kami</h2>
                        <div class="contact-info">
                            <p><strong>WhatsApp:</strong> <a href="https://wa.me/628311056439">+62 831-1056-0439</a></p>
                            <p><strong>Email:</strong> <a href="mailto:ytzizgans@gmail.com">ytzizgans@gmail.com</a></p>
                        </div>
                    </section>

                    <section class="request-form-section">
                        <h2>Request Lagu</h2>
                        <form id="requestForm" class="request-form">
                            <div class="form-group">
                                <label for="judulLagu">Judul Lagu</label>
                                <input type="text" id="judulLagu" name="judul" required placeholder="Masukkan judul lagu">
                            </div>
                            <div class="form-group">
                                <label for="artistLagu">Nama Artis</label>
                                <input type="text" id="artistLagu" name="artis" required placeholder="Masukkan nama artis">
                            </div>
                            <div class="form-group">
                                <label for="notesRequest">Catatan (Opsional)</label>
                                <textarea id="notesRequest" name="notes" placeholder="Tulis catatan atau permintaan khusus"></textarea>
                            </div>
                            <button type="submit" class="btn-submit">Kirim Request</button>
                        </form>
                    </section>
                </main>

                <footer class="footer">
                    <p>&copy; 2024 ChordBedz by Bedz | WA: <a href="https://wa.me/628311056439">+62 831-1056-0439</a></p>
                </footer>
            </div>
        `;

        this.setupEventListeners();
    }

    setupEventListeners() {
        const form = document.getElementById('requestForm');
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const judul = document.getElementById('judulLagu').value;
        const artis = document.getElementById('artistLagu').value;
        const notes = document.getElementById('notesRequest').value;

        try {
            await this.songRequestService.addRequest({
                judul,
                artis,
                notes,
                status: 'baru',
                tanggal_request: new Date()
            });

            const message = `🎸 Request Lagu ChordBedz:\n\nJudul: ${judul}\nArtis: ${artis}\nCatatan: ${notes || 'Tidak ada'}\n\nSilahkan tambahkan ke database ChordBedz`;
            const waLink = `https://wa.me/628311056439?text=${encodeURIComponent(message)}`;
            window.open(waLink, '_blank');

            alert('✅ Request berhasil dikirim! Terima kasih telah menggunakan ChordBedz.');
            document.getElementById('requestForm').reset();
        } catch (error) {
            console.error('Error submitting request:', error);
            alert('❌ Gagal mengirim request. Silakan coba lagi.');
        }
    }
}
