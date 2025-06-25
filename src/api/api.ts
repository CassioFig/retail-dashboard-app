import { UserSession } from '@/interfaces';
import { storageService } from '@/services';
import axios from 'axios';

const api = axios.create({
	baseURL: 'http://localhost:4000',
})

api.interceptors.request.use((config) => {
	const userSession = storageService.getItem<UserSession>('user_session');
	config.headers['user-id'] = userSession?.id || null;
	return config;
});

export default api;