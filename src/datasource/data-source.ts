import { DataSource } from 'typeorm';
import { User } from '@/entities/user.entity';
import { PaymentMethods } from '@/entities/payment-methods.entity';
import { Setting } from '@/entities/setting.entity';
import { UserStatus} from '@/entities/user-status.entity';
import { BookedSeat } from '@/entities/booked-seat.entity';
import { Booking } from '@/entities/booking.entity';
import { Cinema } from '@/entities/cinema.entity';
import { Genre } from '@/entities/genre.entity';
import { Movie } from '@/entities/movie.entity';
import { Review } from '@/entities/review.entity';
import { Screening } from '@/entities/screening.entity';
import { Seat } from '@/entities/seat.entity';
import { Theater } from '@/entities/theater.entity';


export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'cineflow',
  entities: [User, Setting, PaymentMethods, UserStatus, BookedSeat, Booking, Cinema, Genre, Movie, Review, Screening, Seat, Theater],
  migrations: ['migrations/*.ts'],
  synchronize: true, // set to false in production
});