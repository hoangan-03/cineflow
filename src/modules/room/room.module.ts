import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { Room } from '@/entities/room.entity';
import { Seat } from '@/entities/seat.entity';
import { Cinema } from '@/entities/cinema.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Seat, Cinema])],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}