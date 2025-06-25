
const STORAGE_KEYS = {
	CART: 'cart',
	USER_SESSION: 'user_session',
} as const;

type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

const setItem = <T>(key: StorageKey, value: T): void => {
	try {
		const serializedValue = JSON.stringify(value);
		localStorage.setItem(key, serializedValue);
	} catch (error) {
		console.error(`Erro ao armazenar ${key} no localStorage:`, error);
	}
};

const getItem = <T>(key: StorageKey, defaultValue?: T): T | null => {
	try {
		const item = localStorage.getItem(key);
		if (item === null) {
			return defaultValue ?? null;
		}
		return JSON.parse(item) as T;
	} catch (error) {
		console.error(`Erro ao recuperar ${key} do localStorage:`, error);
		return defaultValue ?? null;
	}
};

const removeItem = (key: StorageKey): void => {
	try {
		localStorage.removeItem(key);
	} catch (error) {
		console.error(`Erro ao remover ${key} do localStorage:`, error);
	}
};

const clear = (): void => {
	try {
		localStorage.clear();
	} catch (error) {
		console.error('Erro ao limpar localStorage:', error);
	}
};

const hasItem = (key: StorageKey): boolean => {
	return localStorage.getItem(key) !== null;
};

export const storageService = {
	setItem,
	getItem,
	removeItem,
	clear,
	hasItem,
};