import { DataSource } from "typeorm";
import { User } from "@/entities/user.entity";
import { BookedSeat } from "@/entities/booked-seat.entity";
import { Booking } from "@/entities/booking.entity";
import { Cinema } from "@/entities/cinema.entity";
import { Genre } from "@/entities/genre.entity";
import { Movie } from "@/entities/movie.entity";
import { Review } from "@/entities/review.entity";
import { Screening } from "@/entities/screening.entity";
import { Seat } from "@/entities/seat.entity";
import { Room } from "@/entities/room.entity";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
  username: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "postgres",
  database: process.env.POSTGRES_DB || "cineflow",
  entities: [
    User,
    BookedSeat,
    Booking,
    Cinema,
    Genre,
    Movie,
    Review,
    Screening,
    Seat,
    Room,
  ],
  migrations: ["migrations/*.ts"],
  synchronize: process.env.NODE_ENV !== "production", // set to false in production
});
