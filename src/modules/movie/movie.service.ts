import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '@/entities/movie.entity';
import { Genre } from '@/entities/genre.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>
  ) {}

  async findAll(genre?: string): Promise<Movie[]> {
    const queryBuilder = this.movieRepository.createQueryBuilder('movie')
      .leftJoinAndSelect('movie.genres', 'genre');
      
    if (genre) {
      queryBuilder.where('genre.name = :genre', { genre });
    }
    
    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Movie> {
    const movie = await this.movieRepository.findOne({ 
      where: { id },
      relations: ['genres'] 
    });
    
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    
    return movie;
  }

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const { genreIds, ...movieData } = createMovieDto;
    
    const genres = await this.genreRepository.findByIds(genreIds);
    const movie = this.movieRepository.create({
      ...movieData,
      genres
    });
    
    return this.movieRepository.save(movie);
  }

  async update(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const { genreIds, ...movieData } = updateMovieDto;
    
    const movie = await this.findOne(id);
    
    if (genreIds) {
      const genres = await this.genreRepository.findByIds(genreIds);
      movie.genres = genres;
    }
    
    Object.assign(movie, movieData);
    
    return this.movieRepository.save(movie);
  }

  async remove(id: string): Promise<void> {
    const result = await this.movieRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
  }
}