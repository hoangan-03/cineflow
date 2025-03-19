import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToOne,
  OneToMany,
  AfterInsert,
  AfterUpdate,
  BeforeRemove,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Exclude } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Gender } from "@/modules/user/enums/gender.enum";
import { IsEnum, IsOptional, MaxLength } from "class-validator";
import { BaseEntity } from "@/entities/base-class";
import { Inject } from "@nestjs/common";
import { Role } from "@/modules/auth/enums/role.enum";
import { Booking } from "@/entities/booking.entity";
import { Review } from "@/entities/review.entity";
import { EMAIL, FREE_STR, PHONE, URL_STR } from "@/constants/validation.constant";

@Entity({ name: "users" })
export class User extends BaseEntity {
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "User unique identifier",
  })
  @PrimaryGeneratedColumn("uuid")
  id: string = uuidv4();

  @ApiProperty({
    example: "user@example.com",
    description: "User email address",
  })
  @Column({ type: "varchar", length: EMAIL, unique: true })
  @MaxLength(EMAIL)
  email: string;

  @ApiProperty({
    example: "John Nguyen",
    description: "User name",
  })
  @Column({ type: "varchar", length: FREE_STR, unique: true })
  username: string;

  @Exclude()
  @Column({ type: "varchar", length: 255, nullable: true })
  password?: string;

  @ApiPropertyOptional({
    example: "+1234567890",
    description: "User phone number",
  })
  @Column({ type: "varchar", length: PHONE, nullable: true })
  phoneNumber: string;

  @ApiPropertyOptional({
    example: "1990-01-01",
    description: "User date of birth",
  })
  @Column({ type: "date", nullable: true })
  dob: Date;

  @ApiProperty({
    enum: Gender,
    enumName: "Gender",
    example: Gender.MALE,
    description: "User gender",
    required: false,
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @MaxLength(URL_STR)
  @ApiProperty({
    example: "https://example.com/profile.jpg",
    description: "User profile image URL",
    required: false,
  })
  @Column({ type: "text", nullable: true })
  profileImageUrl: string;

  @ApiProperty({
    example: "47 ABC Street, XYZ City",
    description: "User address",
    required: false,
  })
  @Column({ type: "text", nullable: true })
  address: string;

  @ApiProperty({
    enum: Role,
    example: Role.MOVIEGOER,
    description: "User role",
  })
  @Column({
    type: "enum",
    enum: Role,
    default: Role.MOVIEGOER,
  })
  role: Role;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}
