import { DataSource } from 'typeorm';
import { User } from '@/entities/user.entity';

import { BookedSeat } from '@/entities/booked-seat.entity';
import { Booking } from '@/entities/booking.entity';
import { Cinema } from '@/entities/cinema.entity';
import { Genre } from '@/entities/genre.entity';
import { Movie } from '@/entities/movie.entity';
import { Review } from '@/entities/review.entity';
import { Screening } from '@/entities/screening.entity';
import { Seat } from '@/entities/seat.entity';
import { Room } from '@/entities/room.entity';


export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'cineflow',
  entities: [User, BookedSeat, Booking, Cinema, Genre, Movie, Review, Screening, Seat, Room],
  migrations: ['migrations/*.ts'],
  synchronize: true, // set to false in production
});