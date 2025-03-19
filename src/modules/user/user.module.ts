import { Module } from "@nestjs/common";
import { UserService } from "@/modules/user/user.service";
import { UsersController } from "@/modules/user/user.controller";
import { User } from "@/entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IsUserAlreadyExist } from "@/modules/user/validators/is-user-already-exist.validator";
import { IsUserNameAlreadyExist } from "@/modules/user/validators/is-username-already-exist.validator";
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UserService, IsUserAlreadyExist,IsUserNameAlreadyExist],
  exports: [UserService],
})
export class UserModule {}
