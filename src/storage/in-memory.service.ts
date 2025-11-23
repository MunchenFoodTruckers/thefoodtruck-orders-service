import { Injectable } from "@nestjs/common";

export interface OrderItem {
    id: string;
    orderId: string;
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    createdAt: Date;
}

export interface Order {
    id: string;
    userId: string;
    status: string;
    totalPrice: number;
    items: OrderItem[];
    createdAt: Date;
    updatedAt: Date;
}

@Injectable()
export class InMemoryStorage {
    private orders: Map<string, Order> = new Map();
    private orderCounter = 0;

    constructor() {
        this.seedData();
    }

    private seedData(): void {
        const order: Order = {
            id: "1",
            userId: "demo-user",
            status: "completed",
            totalPrice: 18.98,
            items: [
                {
                    id: "1",
                    orderId: "1",
                    menuItemId: "1",
                    name: "Classic Burger",
                    price: 8.99,
                    quantity: 2,
                    createdAt: new Date()
                }
            ],
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.orders.set(order.id, order);
        this.orderCounter = 1;
    }

    async findAllOrders(userId?: string): Promise<Order[]> {
        const orders = Array.from(this.orders.values());
        return userId ? orders.filter(o => o.userId === userId) : orders;
    }

    async findOrderById(id: string): Promise<Order | null> {
        return this.orders.get(id) || null;
    }

    async createOrder(data: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order> {
        this.orderCounter++;
        const id = String(this.orderCounter);
        const order: Order = {
            id,
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.orders.set(id, order);
        return order;
    }

    async updateOrderStatus(id: string, status: string): Promise<Order | null> {
        const order = this.orders.get(id);
        if (!order) return null;
        const updated = { ...order, status, updatedAt: new Date() };
        this.orders.set(id, updated);
        return updated;
    }
}
