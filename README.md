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

## 5. Rancangan UI/UX

### 5.1 Halaman Utama (Hero Gallery)
**Header:**
- Logo "Hero Archive"
- Search bar (cari hero by nama)
- Filter dropdown (Tank, Mage, Marksman, dll)
- User menu (Login/Profile)

**Body:**
- Grid kartu hero (responsive: 4 kolom desktop, 2 kolom tablet, 1 kolom mobile)
- Setiap kartu: Gambar hero, Nama, Role, Button "♥ Favorite"

**Footer:**
- Button "🎲 Random Draft Generator"

### 5.2 Halaman Detail Hero
- **Hero Image** (besar, featured)
- **Info Card:**
  - Nama Hero
  - Role & Specialty
  - Difficulty Bar
- **Stats Chart:** Durability, Offense, Control, Movement (bar chart)
- **Description** (singkat tentang hero)
- **Action Buttons:**
  - "Add to Favorites"
  - "Write Review"
- **Reviews Section:** Tampilkan review dari user lain

### 5.3 Halaman My Favorites
- List hero favorit user
- Setiap item: gambar, nama, notes pribadi, prioritas
- Action: Edit Notes, Remove dari favorit

### 5.4 Halaman Draft History
- List semua draft team yang pernah dibuat
- Setiap draft: team name, 5 hero icons, tanggal
- Action: View Detail, Edit, Delete

### 5.5 Admin Panel (Admin Only)
- **Hero Management Table**
  - List semua hero
  - Action: Add New, Edit, Delete
- **Form Add/Edit Hero**
  - Upload gambar
  - Input stats dengan slider
  - Submit button

### 5.6 Tema Desain
- **Dark theme** dengan nuansa biru-ungu (#1a1a2e background, #16213e cards)
- **Accent color:** Purple-blue gradient (#7b2cbf → #5a67d8)
- **Typography:** Modern sans-serif (Inter/Poppins)
- **Hover effects:** Smooth transitions, glow effect
- **Icons:** Lucide React icons atau Font Awesome

---

## 6. Fitur Keamanan

1. **Password Hashing** - Bcrypt untuk hash password
2. **JWT Authentication** - Token expire 24 jam
3. **Route Protection** - Middleware untuk cek auth
4. **Admin Verification** - Hanya admin bisa CRUD heroes
5. **Input Validation** - Validasi di backend untuk semua input
6. **SQL Injection Protection** - Gunakan parameterized queries
7. **CORS Configuration** - Hanya allow dari frontend domain

---

## 7. Timeline Pengerjaan (Estimasi 4 Minggu)

### Week 1: Backend Foundation
- Setup database schema
- Implement authentication (register, login)
- Create 16 CRUD endpoints
- Testing dengan Postman

### Week 2: Backend Integration
- Middleware (auth, admin check, error handling)
- Data seeding (populate heroes awal)
- Deploy backend ke Railway/Render
- API documentation

### Week 3: Frontend Development
- Setup React project + routing
- Create components (HeroCard, Navbar, etc)
- Implement pages (Gallery, Detail, Favorites, Drafts)
- Connect to backend API

### Week 4: Polish & Testing
- Styling & responsive design
- Bug fixing
- End-to-end testing
- Deploy frontend (Vercel/Netlify)
- Final documentation

---

## 8. Deliverables

1. **Source Code** (GitHub repository)
2. **Database Schema** (SQL file atau ERD diagram)
3. **API Documentation** (Postman collection atau Swagger)
4. **User Guide** (cara penggunaan aplikasi)
5. **Demo Video** (showcase fitur-fitur)
6. **Deployed Application** (link live demo)

---

## 9. Pembagian Tugas
**Muhammad Khalid Ash Shiddiqi (5053241030):**
- Backend development (API endpoints)
- Database design & management
- Authentication & authorization
- API testing

**Muhammad Krisna Putra Pamungkas (5053241001):**
- Frontend development (UI/UX)
- Integration dengan backend API
- Responsive design
- Frontend testing


---

## 10. Referensi & Resources

- **Mobile Legends Heroes Data:** https://mobilelegends.com
- **JWT Documentation:** https://jwt.io
- **Express.js Guide:** https://expressjs.com
- **React Documentation:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com

---
