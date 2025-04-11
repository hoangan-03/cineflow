import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  JoinTable,
  ManyToMany,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "@/entities/base-class";
import { FREE_STR } from "@/constants/validation.constant";
import { MaxLength } from "class-validator";
import { User } from "./user.entity";

@Entity({ name: "vouchers" })
export class Voucher extends BaseEntity {
  @ApiProperty({
    example: "1",
    description: "Voucher unique identifier",
  })
  @PrimaryGeneratedColumn()
  id: number;

  @MaxLength(3)
  @ApiProperty({
    example: "SNACK123",
    description: "Voucher code",
  })
  @Column({ type: "varchar", length: 3, unique: true })
  code: string;

  @MaxLength(4)
  @ApiProperty({
    example: 12.99,
    description: "Voucher price",
  })
  @Column({ type: "varchar", length: 4, unique: true })
  discount: string;

  @ApiProperty({
    example: "2023-12-31",
    description: "Voucher expiration date",
  })
  @Column({ type: "date" })
  exp_date: Date;

  @ApiProperty({
    type: () => [User],
    description: "Users who can use this voucher (empty means available to all)",
  })
  @ManyToMany(() => User, (user) => user.vouchers)
  @JoinTable({
    name: "user_vouchers",
    joinColumn: { name: "voucher_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "user_id", referencedColumnName: "id" },
  })
  users: User[];
}
