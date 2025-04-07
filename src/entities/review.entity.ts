import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "@/entities/base-class";
import { User } from "@/entities/user.entity";
import { Movie } from "@/entities/movie.entity";

@Entity({ name: "reviews" })
export class Review extends BaseEntity {
  @ApiProperty({
    example: "1",
    description: "Review unique identifier",
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example:
      "This movie had incredible special effects and a compelling story...",
    description: "Review content",
  })
  @Column({ type: "text" })
  content: string;

  @ApiProperty({
    example: 4.5,
    description: "Rating given in the review (out of 5)",
  })
  @Column({ type: "decimal", precision: 2, scale: 1 })
  rating: number;

  @ApiProperty({
    example: "2025-04-07 10:00:00",
    description: "Review timestamp (edit or creation)",
  })
  timeStamp: Date;

  @ApiProperty({
    example: false,
    description: "Indicates if the review has been edited",
  })
  isEdited: boolean;

  @ApiProperty({
    type: () => User,
    description: "The user who wrote the review",
  })
  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column()
  user_id: number;

  @ApiProperty({
    type: () => Movie,
    description: "The movie being reviewed",
  })
  @ManyToOne(() => Movie, (movie) => movie.reviews)
  @JoinColumn({ name: "movie_id" })
  movie: Movie;

  @Column()
  movie_id: number;
}
