// src/tugas/dto/update-tugas.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateTugasDto } from './create-tugas.dto';

// PartialType membuat seluruh properti CreateTugasDto menjadi opsional
// (beserta aturan validasinya), karena PATCH hanya mengirim sebagian data,
// misalnya hanya { "status": "selesai" }.
export class UpdateTugasDto extends PartialType(CreateTugasDto) {}
