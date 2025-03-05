import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany
  } from "typeorm";
  import { ApiProperty } from "@nestjs/swagger";
  import { BaseEntity } from "@/entities/base-class";
  import { Theater } from "@/entities/theater.entity";
  
  @Entity({ name: "cinemas" })
  export class Cinema extends BaseEntity {
    @ApiProperty({
      example: "123e4567-e89b-12d3-a456-426614174000",
      description: "Cinema unique identifier"
    })
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @ApiProperty({
      example: "Cineworld",
      description: "Cinema name"
    })
    @Column({ type: "varchar", length: 255 })
    name: string;
  
    @ApiProperty({
      example: "123 Main Street, Cityville",
      description: "Cinema address"
    })
    @Column({ type: "text" })
    address: string;
  
    @ApiProperty({
      example: "+1234567890",
      description: "Cinema phone number"
    })
    @Column({ type: "varchar", length: 20 })
    phoneNumber: string;
  
    @ApiProperty({
      example: "https://example.com/image.jpg",
      description: "Cinema image URL"
    })
    @Column({ type: "text", nullable: true })
    imageUrl: string;
  
    @ApiProperty({
      example: true,
      description: "Whether the cinema has parking"
    })
    @Column({ type: "boolean", default: false })
    hasParking: boolean;
  
    @ApiProperty({
      example: true,
      description: "Whether the cinema has food court"
    })
    @Column({ type: "boolean", default: false })
    hasFoodCourt: boolean;
  
    @OneToMany(() => Theater, theater => theater.cinema)
    theaters: Theater[];
  }