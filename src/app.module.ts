import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppController } from "@/app.controller";
import { AppService } from "@/app.service";
import { UserModule } from "@/modules/user/user.module";
import { APP_FILTER } from "@nestjs/core";
import { GlobalExceptionFilter } from "@/exception-filters/global-exception.filter";
import { AuthModule } from "./modules/auth/auth.module";
import { BookingModule } from "./modules/booking/booking.module";
import { CinemaModule } from "./modules/cinema/cinema.module";
import { ReviewModule } from "./modules/review/review.module";
import { MovieModule } from "./modules/movie/movie.module";
import { RoomModule } from "./modules/room/room.module";
import { ScreeningModule } from "./modules/screening/screening.module";
import { SeatModule } from "./modules/seat/seat.module";
import { SnackModule } from "./modules/snack/snack.module";
import { Voucher } from "./entities/voucher.entity";
import { VoucherModule } from "./modules/voucher/voucher.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: "postgres",
        host: configService.getOrThrow<string>("POSTGRES_HOST"),
        port: configService.getOrThrow<number>("POSTGRES_PORT"),
        username: configService.getOrThrow<string>("POSTGRES_USER"),
        password: configService.getOrThrow<string>("POSTGRES_PASSWORD"),
        database: configService.getOrThrow<string>("POSTGRES_DB"),
        autoLoadEntities: true,
        synchronize: true, // false in production
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    BookingModule,
    CinemaModule,
    MovieModule,
    RoomModule,
    ReviewModule,
    BookingModule,
    ScreeningModule,
    SeatModule,
    SnackModule,
    VoucherModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
