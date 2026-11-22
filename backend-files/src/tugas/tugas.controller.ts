// src/tugas/tugas.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTugasDto } from './dto/create-tugas.dto';
import { UpdateTugasDto } from './dto/update-tugas.dto';
import { TugasService } from './tugas.service';

@Controller('tugas')
export class TugasController {
  // Dependency Injection: NestJS menyuntikkan instance TugasService,
  // controller tidak membuatnya sendiri dengan "new".
  constructor(private readonly tugasService: TugasService) {}

  @Get()
  findAll() {
    return this.tugasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tugasService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateTugasDto) {
    return this.tugasService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTugasDto) {
    return this.tugasService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.tugasService.remove(id);
  }
}
