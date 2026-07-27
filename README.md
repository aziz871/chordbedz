# 📝 Aplikasi To-Do List Indonesia

Aplikasi to-do list (daftar tugas) modern dengan fitur local storage untuk menyimpan data secara otomatis. Dibuat dengan HTML5, CSS3, dan JavaScript vanilla.

## ✨ Fitur Utama

### ✅ Manajemen Tugas
- Tambah tugas baru dengan mudah
- Tandai tugas sebagai selesai
- Hapus tugas individual
- Hapus semua tugas yang sudah selesai
- Hapus semua tugas sekaligus

### 📊 Statistik Real-time
- Hitung total semua tugas
- Hitung tugas yang masih aktif (belum selesai)
- Hitung tugas yang sudah selesai
- Update otomatis setiap ada perubahan

### 🔍 Filter & Sorting
- **Semua** - Tampilkan semua tugas
- **Aktif** - Hanya tugas yang belum selesai
- **Selesai** - Hanya tugas yang sudah selesai
- Switching filter yang mulus

### 💾 Local Storage (Penyimpanan Lokal)
- Semua tugas disimpan otomatis ke browser
- Data tetap ada meskipun halaman ditutup
- Tidak perlu server atau database
- Data tersimpan dalam `localStorage` dengan key `daftarTugas`

### 🎨 Desain & UI
- Antarmuka modern dan intuitif
- Gradient background yang cantik
- Animasi smooth untuk transisi
- Responsive design - berfungsi di semua ukuran layar
- Dark shadows untuk depth
- Hover effects yang interaktif

### 🔒 Keamanan
- Perlindungan XSS dengan HTML escaping
- Input validation
- Confirmation dialog untuk aksi berbahaya

### ⌨️ Keyboard Support
- Tekan **Enter** untuk menambah tugas baru
- Fokus otomatis pada input setelah menambah

### 🏷️ Prioritas Tugas
- Badge prioritas untuk setiap tugas (Tinggi, Sedang, Rendah)
- Warna berbeda untuk setiap tingkat prioritas

## 📁 Struktur File

```
chordbedz/
├── index.html          # Struktur halaman (bahasa Indonesia)
├── style.css           # Styling dan responsive design
├── script.js           # Logika aplikasi & local storage
├── README.md           # Dokumentasi ini
└── .gitignore          # File yang diabaikan git
```

## 🚀 Cara Menggunakan

### 1. Buka Aplikasi
- Buka file `index.html` di browser favorit Anda
- Atau akses melalui GitHub Pages (jika sudah dikonfigurasi)

### 2. Tambah Tugas
```
1. Ketik deskripsi tugas di input field
2. Klik tombol "Tambah" atau tekan Enter
3. Tugas akan langsung muncul di daftar
```

### 3. Tandai Selesai
```
1. Klik checkbox di sebelah tugas
2. Tugas akan bergaris dan fade
3. Statistik "Selesai" akan bertambah
```

### 4. Hapus Tugas
```
1. Klik tombol "Hapus" pada tugas yang ingin dihapus
2. Tugas akan langsung hilang dari daftar
```

### 5. Filter Tugas
```
1. Klik tombol "Aktif" untuk lihat hanya tugas belum selesai
2. Klik tombol "Selesai" untuk lihat hanya tugas selesai
3. Klik tombol "Semua" untuk lihat semua tugas
```

### 6. Bulk Actions
```
- "Hapus Yang Selesai" - Hapus semua tugas yang sudah selesai
- "Hapus Semua" - Hapus semua tugas (perlu konfirmasi)
```

## 💾 Local Storage

### Cara Kerja
- Setiap tugas disimpan dalam format JSON
- Data tersimpan di `localStorage` browser
- Otomatis disimpan setiap ada perubahan
- Tidak perlu internet atau server

### Format Data
```javascript
[
  {
    id: 1234567890,              // Timestamp unique ID
    teks: "Belajar JavaScript", // Deskripsi tugas
    selesai: false,               // Status selesai
    prioritas: "sedang",         // Tingkat prioritas
    dibuatPada: "27/7/2026, ..." // Waktu dibuat
  }
]
```

### Mengakses di Browser DevTools
1. Buka Browser DevTools (F12)
2. Pergi ke tab **Application**
3. Klik **Local Storage**
4. Pilih domain saat ini
5. Cari key `daftarTugas`

### Reset Data

**Opsi 1: Melalui DevTools**
1. Buka DevTools (F12)
2. Application > Local Storage
3. Klik kanan pada `daftarTugas`
4. Pilih "Delete"
5. Refresh halaman

**Opsi 2: Melalui Console**
Buka Console (F12) dan jalankan:
```javascript
localStorage.removeItem('daftarTugas');
location.reload();
```

## 🛠️ Teknologi yang Digunakan

- **HTML5** - Markup semantik
- **CSS3** - Styling modern dengan Grid & Flexbox
- **JavaScript (ES6+)** - Logika aplikasi dengan class-based architecture
- **Local Storage API** - Penyimpanan data di browser
- **CSS Gradients & Animations** - Desain dinamis

## 🌍 Kompatibilitas Browser

| Browser | Support |
|---------|----------|
| Chrome | ✅ Latest |
| Edge | ✅ Latest |
| Firefox | ✅ Latest |
| Safari | ✅ Latest |
| Mobile Chrome | ✅ Ya |
| Mobile Safari (iOS) | ✅ Ya |

## 📱 Responsive Design

- ✅ Desktop (1024px+)
- ✅ Tablet (768px - 1023px)
- ✅ Mobile (< 768px)
- ✅ Landscape mode
- ✅ Portrait mode

## 🎨 Warna & Tema

```css
--warna-utama: #6366f1         /* Biru Indigo */
--warna-sukses: #10b981        /* Hijau */
--warna-bahaya: #ef4444        /* Merah */
--warna-peringatan: #f59e0b    /* Oranye */
```

## 🔮 Fitur Tambahan yang Bisa Ditambah

- [ ] Edit tugas setelah dibuat
- [ ] Tanggal deadline untuk setiap tugas
- [ ] Kategori/tag untuk tugas
- [ ] Dark mode / Light mode toggle
- [ ] Export tugas ke PDF
- [ ] Import tugas dari file
- [ ] Notifikasi browser
- [ ] Cloud sync (Firebase, dll)
- [ ] Repeat/recurring tasks
- [ ] Subtasks support
- [ ] Sound effects
- [ ] Theme customization

## 📝 License

MIT License - Bebas untuk digunakan dan dimodifikasi

## 🤝 Kontribusi

Anda bebas untuk:
- Fork repository
- Modifikasi sesuai kebutuhan
- Submit pull request
- Bagikan improvements

## 📧 Pertanyaan & Support

Jika ada pertanyaan atau bug, silakan buat issue di repository.

---

**Dibuat dengan ❤️ untuk produktivitas Anda**

🎯 Tetap fokus, tetap produktif!
