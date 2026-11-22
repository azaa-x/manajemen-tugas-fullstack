

export const DAFTAR_STATUS = ['belum', 'proses', 'selesai'] as const;
export type StatusTugas = (typeof DAFTAR_STATUS)[number];

export class Tugas {
  id: string;
  nama: string;
  matkul: string;
  dosen: string;
  deadline: string;
  status: StatusTugas;
  deskripsi: string | null;
  bobot: number;
  pengingat: boolean;
  createdAt: string;
  updatedAt: string;
}
