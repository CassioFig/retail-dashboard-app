'use client'

import { CartDrawer, LoginDialog } from '@/components'
import { SessionContext } from '@/contexts'
import { UserSession } from '@/interfaces'
import { storageService } from '@/services'
import { MagnifyingGlassIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import { Fragment, useContext, useEffect, useState } from 'react'

export const Header: React.FC = () => {
	const { cart, userSession, handleLoginDialogOpen } = useContext(SessionContext);
	const [open, setOpen] = useState(false);

	return (
		<Fragment>
			<header className="relative bg-white">
				<nav aria-label="Top" className="mx-auto max-w-auto px-4 sm:px-6 lg:px-8">
					<div className="border-b border-gray-200">
						<div className="flex h-16 items-center">
							{/* Logo */}
							<div className="ml-4 flex lg:ml-0">
								<a href="#" className="cursor-pointer">
									<span className="sr-only">Your Company</span>
									<img
										alt=""
										src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=black&shade=900"
										className="h-8 w-auto"
									/>
								</a>
							</div>

							<div className="ml-auto flex items-center">
								{!userSession && (
									<div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
										<button
											onClick={e => handleLoginDialogOpen(true, 'signin')}
											className="text-sm font-medium text-gray-700 hover:text-gray-800 cursor-pointer"
										>
											Sign in
										</button>
										<span aria-hidden="true" className="h-6 w-px bg-gray-200" />
										<button
											onClick={e => handleLoginDialogOpen(true, 'signup')}
											className="text-sm font-medium text-gray-700 hover:text-gray-800 cursor-pointer"
										>
											Create account
										</button>
									</div>
								)}

								<div className="hidden lg:ml-8 lg:flex">
									<a href="#" className="flex items-center text-gray-700 hover:text-gray-800 cursor-pointer">
										<img
											alt=""
											src="https://tailwindcss.com/plus-assets/img/flags/flag-canada.svg"
											className="block h-auto w-5 shrink-0"
										/>
										<span className="ml-3 block text-sm font-medium">CAD</span>
										<span className="sr-only">, change currency</span>
									</a>
								</div>

								{/* Search */}
								<div className="flex lg:ml-6">
									<a href="#" className="p-2 text-gray-400 hover:text-gray-500 cursor-pointer">
										<span className="sr-only">Search</span>
										<MagnifyingGlassIcon aria-hidden="true" className="size-6" />
									</a>
								</div>

								{/* Cart */}
								{
									userSession ? (
										<div className="ml-4 flow-root lg:ml-6">
											<a
												href="#"
												onClick={() => setOpen(true)}
												className="group -m-2 flex items-center p-2 cursor-pointer"
											>
												<ShoppingBagIcon aria-hidden="true" className="size-6 text-gray-400 group-hover:text-gray-500" />
												<span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
													{cart?.totalItemCount || 0}
												</span>
											</a>
										</div>
									) : null
								}
							</div>
							{userSession && (
								<div className="ml-4 flex lg:ml-6">
									<button
										onClick={() => {
											storageService.removeItem('user_session');
											window.location.reload();
										}}
										className="p-2 text-gray-400 hover:text-gray-500 cursor-pointer"
									>
										<span className="sr-only">Logout</span>
										<svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
										</svg>
									</button>
								</div>
							)}
						</div>
					</div>
				</nav>
			</header>
			<CartDrawer
				isOpen={open}
				onClose={() => setOpen(false)}
			/>
		</Fragment>
	)
}