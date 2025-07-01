import { OrderItem } from "@/interfaces";
import api from "@/services/api";

const BASE_ROUTE = '/orders';

const getAllOrdersByProduct = async (): Promise<Pick<OrderItem, 'quantity' | 'product' | 'productId'>[]> => {
	const response = await api.get(`/admin${BASE_ROUTE}`)
	return response.data;
}

export const orderService = {
	getAllOrdersByProduct
}