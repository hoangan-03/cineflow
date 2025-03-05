import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { Review } from '@/entities/review.entity';
import { Movie } from '@/entities/movie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Movie])],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}