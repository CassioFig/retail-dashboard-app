'use client'

import { LoginDialog } from "@/components";
import { UserSession } from "@/interfaces";
import { Cart } from "@/interfaces/cart";
import { storageService } from "@/services";
import { createContext, useEffect, useState } from "react";

interface SessionContextType {
	userSession: UserSession | null;
	setUserSession: (session: UserSession | null) => void;
	cart: Cart | null;
	setCart: (cart: Cart) => void;
	loginDialogOpen: boolean;
	handleLoginDialogOpen: (open: boolean, loginTab: 'signin' | 'signup') => void;
}

export const SessionContext = createContext<SessionContextType>({} as SessionContextType);

type Props = {
	children: React.ReactNode;
}
export const SessionProvider: React.FC<Props> = ({ children }) => {
	const [userSession, setUserSession] = useState<UserSession | null>(null);
	const [loginDialogOpen, setLoginDialogOpen] = useState(false);
	const [loginDefaultTab, setLoginDefaultTab] = useState<'signin' | 'signup'>('signin');
	const [cart, setCart] = useState<Cart | null>(null);

	const handleLoginDialogOpen = (open: boolean, loginTab: 'signin' | 'signup') => {
		setLoginDialogOpen(open);
		setLoginDefaultTab(loginTab);
	};

	useEffect(() => {
		const session = storageService.getItem<UserSession>('user_session');
		if (session) setUserSession(session);
		else setUserSession(null);

		const storedCart = storageService.getItem<Cart>('cart');
		if (storedCart) setCart(storedCart);
		else setCart(null);
	}, [])

	return (
		<SessionContext.Provider value={{ userSession, setUserSession, cart, setCart, loginDialogOpen, handleLoginDialogOpen }}>
			<>
				{children}
				<LoginDialog
					open={loginDialogOpen}
					onClose={() => setLoginDialogOpen(false)}
					defaultTab={loginDefaultTab}
				/>
			</>
		</SessionContext.Provider>
	);
};