import { UserSession } from "@/interfaces";
import { storageService } from "@/services";
import api from "@/services/api";

const BASE_ROUTE = '/auth'

type SignUpRequest = {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
}
const signUp = async (request: SignUpRequest): Promise<UserSession> => {
	const response = await api.post<UserSession>(`${BASE_ROUTE}/signup`, request);
	storageService.setItem('user_session', response.data);
	if (response.data.isAdmin) {
		window.location.href = '/admin';
	} else { window.location.reload(); }
	return response.data;
}

const signIn = async (email: string, password: string): Promise<UserSession> => {
	const response = await api.post<UserSession>(`${BASE_ROUTE}/signin`, { email, password });
	storageService.setItem('user_session', response.data);
	if (response.data.isAdmin) {
		window.location.href = '/admin';
	} else { window.location.reload(); }
	return response.data;
}

export const sessionServices = {
	signUp,
	signIn
}