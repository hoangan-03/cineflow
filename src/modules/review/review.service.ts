// src/modules/review/review.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Review } from "@/entities/review.entity";
import { Movie } from "@/entities/movie.entity";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,

    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>
  ) {}

  async findAll(movieId?: number): Promise<Review[]> {
    const queryBuilder = this.reviewRepository
      .createQueryBuilder("review")
      .leftJoinAndSelect("review.user", "user")
      .leftJoinAndSelect("review.movie", "movie");

    if (movieId) {
      queryBuilder.where("review.movie_id = :movieId", { movieId });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ["user", "movie"],
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return review;
  }

  async create(
    createReviewDto: CreateReviewDto,
    userId: number
  ): Promise<Review> {
    const { movie_id, ...reviewData } = createReviewDto;

    // Check if movie exists
    const movie = await this.movieRepository.findOne({
      where: { id: movie_id },
    });
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${movie_id} not found`);
    }

    // Check if user already reviewed this movie
    const existingReview = await this.reviewRepository.findOne({
      where: {
        movie_id,
        user_id: userId,
      },
    });

    if (existingReview) {
      throw new ForbiddenException("You have already reviewed this movie");
    }

    const review = this.reviewRepository.create({
      ...reviewData,
      movie_id,
      user_id: userId,
    });

    return this.reviewRepository.save(review);
  }

  async update(
    id: number,
    updateReviewDto: UpdateReviewDto,
    userId: number
  ): Promise<Review> {
    const review = await this.findOne(id);

    // Check if the user is the owner of the review
    if (review.user_id !== userId) {
      throw new ForbiddenException("You can only update your own reviews");
    }

    // If updating movie_id, check if movie exists
    if (updateReviewDto.movie_id) {
      const movie = await this.movieRepository.findOne({
        where: { id: updateReviewDto.movie_id },
      });
      if (!movie) {
        throw new NotFoundException(
          `Movie with ID ${updateReviewDto.movie_id} not found`
        );
      }
    }

    Object.assign(review, updateReviewDto);
    return this.reviewRepository.save(review);
  }

  async remove(id: number, userId: number): Promise<void> {
    const review = await this.findOne(id);

    // Check if the user is the owner of the review
    if (review.user_id !== userId) {
      throw new ForbiddenException("You can only delete your own reviews");
    }

    const result = await this.reviewRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
  }
}
