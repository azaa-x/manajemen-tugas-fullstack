
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TugasModule } from './tugas/tugas.module';

@Module({
  imports: [TugasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
