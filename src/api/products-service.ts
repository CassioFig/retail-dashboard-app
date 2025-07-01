import { Product } from "@/interfaces";
import api from "../services/api";

const BASE_ROUTE = '/products';

const getProducts = async (): Promise<Product[]> => {
	const response = await api.get<Product[]>(BASE_ROUTE);
	return response.data;
}

const addProductToStock = async (input: Pick<Product, 'id' | 'stock'>): Promise<void> => {
	await api.post(`/admin${BASE_ROUTE}`, input);
}

export const productsService = {
	getProducts,
	addProductToStock,
}