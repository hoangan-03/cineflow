import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { Movie } from '@/entities/movie.entity';
import { Genre } from '@/entities/genre.entity';
import { Review } from '@/entities/review.entity';
import { Screening } from '@/entities/screening.entity';
import { Booking } from '@/entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Genre, Review, Screening, Booking])],
  controllers: [MovieController],
  providers: [MovieService],
  exports: [MovieService],
})
export class MovieModule {}