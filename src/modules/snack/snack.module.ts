import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnackController } from './snack.controller';
import { SnackService } from './snack.service';
import { Review } from '@/entities/review.entity';
import { Movie } from '@/entities/movie.entity';
import { Snack } from '@/entities/snack.entity';
import { User } from '@/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Snack, User])],
  controllers: [SnackController],
  providers: [SnackService],
  exports: [SnackService],
})
export class SnackModule {}