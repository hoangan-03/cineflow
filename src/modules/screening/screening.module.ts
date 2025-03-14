import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScreeningController } from './screening.controller';
import { ScreeningService } from './screening.service';
import { Screening } from '@/entities/screening.entity';
import { Movie } from '@/entities/movie.entity';
import { Room } from '@/entities/room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Screening, Movie, Room])],
  controllers: [ScreeningController],
  providers: [ScreeningService],
  exports: [ScreeningService],
})
export class ScreeningModule {}