import { Module } from '@nestjs/common';
import { TugasController } from './tugas.controller.js';
import { TugasService } from './tugas.service.js';

@Module({
  controllers: [TugasController],
  providers: [TugasService],
})
export class TugasModule {}