import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CinemaController } from './cinema.controller';
import { CinemaService } from './cinema.service';
import { Cinema } from '@/entities/cinema.entity';
import { Room } from '@/entities/room.entity';
import { Seat } from '@/entities/seat.entity';
import { Screening } from '@/entities/screening.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cinema, Room, Seat, Screening])],
  controllers: [CinemaController],
  providers: [CinemaService],
  exports: [CinemaService],
})
export class CinemaModule {}