import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { OrdersModule } from "./orders/orders.module";
import { PrismaService } from "./prisma.service";

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), OrdersModule],
    controllers: [],
    providers: [PrismaService],
    exports: [PrismaService]
})
export class AppModule { }
