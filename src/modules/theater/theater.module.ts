import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TheaterController } from './theater.controller';
import { TheaterService } from './theater.service';
import { Room } from '@/entities/room.entity';
import { Seat } from '@/entities/seat.entity';
import { Cinema } from '@/entities/cinema.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Seat, Cinema])],
  controllers: [TheaterController],
  providers: [TheaterService],
  exports: [TheaterService],
})
export class TheaterModule {}