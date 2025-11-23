import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix("");
    const port = process.env.PORT || 3003;
    await app.listen(port);
    console.log(`Orders service running on http://localhost:${port}`);
}

bootstrap();
