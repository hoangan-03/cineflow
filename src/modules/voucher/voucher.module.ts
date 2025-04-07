import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VoucherController } from "./voucher.controller";
import { VoucherService } from "./voucher.service";
import { Voucher } from "@/entities/voucher.entity";
import { User } from "@/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Voucher, User])],
  controllers: [VoucherController],
  providers: [VoucherService],
  exports: [VoucherService],
})
export class VoucherModule {}
