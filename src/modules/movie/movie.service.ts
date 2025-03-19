import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThan, LessThan, Between } from "typeorm";
import { Movie } from "@/entities/movie.entity";
import { Genre } from "@/entities/genre.entity";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { Review } from "@/entities/review.entity";
import { Booking } from "@/entities/booking.entity";
import { Screening } from "@/entities/screening.entity";

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,

    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,

    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,

    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>
  ) {}

  // PUBLIC METHODS

  async findAll(): Promise<Movie[]> {
    return this.movieRepository.find({
      relations: ["genres"],
    });
  }

  async findAllGenres(): Promise<Genre[]> {
    return this.genreRepository.find({
      order: {
        name: "ASC",
      },
    });
  }

  async findAllByGenre(genreName?: string): Promise<Movie[]> {
    const queryBuilder = this.movieRepository
      .createQueryBuilder("movie")
      .leftJoinAndSelect("movie.genres", "genre")
      .orderBy("movie.releaseDate", "DESC");
  
    if (genreName) {
      queryBuilder
        .innerJoin("movie.genres", "filterGenre")
        .andWhere("filterGenre.name = :genreName", { genreName });
    }
  
    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ["genres"],
    });
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return movie;
  }

  async getNowPlaying(): Promise<Movie[]> {
    const today = new Date();

    // Find movies that have screenings scheduled today or in the near future
    const movies = await this.movieRepository
      .createQueryBuilder("movie")
      .leftJoinAndSelect("movie.genres", "genre")
      .leftJoinAndSelect("movie.screenings", "screening")
      .where("screening.startTime > :today", { today })
      .andWhere("movie.releaseDate <= :today", { today })
      .orderBy("movie.releaseDate", "DESC")
      .getMany();

    return movies;
  }

  async getComingSoon(): Promise<Movie[]> {
    const today = new Date();
    const inOneMonth = new Date();
    inOneMonth.setMonth(inOneMonth.getMonth() + 1);

    // Find movies releasing between now and one month from now
    return this.movieRepository.find({
      where: {
        releaseDate: Between(today, inOneMonth),
      },
      relations: ["genres"],
      order: {
        releaseDate: "ASC",
      },
    });
  }

  // MOVIEGOER
  async getRecommendations(userId: string): Promise<Movie[]> {
    // Get user's favorite genres based on their watched movies and reviews
    const userBookings = await this.bookingRepository.find({
      where: { user_id: userId },
      relations: ["screening", "screening.movie", "screening.movie.genres"],
    });

    const userReviews = await this.reviewRepository.find({
      where: { user_id: userId },
      relations: ["movie", "movie.genres"],
    });

    const favoriteGenres = new Map<string, number>();

    // Count genre occurrences from bookings
    userBookings.forEach((booking) => {
      const movie = booking.screening.movie;
      movie.genres.forEach((genre) => {
        const count = favoriteGenres.get(genre.id.toString()) || 0;
        favoriteGenres.set(genre.id.toString(), count + 1);
      });
    });

    // Count genre occurrences from highly rated reviews
    userReviews
      .filter((review) => review.rating >= 4) // Highly rated movies (4 and above)
      .forEach((review) => {
        review.movie.genres.forEach((genre) => {
          const count = favoriteGenres.get(genre.id.toString()) || 0;
          favoriteGenres.set(genre.id.toString(), count + 1);
        });
      });

    // If we have user preferences, recommend based on them
    if (favoriteGenres.size > 0) {
      // Sort by frequency
      const sortedGenres = Array.from(favoriteGenres.entries())
        .sort((a, b) => b[1] - a[1])
        .map((entry) => entry[0])
        .slice(0, 3); // Get top 3 genres

      // Find movies with those genres that the user hasn't watched yet
      const watchedMovieIds = new Set([
        ...userBookings.map((booking) => booking.screening.movie_id),
        ...userReviews.map((review) => review.movie_id),
      ]);

      return this.movieRepository
        .createQueryBuilder("movie")
        .leftJoinAndSelect("movie.genres", "genre")
        .where("genre.id IN (:...genreIds)", { genreIds: sortedGenres })
        .andWhere("movie.id NOT IN (:...watchedMovieIds)", {
          watchedMovieIds: Array.from(watchedMovieIds),
        })
        .orderBy("movie.releaseDate", "DESC")
        .limit(5)
        .getMany();
    }

    // Default to top rated movies if no preferences found
    return this.movieRepository
      .createQueryBuilder("movie")
      .leftJoinAndSelect("movie.genres", "genre")
      .leftJoinAndSelect("movie.reviews", "review")
      .addSelect("AVG(review.rating)", "avgRating")
      .groupBy("movie.id")
      .orderBy("avgRating", "DESC")
      .limit(5)
      .getMany();
  }

  // STAFF

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const { genres, ...movieData } = createMovieDto;

    // Find genres by IDs
    const genreEntities = await this.genreRepository.findByIds(
      genres.map((genre) => genre)
    );

    if (genres.length !== genreEntities.length) {
      throw new NotFoundException("One or more genres not found");
    }

    const movie = this.movieRepository.create({
      ...movieData,
      genres: genreEntities,
    });

    return this.movieRepository.save(movie);
  }

  async update(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const { genres, ...movieData } = updateMovieDto;

    const movie = await this.findOne(id);

    if (genres) {
      const genreEntities = await this.genreRepository.findByIds(
        genres.map((genre) => genre)
      );

      if (genres.length !== genreEntities.length) {
        throw new NotFoundException("One or more genres not found");
      }

      movie.genres = genreEntities;
    }

    Object.assign(movie, movieData);

    return this.movieRepository.save(movie);
  }

  async remove(id: string): Promise<void> {
    const movie = await this.findOne(id);

    // Check if movie has associated screenings
    if (movie.screenings && movie.screenings.length > 0) {
      throw new BadRequestException(
        "Cannot delete movie with associated screenings"
      );
    }

    const result = await this.movieRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
  }

}
