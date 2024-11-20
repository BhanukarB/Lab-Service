import 'dotenv/config'; // Load environment variables from .env file
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import knex from './db/connector/knex'; // Ensure the path is correct
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { setupSwagger } from './swagger.config';

async function bootstrap() {
  // Run migrations before starting the app
  await knex.migrate.latest();

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: 'http://localhost:3001', // Allow requests from your frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
    credentials: true, // Allow cookies or credentials if needed
  });

  const options = new DocumentBuilder()
    .setTitle('Your API Title')
    .setDescription('API description')
    .addTag('users')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT', // Ensure the same name 'JWT'
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  setupSwagger(app);
  await app.listen(3000); // or any port you choose
  console.log('Application is running on: http://localhost:3000');
}

bootstrap();
