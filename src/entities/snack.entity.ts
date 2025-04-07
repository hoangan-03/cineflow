import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "@/entities/base-class";
import { FREE_STR } from "@/constants/validation.constant";
import { MaxLength } from "class-validator";
import { User } from "./user.entity";

@Entity({ name: "snacks" })
export class Snack extends BaseEntity {
  @ApiProperty({
    example: "1",
    description: "Snack unique identifier",
  })
  @PrimaryGeneratedColumn()
  id: number;

  @MaxLength(FREE_STR)
  @ApiProperty({
    example: "Poca Wavy 1",
    description: "Snack name",
  })
  @Column({ type: "varchar", length: FREE_STR, default: "Poca Wavy" })
  name: string;

  @ApiProperty({
    example: 12.99,
    description: "Snack price",
  })
  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @ApiProperty({
    example: "A crispy and delicious snack",
    description: "Snack description",
  })
  @Column({ type: "text", nullable: true })
  description: string;

  @ApiProperty({
    type: () => User,
    description: "The user who purchased the snack",
  })
  @ManyToOne(() => User, (user) => user.snacks)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column()
  user_id: number;
}
