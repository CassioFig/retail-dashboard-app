import { Product } from "./product";

export interface Order {
	id: string;
	userId: string;
	items: OrderItem[];
	totalAmount: number;
}

export interface OrderItem {
	productId: string;
	quantity: number;
	price: number;
	product?: Product;
}