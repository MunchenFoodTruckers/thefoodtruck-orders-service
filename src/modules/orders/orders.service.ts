import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { InMemoryStorage, Order } from "../../storage/in-memory.service";
import { CreateOrderDto, UpdateOrderStatusDto } from "./dto";

@Injectable()
export class OrdersService {
    private inMemory: InMemoryStorage = new InMemoryStorage();
    private useInMemory: boolean = false;

    constructor(private prisma: PrismaService) {
        this.checkConnection();
    }

    private async checkConnection(): Promise<void> {
        try {
            await this.prisma.$queryRaw`SELECT 1`;
            this.useInMemory = false;
        } catch {
            this.useInMemory = true;
            console.log("📦 Using in-memory storage for orders service");
        }
    }

    async findAll(userId?: string): Promise<any[]> {
        if (this.useInMemory) {
            return this.inMemory.findAllOrders(userId);
        }
        const where = userId ? { userId } : {};
        return this.prisma.order.findMany({ where, include: { items: true } });
    }

    async findOne(id: string): Promise<any> {
        if (this.useInMemory) {
            return this.inMemory.findOrderById(id);
        }
        return this.prisma.order.findUnique({ where: { id }, include: { items: true } });
    }

    async create(dto: CreateOrderDto): Promise<any> {
        const totalPrice = dto.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        if (this.useInMemory) {
            return this.inMemory.createOrder({
                userId: dto.userId,
                status: "pending",
                totalPrice,
                items: dto.items.map((item, idx) => ({
                    id: String(idx + 1),
                    orderId: "",
                    ...item,
                    createdAt: new Date()
                }))
            });
        }

        return this.prisma.order.create({
            data: {
                userId: dto.userId,
                status: "pending",
                totalPrice,
                items: {
                    create: dto.items
                }
            },
            include: { items: true }
        });
    }

    async updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<any> {
        if (this.useInMemory) {
            return this.inMemory.updateOrderStatus(id, dto.status);
        }
        return this.prisma.order.update({
            where: { id },
            data: { status: dto.status }
        });
    }

    async findActive(): Promise<any[]> {
        if (this.useInMemory) {
            const all = await this.inMemory.findAllOrders();
            return all.filter(o => !["completed", "cancelled"].includes(o.status));
        }
        return this.prisma.order.findMany({
            where: {
                status: {
                    notIn: ["completed", "cancelled"]
                }
            },
            include: { items: true }
        });
    }
}
