'use client'

import { useEffect, useState } from "react";

interface UseApiOptions<T, P = unknown> {
	service: (payload: P) => Promise<T>;
	payload?: P;
	immediate?: boolean;
	onSuccess?: (data: T) => void;
	onError?: (error: any) => void;
}
export const useApi = <T, P = unknown>({
	payload = {} as P,
	immediate = false,
	service,
	onSuccess,
	onError,
}: UseApiOptions<T, P>) => {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<any>(null);

	const execute = async (data?: P) => {
		try {
			setLoading(true);
			const response = await service(data || payload);
			setData(response);
			onSuccess?.(response);
		} catch (error) {
			// const err = error as { response: { data: { message: string } } };
			// setErrors(err.response.data.message);
			onError?.(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (immediate) execute();
	}, [immediate]);

	return { data, loading, errors, execute, setData };
}