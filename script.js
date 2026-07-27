// Aplikasi To-Do List dengan Local Storage

class AplikasiTodo {
    constructor() {
        this.daftarTugas = [];
        this.filterAktif = 'semua';
        this.init();
    }

    init() {
        this.muatDariStorage();
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        const btnTambah = document.getElementById('btnTambah');
        const inputTugas = document.getElementById('inputTugas');
        const btnFilter = document.querySelectorAll('.btn-filter');
        const btnHapusSelesai = document.getElementById('btnHapusSelesai');
        const btnHapusSemua = document.getElementById('btnHapusSemua');

        btnTambah.addEventListener('click', () => this.tambahTugas());
        inputTugas.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.tambahTugas();
        });

        btnFilter.forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filterAktif = e.target.dataset.filter;
                this.render();
            });
        });

        btnHapusSelesai.addEventListener('click', () => this.hapusYangSelesai());
        btnHapusSemua.addEventListener('click', () => this.hapusSemuaTugas());
    }

    tambahTugas() {
        const input = document.getElementById('inputTugas');
        const teks = input.value.trim();

        if (!teks) {
            alert('Silakan masukkan tugas!');
            return;
        }

        const tugas = {
            id: Date.now(),
            teks: teks,
            selesai: false,
            prioritas: 'sedang',
            dibuatPada: new Date().toLocaleString('id-ID')
        };

        this.daftarTugas.unshift(tugas);
        this.simpanKeStorage();
        input.value = '';
        input.focus();
        this.render();
    }

    toggleTugas(id) {
        const tugas = this.daftarTugas.find(t => t.id === id);
        if (tugas) {
            tugas.selesai = !tugas.selesai;
            this.simpanKeStorage();
            this.render();
        }
    }

    hapusTugas(id) {
        this.daftarTugas = this.daftarTugas.filter(t => t.id !== id);
        this.simpanKeStorage();
        this.render();
    }

    hapusYangSelesai() {
        if (this.daftarTugas.filter(t => t.selesai).length === 0) {
            alert('Tidak ada tugas yang selesai untuk dihapus!');
            return;
        }

        if (confirm('Anda yakin ingin menghapus semua tugas yang selesai?')) {
            this.daftarTugas = this.daftarTugas.filter(t => !t.selesai);
            this.simpanKeStorage();
            this.render();
        }
    }

    hapusSemuaTugas() {
        if (this.daftarTugas.length === 0) {
            alert('Tidak ada tugas untuk dihapus!');
            return;
        }

        if (confirm('Anda yakin ingin menghapus SEMUA tugas? Ini tidak bisa dibatalkan!')) {
            this.daftarTugas = [];
            this.simpanKeStorage();
            this.render();
        }
    }

    getTugasTerfilter() {
        switch (this.filterAktif) {
            case 'aktif':
                return this.daftarTugas.filter(t => !t.selesai);
            case 'selesai':
                return this.daftarTugas.filter(t => t.selesai);
            default:
                return this.daftarTugas;
        }
    }

    updateStatistik() {
        const total = this.daftarTugas.length;
        const aktif = this.daftarTugas.filter(t => !t.selesai).length;
        const selesai = this.daftarTugas.filter(t => t.selesai).length;

        document.getElementById('totalCount').textContent = total;
        document.getElementById('aktifCount').textContent = aktif;
        document.getElementById('selesaiCount').textContent = selesai;
    }

    render() {
        const daftarTugas = document.getElementById('daftarTugas');
        const emptyState = document.getElementById('emptyState');
        const tugasTerfilter = this.getTugasTerfilter();

        daftarTugas.innerHTML = '';

        if (tugasTerfilter.length === 0) {
            emptyState.classList.add('show');
        } else {
            emptyState.classList.remove('show');
            tugasTerfilter.forEach(tugas => {
                const li = document.createElement('li');
                li.className = `item-tugas ${tugas.selesai ? 'selesai' : ''}`;
                li.innerHTML = `
                    <input 
                        type="checkbox" 
                        class="checkbox-tugas" 
                        ${tugas.selesai ? 'checked' : ''}
                        onchange="aplikasi.toggleTugas(${tugas.id})"
                    >
                    <span class="teks-tugas">${this.amankanHtml(tugas.teks)}</span>
                    <span class="prioritas ${tugas.prioritas}">${tugas.prioritas}</span>
                    <button class="btn-hapus" onclick="aplikasi.hapusTugas(${tugas.id})">Hapus</button>
                `;
                daftarTugas.appendChild(li);
            });
        }

        this.updateStatistik();
    }

    amankanHtml(teks) {
        const div = document.createElement('div');
        div.textContent = teks;
        return div.innerHTML;
    }

    simpanKeStorage() {
        localStorage.setItem('daftarTugas', JSON.stringify(this.daftarTugas));
    }

    muatDariStorage() {
        const tersimpan = localStorage.getItem('daftarTugas');
        this.daftarTugas = tersimpan ? JSON.parse(tersimpan) : [];
    }
}

// Inisialisasi aplikasi
const aplikasi = new AplikasiTodo();