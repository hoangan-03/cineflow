import { NestFactory } from "@nestjs/core";
import { AppModule } from "@/app.module";
import { ConfigService } from "@nestjs/config";
import {
  BadRequestException,
  Logger,
  ValidationPipe,
  VersioningType,
} from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import * as session from "express-session";
import { useContainer, ValidationError } from "class-validator";
import * as compression from "compression";
import { GlobalExceptionFilter } from "./exception-filters/global-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService);
  const port = configService.get("PORT") || 3000;

  const sessionSecret = configService.get("SESSION_SECRET") || "my-secret";

  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60000 * 60 * 24,
        secure: process.env.NODE_ENV === "production",
      },
    })
  );
  app.useGlobalFilters(new GlobalExceptionFilter(configService));
  app.use(cookieParser(sessionSecret));
  app.use(compression());
  const corsOptions = {
    origin: configService.get("CORS_ORIGINS")
      ? configService.get("CORS_ORIGINS").split(",")
      : ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  };

  app.enableCors(corsOptions);

  app.setGlobalPrefix("api");

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException({
          message: "Validation failed",
          errors: validationErrors,
        });
      },
    })
  );

  const config = new DocumentBuilder()
    .setTitle("Cineflow")
    .setDescription("API for Cineflow")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/swagger-docs", app, document);

  await app.listen(port);
}
bootstrap();
