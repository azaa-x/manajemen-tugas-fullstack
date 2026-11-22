import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateTugasDto } from './dto/create-tugas.dto.js';
import { UpdateTugasDto } from './dto/update-tugas.dto.js';
import { Tugas } from './entities/tugas.entity.js';

function buatDataAwal(): Tugas[] {
  const now = new Date().toISOString();
  const dasar = { pengingat: false, createdAt: now, updatedAt: now };
  return [
    {
      ...dasar,
      id: randomUUID(),
      nama: 'Tugas 02 HTML',
      matkul: 'Perancangan dan Pemrograman Web',
      dosen: 'VLY',
      deadline: '2026-09-28T23:59',
      status: 'proses',
      deskripsi:
        'Buat sebuah halaman web sederhana menggunakan HTML dan CSS berdasarkan studi kasus yang diberikan. Kumpulkan hasil pengerjaan dalam format PDF melalui portal kelas.',
      bobot: 10,
      pengingat: true,
    },
    {
      ...dasar,
      id: randomUUID(),
      nama: 'Kuis 02',
      matkul: 'Perancangan dan Pemrograman Web',
      dosen: 'VLY',
      deadline: '2026-09-30T17:00',
      status: 'belum',
      deskripsi: 'Kuis singkat materi HTML dan CSS.',
      bobot: 5,
    },
    {
      ...dasar,
      id: randomUUID(),
      nama: 'Project 01',
      matkul: 'Pengalaman Pengguna',
      dosen: 'ABC',
      deadline: '2026-10-01T23:59',
      status: 'belum',
      deskripsi: 'Project pertama mata kuliah Pengalaman Pengguna.',
      bobot: 20,
    },
    {
      ...dasar,
      id: randomUUID(),
      nama: 'Tugas 01 Pengenalan Web',
      matkul: 'Perancangan dan Pemrograman Web',
      dosen: 'VLY',
      deadline: '2026-09-21T23:59',
      status: 'selesai',
      deskripsi: 'Tugas pengenalan konsep dasar web.',
      bobot: 5,
    },
  ];
}

@Injectable()
export class TugasService {
  private tugas: Tugas[] = buatDataAwal();

  findAll(): Tugas[] {
    return [...this.tugas].sort((a, b) => a.deadline.localeCompare(b.deadline));
  }

  findOne(id: string): Tugas {
    const tugas = this.tugas.find((t) => t.id === id);
    if (!tugas) {
      // Skenario error 1: data tidak ditemukan -> 404
      throw new NotFoundException(`Tugas dengan id ${id} tidak ditemukan`);
    }
    return tugas;
  }

  create(dto: CreateTugasDto): Tugas {
    this.pastikanTidakDuplikat(dto.nama, dto.matkul);

    const now = new Date().toISOString();
    const tugas: Tugas = {
      id: randomUUID(),
      nama: dto.nama,
      matkul: dto.matkul,
      dosen: dto.dosen ?? '',
      deadline: dto.deadline,
      status: dto.status ?? 'belum',
      deskripsi: dto.deskripsi ?? null,
      bobot: dto.bobot ?? 0,
      pengingat: dto.pengingat ?? false,
      createdAt: now,
      updatedAt: now,
    };
    this.tugas.push(tugas);
    return tugas;
  }

  update(id: string, dto: UpdateTugasDto): Tugas {
    const tugas = this.findOne(id);

    this.pastikanTidakDuplikat(
      dto.nama ?? tugas.nama,
      dto.matkul ?? tugas.matkul,
      id,
    );

    const perubahan = Object.fromEntries(
      Object.entries(dto).filter(
        ([kunci, nilai]) =>
          nilai !== undefined && (nilai !== null || kunci === 'deskripsi'),
      ),
    );

    Object.assign(tugas, perubahan, { updatedAt: new Date().toISOString() });
    return tugas;
  }

  remove(id: string): void {
    const tugas = this.findOne(id);
    this.tugas = this.tugas.filter((t) => t.id !== tugas.id);
  }

  private pastikanTidakDuplikat(
    nama: string,
    matkul: string,
    abaikanId?: string,
  ): void {
    const sama = (a: string, b: string) =>
      a.trim().toLowerCase() === b.trim().toLowerCase();

    const duplikat = this.tugas.some(
      (t) => t.id !== abaikanId && sama(t.nama, nama) && sama(t.matkul, matkul),
    );
    if (duplikat) {
      throw new ConflictException(
        `Tugas "${nama}" pada mata kuliah ${matkul} sudah ada`,
      );
    }
  }
}