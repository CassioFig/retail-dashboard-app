import { UserSession } from "./user-session";

export interface Review {
	id: string;
	userId: string;
	productId: string;
	rating: number;
	comment: string;
	createdAt: Date;
	user: UserSession;
}