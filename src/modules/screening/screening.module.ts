import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScreeningController } from './screening.controller';
import { ScreeningService } from './screening.service';
import { Screening } from '@/entities/screening.entity';
import { Movie } from '@/entities/movie.entity';
import { Theater } from '@/entities/theater.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Screening, Movie, Theater])],
  controllers: [ScreeningController],
  providers: [ScreeningService],
  exports: [ScreeningService],
})
export class ScreeningModule {}