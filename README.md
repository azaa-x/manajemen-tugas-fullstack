# DeadlineIn — Manajemen Tugas Kuliah (Fullstack)

**DeadlineIn** adalah aplikasi pencatat tugas kuliah: mahasiswa dapat mencatat tugas beserta mata kuliah, deadline, status pengerjaan, bobot nilai, dan pengingat, lalu memantau tugas yang paling mendesak.

Pada Tugas 9 (NestJS Dasar + Struktur MVC), aplikasi frontend React dari pekan sebelumnya disambungkan ke backend **NestJS** yang mengelola data utama **Tugas** (CRUD, validasi DTO, dan penanganan error). Data disimpan sementara di memori (array), sesuai materi Modul 9.

## Menjalankan Proyek
Jalankan backend dan frontend di dua terminal terpisah.

```bash
# Terminal 1 - backend
cd backend
npm install
npm run start:dev

# Terminal 2 - frontend
cd frontend
npm install
npm run dev
```

## Endpoint API
| Method | Rute          | Handler   | Keterangan                       | Status sukses |
|--------|---------------|-----------|----------------------------------|---------------|
| GET    | `/tugas`      | findAll   | Ambil semua tugas                | 200           |
| GET    | `/tugas/:id`  | findOne   | Ambil satu tugas                 | 200           |
| POST   | `/tugas`      | create    | Tambah tugas                     | 201           |
| PATCH  | `/tugas/:id`  | update    | Ubah sebagian/seluruh data tugas | 200           |
| DELETE | `/tugas/:id`  | remove    | Hapus tugas                      | 204           |

## Error Handling
| Skenario                                       | Exception              | Status |
|------------------------------------------------|------------------------|--------|
| Id tugas tidak ditemukan (GET/PATCH/DELETE)    | `NotFoundException`    | 404    |
| Tugas dengan nama + mata kuliah yang sama      | `ConflictException`    | 409    |
| Data tidak lolos validasi DTO                  | `ValidationPipe` (400) | 400    |

## Screenshot
Seluruh bukti ada di folder [`docs/screenshots`](docs/screenshots).
