import { Body, Controller, Get, Post, Put, Param, Query } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto, UpdateOrderStatusDto } from "./dto";

@Controller()
export class OrdersController {
    constructor(private readonly service: OrdersService) { }

    @Get("/api/orders/health")
    health() {
        return { ok: true, service: "orders" };
    }

    @Get("/api/orders")
    findAll(@Query("userId") userId?: string) {
        return this.service.findAll(userId);
    }

    @Get("/api/orders/active")
    findActive() {
        return this.service.findActive();
    }

    @Get("/api/orders/:id")
    findOne(@Param("id") id: string) {
        return this.service.findOne(id);
    }

    @Post("/api/orders")
    create(@Body() dto: CreateOrderDto) {
        return this.service.create(dto);
    }

    @Put("/api/orders/:id/status")
    updateStatus(@Param("id") id: string, @Body() dto: UpdateOrderStatusDto) {
        return this.service.updateStatus(id, dto);
    }
}
