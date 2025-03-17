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
import { ApiProperty } from "@nestjs/swagger";
import { Gender } from "@/modules/user/enums/gender.enum";
import { IsEnum, IsOptional } from "class-validator";
import { BaseEntity } from "@/entities/base-class";
import { Inject } from "@nestjs/common";
import { Role } from "@/modules/auth/enums/role.enum";

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
  @Column({ type: "varchar", length: 255, unique: true })
  email: string;

  @ApiProperty({
    example: "John Nguyen",
    description: "User name",
  })
  @Column({ type: "varchar", length: 255, unique: true })
  username: string;

  @Exclude()
  @Column({ type: "varchar", length: 255, nullable: true })
  password?: string;

  @ApiProperty({
    example: "+1234567890",
    description: "User phone number",
    required: false,
  })
  @Column({ type: "varchar", length: 15, nullable: true })
  phoneNumber: string;

  @ApiProperty({
    example: "1990-01-01",
    description: "User date of birth",
    required: false,
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
    description: "User role"
  })
  @Column({
    type: "enum",
    enum: Role,
    default: Role.MOVIEGOER
  })
  role: Role;
}
