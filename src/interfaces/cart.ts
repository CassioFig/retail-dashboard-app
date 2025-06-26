import { Product } from "./product";

export interface Cart {
	id: string;
	userId: string;
	items: CartItem[];
	totalItemCount: number;
	totalAmount: number;
}

export interface CartItem {
	productId: string;
	quantity: number;
	price: number;
	product?: Product;
}