import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api/v2'); //Prefijo de la API

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true, // le dice a la tubería que devuelva el valor transformado automáticamente. Si no está configurado, se utilizará el valor entrante original
            transformOptions: {
                enableImplicitConversion: true // Le indica que si ve un primitivo (booleano o number), aunque sea una cadena, asuma que debe ser de tipo primitivo y lo transforme
            }
        })
    );

    await app.listen( process.env.PORT );
    console.log(`Server ejecutando en puerto: ${ process.env.PORT }`);
}
bootstrap();
