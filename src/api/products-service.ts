import { Product } from "@/interfaces";
import api from "../services/api";

const BASE_ROUTE = '/products';

const getProducts = async (): Promise<Product[]> => {
	const response = await api.get<Product[]>(BASE_ROUTE);
	return response.data;
}

export const productsService = {
	getProducts,
}