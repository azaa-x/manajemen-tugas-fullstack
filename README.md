# DeadlineIn — Manajemen Tugas Kuliah (Fullstack)

**DeadlineIn** adalah aplikasi pencatat tugas kuliah: mahasiswa dapat mencatat tugas beserta mata kuliah, deadline, status pengerjaan, bobot nilai, dan pengingat, lalu memantau tugas yang paling mendesak.

Pada Tugas 9 (NestJS Dasar + Struktur MVC), aplikasi frontend React dari pekan sebelumnya disambungkan ke backend **NestJS** yang mengelola data utama **Tugas** (CRUD, validasi DTO, dan penanganan error). Data disimpan sementara di memori (array), sesuai materi Modul 9.

## Teknologi
- Frontend: React + Vite, React Router, Axios, Bootstrap
- Backend: NestJS (TypeScript), class-validator, class-transformer

## Struktur Repository
```
├── frontend/              # React + Vite (port 5173)
├── backend/               # NestJS (port 3001)
│   ├── src/tugas/         # Module, Controller, Service, DTO, Entity
│   ├── src/common/filters # Exception filter global
│   └── requests.http      # Pengujian REST Client
└── docs/screenshots/      # Bukti tiap tahapan
```

## Menjalankan Proyek
Jalankan backend dan frontend di dua terminal terpisah.

```bash
# Terminal 1 - backend (http://localhost:3001)
cd backend
npm install
npm run start:dev

# Terminal 2 - frontend (http://localhost:5173)
cd frontend
npm install
npm run dev
```

## Entity Tugas
| Field       | Tipe                              | Keterangan                          |
|-------------|-----------------------------------|-------------------------------------|
| `id`        | string (UUID)                     | dibuat otomatis                     |
| `nama`      | string                            | nama tugas                          |
| `matkul`    | string                            | nama mata kuliah                    |
| `dosen`     | string                            | kode dosen (boleh kosong)           |
| `deadline`  | string (tanggal ISO 8601)         | batas pengumpulan                   |
| `status`    | `'belum' \| 'proses' \| 'selesai'`| status pengerjaan                   |
| `deskripsi` | string \| null                    | instruksi/detail                    |
| `bobot`     | number                            | bobot nilai 0–100 (%)               |
| `pengingat` | boolean                           | pengingat aktif/tidak               |
| `createdAt`, `updatedAt` | string (ISO 8601)    | dibuat otomatis                     |

## Endpoint API
| Method | Rute          | Handler   | Keterangan                       | Status sukses |
|--------|---------------|-----------|----------------------------------|---------------|
| GET    | `/tugas`      | findAll   | Ambil semua tugas                | 200           |
| GET    | `/tugas/:id`  | findOne   | Ambil satu tugas                 | 200           |
| POST   | `/tugas`      | create    | Tambah tugas                     | 201           |
| PATCH  | `/tugas/:id`  | update    | Ubah sebagian/seluruh data tugas | 200           |
| DELETE | `/tugas/:id`  | remove    | Hapus tugas                      | 204           |

## Validasi (class-validator) dan Error Handling
`ValidationPipe` diaktifkan global di `main.ts` (`whitelist`, `forbidNonWhitelisted`, `transform`).

| Field       | Aturan validasi                                               |
|-------------|---------------------------------------------------------------|
| `nama`      | `@IsString`, `@MinLength(3)`, `@MaxLength(100)`               |
| `matkul`    | `@IsString`, `@IsNotEmpty`, `@MaxLength(100)`                 |
| `dosen`     | `@IsOptional`, `@IsString`, `@MaxLength(10)`                  |
| `deadline`  | `@IsDateString`                                               |
| `status`    | `@IsOptional`, `@IsIn(['belum','proses','selesai'])`          |
| `deskripsi` | `@IsOptional`, `@IsString`, `@MaxLength(2000)`                |
| `bobot`     | `@IsOptional`, `@IsInt`, `@Min(0)`, `@Max(100)`               |
| `pengingat` | `@IsOptional`, `@IsBoolean`                                   |

`UpdateTugasDto` memakai `PartialType(CreateTugasDto)` sehingga semua field opsional pada PATCH.

| Skenario                                       | Exception              | Status |
|------------------------------------------------|------------------------|--------|
| Id tugas tidak ditemukan (GET/PATCH/DELETE)    | `NotFoundException`    | 404    |
| Tugas dengan nama + mata kuliah yang sama      | `ConflictException`    | 409    |
| Data tidak lolos validasi DTO                  | `ValidationPipe` (400) | 400    |

Seluruh error dibentuk seragam oleh `HttpExceptionFilter`: `{ statusCode, error, message, path, timestamp }`.

## Fitur Frontend yang Tersambung ke Backend
- Memuat daftar tugas dari server saat halaman dibuka (loading, error, dan tombol coba lagi)
- **Tambah** tugas (`POST`), pesan validasi/duplikat dari server ditampilkan pada form
- **Ubah** tugas: halaman Edit (`PATCH`) dan dropdown ubah status cepat pada kartu tugas
- **Hapus** tugas (`DELETE`) dengan konfirmasi

## Screenshot
Seluruh bukti ada di folder [`docs/screenshots`](docs/screenshots).

### 1. Setup NestJS
| Tahap | Screenshot |
|-------|------------|
| Nest CLI terpasang dan proyek dibuat | ![](docs/screenshots/01-nest-cli.png) |
| `nest g resource tugas` | ![](docs/screenshots/02-generate-resource.png) |
| Server berjalan (log rute terpetakan) | ![](docs/screenshots/03-server-berjalan.png) |

### 2. Pengujian REST Client
| Method | Screenshot request & response |
|--------|-------------------------------|
| GET semua | ![](docs/screenshots/04-get-all.png) |
| POST | ![](docs/screenshots/05-post.png) |
| GET satu | ![](docs/screenshots/06-get-one.png) |
| PATCH | ![](docs/screenshots/07-patch.png) |
| DELETE | ![](docs/screenshots/08-delete.png) |
| Error 404 | ![](docs/screenshots/09-error-404.png) |
| Error 409 | ![](docs/screenshots/10-error-409.png) |
| Error 400 (validasi) | ![](docs/screenshots/11-error-400.png) |

### 3. Integrasi Frontend
| Alur | Screenshot |
|------|------------|
| Daftar tugas dimuat dari server | ![](docs/screenshots/12-frontend-daftar.png) |
| Tambah data | ![](docs/screenshots/13-frontend-tambah.png) |
| Ubah data | ![](docs/screenshots/14-frontend-ubah.png) |
| Hapus data | ![](docs/screenshots/15-frontend-hapus.png) |
