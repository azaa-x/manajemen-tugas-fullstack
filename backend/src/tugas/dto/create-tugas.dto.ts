import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { DAFTAR_STATUS, type StatusTugas } from '../entities/tugas.entity.js';

const potongSpasi = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreateTugasDto {
  @Transform(potongSpasi)
  @IsString({ message: 'nama harus berupa teks' })
  @MinLength(3, { message: 'nama minimal 3 karakter' })
  @MaxLength(100, { message: 'nama maksimal 100 karakter' })
  nama: string;

  @Transform(potongSpasi)
  @IsString({ message: 'matkul harus berupa teks' })
  @IsNotEmpty({ message: 'matkul wajib diisi' })
  @MaxLength(100, { message: 'matkul maksimal 100 karakter' })
  matkul: string;

  @IsOptional()
  @IsString({ message: 'dosen harus berupa teks' })
  @MaxLength(10, { message: 'dosen maksimal 10 karakter' })
  dosen?: string;

  @IsDateString({}, { message: 'deadline harus berformat tanggal ISO 8601 (contoh: 2026-10-01T23:59)' })
  deadline: string;

  @IsOptional()
  @IsIn(DAFTAR_STATUS, { message: 'status harus salah satu dari: belum, proses, selesai' })
  status?: StatusTugas;

  @IsOptional()
  @IsString({ message: 'deskripsi harus berupa teks' })
  @MaxLength(2000, { message: 'deskripsi maksimal 2000 karakter' })
  deskripsi?: string;

  @IsOptional()
  @IsInt({ message: 'bobot harus berupa bilangan bulat' })
  @Min(0, { message: 'bobot minimal 0' })
  @Max(100, { message: 'bobot maksimal 100' })
  bobot?: number;

  @IsOptional()
  @IsBoolean({ message: 'pengingat harus bernilai true atau false' })
  pengingat?: boolean;
}