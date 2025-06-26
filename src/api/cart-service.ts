import { Cart, CartItem } from "@/interfaces/cart";
import api from "../services/api";

const BASE_ROUTE = '/carts';

const addToCart = async (request: CartItem): Promise<Cart> => {
	const response = await api.post(BASE_ROUTE, request);
	return response.data;
};

const getCart = async (): Promise<Cart> => {
	const response = await api.get<Cart>(`${BASE_ROUTE}`);
	return response.data;
};

export const cartServices = {
	addToCart,
	getCart,
}

