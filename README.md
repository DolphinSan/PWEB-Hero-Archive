# Hero Archive (Character Archive)

**Anggota Kelompok:**
- Anggota 1: Muhammad Krisna Putra Pamungkas - 5053241001
- Anggota 2: Muhammad Khalid Ash Shiddiqi - 5053241030

---

## 1. Deskripsi Aplikasi

Hero Archive adalah aplikasi web yang menampilkan katalog lengkap hero Mobile Legends beserta sistem manajemen favorit, draft team, dan review hero. Website ini bertujuan untuk membantu pemain mengenali berbagai hero beserta role, kemampuan, dan statistiknya secara mudah dan menarik secara visual.

**Teknologi:**
- **Backend:** Node.js + Express.js
- **Database:** PostgreSQL/MySQL
- **Authentication:** JWT (JSON Web Token)
- **Frontend:** React.js / HTML+CSS+Vanilla JS
- **Styling:** Tailwind CSS (dark theme)

---

## 2. Fitur Utama

### 2.1 Autentikasi & User Management
- **Register & Login** - Sistem autentikasi dengan JWT
- **Role-based Access** - Admin dan User biasa
- **Profile Management** - User dapat melihat profil mereka

### 2.2 Hero Management (Admin Only)
- **CRUD Hero** - Admin dapat menambah, edit, dan hapus hero
- **Upload Gambar Hero** - Setiap hero memiliki gambar representatif
- **Statistik Hero** - Input stats (Durability, Offense, Control, dll)

### 2.3 Hero Gallery (Public/User)
- **Daftar Hero (Grid View)** - Menampilkan semua hero dalam kartu
- **Pencarian & Filter** - Cari berdasarkan nama atau filter by role
- **Halaman Detail Hero** - Info lengkap: role, specialty, stats, deskripsi

### 2.4 Favorite System
- **Add to Favorites** - User dapat menandai hero favorit
- **Manage Favorites** - Edit catatan dan prioritas favorit
- **My Favorites Page** - Halaman khusus daftar hero favorit

### 2.5 Draft Team Generator
- **Random Draft** - Generate 5 hero acak untuk team composition
- **Save Draft** - Simpan draft team dengan nama custom
- **Draft History** - Lihat riwayat draft yang pernah dibuat
- **Edit/Delete Draft** - Kelola draft team yang sudah disimpan

### 2.6 Review & Rating System
- **Write Review** - User bisa tulis review untuk setiap hero
- **Rating (1-5 stars)** - Beri rating kemampuan hero
- **Edit/Delete Review** - Kelola review yang sudah dibuat

---

## 3. Struktur API (16 Endpoint CRUD)

### CREATE (4 POST)
```
POST /api/heroes          - Admin tambah hero baru
POST /api/favorites       - User tambah hero ke favorit
POST /api/drafts          - User simpan draft team
POST /api/reviews         - User buat review hero
```

### READ (4 GET)
```
GET /api/heroes           - Ambil semua hero (dengan filter & search)
GET /api/heroes/:id       - Detail hero spesifik
GET /api/favorites        - Ambil daftar favorit user (require auth)
GET /api/drafts           - Ambil history draft teams user (require auth)
```

### UPDATE (4 PUT)
```
PUT /api/heroes/:id       - Admin update data hero
PUT /api/favorites/:id    - Update catatan/prioritas favorit
PUT /api/drafts/:id       - Edit komposisi draft team
PUT /api/reviews/:id      - Edit review hero
```

### DELETE (4 DELETE)
```
DELETE /api/heroes/:id    - Admin hapus hero
DELETE /api/favorites/:id - Hapus hero dari favorit
DELETE /api/drafts/:id    - Hapus draft team
DELETE /api/reviews/:id   - Hapus review hero
```

### Autentikasi (Tambahan)
```
POST /api/auth/register   - Registrasi user baru
POST /api/auth/login      - Login user (return JWT token)
GET /api/auth/me          - Get current user info
```

---

## 4. Database Schema

### Table: users
```
- id (PK)
- username (unique)
- email (unique)
- password (hashed dengan bcrypt)
- role (enum: 'admin', 'user')
- created_at
```

### Table: heroes
```
- id (PK)
- name (varchar)
- role (enum: Tank, Fighter, Assassin, Mage, Marksman, Support)
- specialty (varchar, contoh: "Burst/Poke")
- difficulty (int, 1-10)
- durability (int, 0-100)
- offense (int, 0-100)
- control (int, 0-100)
- movement (int, 0-100)
- image_url (varchar)
- description (text)
- created_at
- updated_at
```

### Table: favorites
```
- id (PK)
- user_id (FK → users.id)
- hero_id (FK → heroes.id)
- notes (text, optional)
- priority (int, 1-5)
- created_at
```

### Table: drafts
```
- id (PK)
- user_id (FK → users.id)
- team_name (varchar)
- hero_ids (JSON array, contoh: [1,5,8,12,15])
- created_at
```

### Table: reviews
```
- id (PK)
- user_id (FK → users.id)
- hero_id (FK → heroes.id)
- rating (int, 1-5)
- comment (text)
- created_at
- updated_at
```

---


## 5. Fitur Keamanan

1. **Password Hashing** - Bcrypt untuk hash password
2. **JWT Authentication** - Token expire 24 jam
3. **Route Protection** - Middleware untuk cek auth
4. **Admin Verification** - Hanya admin bisa CRUD heroes
5. **Input Validation** - Validasi di backend untuk semua input
6. **SQL Injection Protection** - Gunakan parameterized queries
7. **CORS Configuration** - Hanya allow dari frontend domain

---

