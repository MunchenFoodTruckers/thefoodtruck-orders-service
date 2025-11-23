export class CreateOrderDto {
    userId: string;
    items: OrderItemDto[];
}

export class OrderItemDto {
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
}

export class UpdateOrderStatusDto {
    status: string; // pending, preparing, ready, completed, cancelled
}
