// src/tugas/entities/tugas.entity.ts
// Entity = bentuk satu data Tugas (bagian "data" dari Model pada MVC).

export const DAFTAR_STATUS = ['belum', 'proses', 'selesai'] as const;
export type StatusTugas = (typeof DAFTAR_STATUS)[number];

export class Tugas {
  id: string; // string (UUID)
  nama: string; // string
  matkul: string; // string
  dosen: string; // string (kode dosen, boleh kosong)
  deadline: string; // tanggal & waktu (string ISO 8601)
  status: StatusTugas; // pilihan tetap: belum | proses | selesai
  deskripsi: string | null; // string, boleh null
  bobot: number; // angka (bobot nilai 0-100 %)
  pengingat: boolean; // boolean (aktifkan pengingat atau tidak)
  createdAt: string;
  updatedAt: string;
}
