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
import { CreateTugasDto } from './dto/create-tugas.dto.js';
import { UpdateTugasDto } from './dto/update-tugas.dto.js';
import { TugasService } from './tugas.service.js';

@Controller('tugas')
export class TugasController {
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