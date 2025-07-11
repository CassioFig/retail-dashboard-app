'use client'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { Fragment, useContext, useEffect } from "react";
import { XMarkIcon } from '@heroicons/react/24/outline';
import { SessionContext } from "@/contexts";
import { useApi } from "@/hooks";
import { Cart } from "@/interfaces/cart";
import { cartServices } from "@/api";
import { storageService } from "@/services";

type Props = {
	isOpen: boolean;
	onClose: () => void;
}
export const CartDrawer: React.FC<Props> = (props) => {
	const { cart, setCart } = useContext(SessionContext);

	const { execute: fetchCart } = useApi<Cart, void>({
		service: cartServices.getCart,
		onSuccess: (data) => {
			if (data) {
				setCart(data);
				storageService.setItem<Cart>('cart', data);
			}
		},
	})

	const handleRemoveFromCart = (productId: string) => {
		cartServices.deleteFromCard(productId)
			.then((result) => {
				setCart(result);
				storageService.setItem<Cart>('cart', result);
			});
	}

	const handleCheckout = () => {
		if (!!cart?.items && cart.items.length > 0) {
			cartServices.checkout(cart)
				.then((result) => {
					if (result) {
						setCart(result);
						storageService.setItem<Cart>('cart', result);
						props.onClose();
					}
				})
				.catch((error) => {
					console.error("Checkout failed:", error);
				});
		}
	}

	useEffect(() => { !!cart?.id && fetchCart(); }, [cart?.id]);

	return (
		<Fragment>
			<Dialog open={props.isOpen} onClose={props.onClose} className="relative z-10">
				<DialogBackdrop
					transition
					className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
				/>

				<div className="fixed inset-0 overflow-hidden">
					<div className="absolute inset-0 overflow-hidden">
						<div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
							<DialogPanel
								transition
								className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
							>
								<div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
									<div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
										<div className="flex items-start justify-between">
											<DialogTitle className="text-lg font-medium text-gray-900">Shopping cart</DialogTitle>
											<div className="ml-3 flex h-7 items-center">
												<button
													type="button"
													onClick={() => props.onClose()}
													className="relative -m-2 p-2 text-gray-400 hover:text-gray-500 cursor-pointer"
												>
													<span className="absolute -inset-0.5" />
													<span className="sr-only">Close panel</span>
													<XMarkIcon aria-hidden="true" className="size-6" />
												</button>
											</div>
										</div>

										<div className="mt-8">
											<div className="flow-root">
												<ul role="list" className="-my-6 divide-y divide-gray-200">
													{cart?.items?.map((cartItem, index) => (
														<li key={index} className="flex py-6">
															<div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
																<img alt={cartItem.product?.name} src={cartItem.product?.imgUrl} className="size-full object-cover" />
															</div>
															<div className="ml-4 flex flex-1 flex-col">
																<div>
																	<div className="flex justify-between text-base font-medium text-gray-900">
																		<h3>
																			<a href={"#"}>{cartItem.product?.name}</a>
																		</h3>
																		<p className="ml-4">${cartItem.product?.price}</p>
																	</div>
																	{/* <p className="mt-1 text-sm text-gray-500">{cartItem.color}</p> */}
																</div>
																<div className="flex flex-1 items-end justify-between text-sm">
																	<p className="text-gray-500">Qty {cartItem.quantity}</p>

																	<div className="flex">
																		<button 
																			type="button" 
																			className="font-medium text-black hover:text-gray-700 cursor-pointer"
																			onClick={() => handleRemoveFromCart(cartItem.productId)}
																		>
																			Remove
																		</button>
																	</div>
																</div>
															</div>
														</li>
													))}
												</ul>
											</div>
										</div>
									</div>

									<div className="border-t border-gray-200 px-4 py-6 sm:px-6">
										<div className="flex justify-between text-base font-medium text-gray-900">
											<p>Subtotal</p>
											<p>${cart?.totalAmount || 0}</p>
										</div>
										<p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
										<div className="mt-6">
											<button
												type="button"
												onClick={handleCheckout}
												className="flex items-center justify-center rounded-md border border-transparent bg-black px-6 py-3 text-base font-medium text-white shadow-xs hover:bg-gray-800 cursor-pointer"
											>
												Checkout
											</button>
										</div>
										<div className="mt-6 flex justify-center text-center text-sm text-gray-500">
											<p>
												or{' '}
												<button
													type="button"
													onClick={() => props.onClose()}
													className="font-medium text-black hover:text-gray-700 cursor-pointer"
												>
													Continue Shopping
													<span aria-hidden="true"> &rarr;</span>
												</button>
											</p>
										</div>
									</div>
								</div>
							</DialogPanel>
						</div>
					</div>
				</div>
			</Dialog>
		</Fragment>
	)
}