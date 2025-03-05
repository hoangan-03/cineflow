import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn
  } from "typeorm";
  import { ApiProperty } from "@nestjs/swagger";
  import { BaseEntity } from "@/entities/base-class";
  import { User } from "@/entities/user.entity";
  import { Movie } from "@/entities/movie.entity";
  
  @Entity({ name: "reviews" })
  export class Review extends BaseEntity {
    @ApiProperty({
      example: "123e4567-e89b-12d3-a456-426614174000",
      description: "Review unique identifier"
    })
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @ApiProperty({
      example: "Great movie with amazing visuals",
      description: "Review title"
    })
    @Column({ type: "varchar", length: 255 })
    title: string;
  
    @ApiProperty({
      example: "This movie had incredible special effects and a compelling story...",
      description: "Review content"
    })
    @Column({ type: "text" })
    content: string;
  
    @ApiProperty({
      example: 4.5,
      description: "Rating given in the review (out of 5)"
    })
    @Column({ type: "decimal", precision: 2, scale: 1 })
    rating: number;
  
    @ApiProperty({
      example: true,
      description: "Whether this review contains spoilers"
    })
    @Column({ type: "boolean", default: false })
    containsSpoilers: boolean;
  
    @ApiProperty({
      type: () => User,
      description: "The user who wrote the review"
    })
    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user: User;
  
    @Column({ type: "uuid" })
    user_id: string;
  
    @ApiProperty({
      type: () => Movie,
      description: "The movie being reviewed"
    })
    @ManyToOne(() => Movie, movie => movie.reviews)
    @JoinColumn({ name: "movie_id" })
    movie: Movie;
  
    @Column({ type: "uuid" })
    movie_id: string;
  }