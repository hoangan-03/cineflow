import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CinemaController } from './cinema.controller';
import { CinemaService } from './cinema.service';
import { Cinema } from '@/entities/cinema.entity';
import { Theater } from '@/entities/theater.entity';
import { Seat } from '@/entities/seat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cinema, Theater, Seat])],
  controllers: [CinemaController],
  providers: [CinemaService],
  exports: [CinemaService],
})
export class CinemaModule {}