import { Review } from "@/interfaces";
import api from "@/services/api";

const BASE_ROUTE = '/reviews';

const addReview = async (request: Pick<Review, 'productId' | 'rating' | 'comment'>): Promise<Review> => {
	const response = await api.post(BASE_ROUTE, request);
	return response.data;
}

const getReviews = async (productId: string): Promise<Review[]> => {
	const response = await api.get<Review[]>(`${BASE_ROUTE}/product/${productId}`);
	return response.data;
};

export const reviewServices = {
	addReview,
	getReviews
}