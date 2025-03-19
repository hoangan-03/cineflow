import { NestFactory } from "@nestjs/core";
import { AppModule } from "@/app.module";
import { ConfigService } from "@nestjs/config";
import {
  BadRequestException,
  ValidationPipe,
  VersioningType,
} from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import * as session from "express-session";
import { useContainer } from "class-validator";
import * as compression from "compression";

// Polyfill global crypto if not defined
// if (!(global as any).crypto) {
//   (global as any).crypto = nodeCrypto;
// }

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

  app.use(cookieParser(sessionSecret));
  app.use(compression());
  app.enableCors();

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
      exceptionFactory: (validationErrors = []) => {
        console.log(
          "Validation errors:",
          JSON.stringify(validationErrors, null, 2)
        );
        const errors = validationErrors.reduce(
          (acc: Record<string, string>, error) => {
            if (error.constraints) {
              acc[error.property] = Object.values(error.constraints).join(", ");
            } else {
              acc[error.property] = "Invalid value";
            }
            return acc;
          },
          {}
        );
        return new BadRequestException({
          statusCode: 400,
          message: "Validation failed",
          errors,
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
