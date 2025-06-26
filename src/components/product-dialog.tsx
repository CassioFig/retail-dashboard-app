'use client'

import { SessionContext } from "@/contexts"
import { Product, Review } from "@/interfaces"
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react"
import { StarIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid"
import { useContext, useEffect, useState } from "react"

function classNames(...classes: any[]) {
	return classes.filter(Boolean).join(' ')
}

type Props = {
	product: Product
	open: boolean
	onClose: (open: boolean) => void
}

export const ProductDialog: React.FC<Props> = (props) => {
	const [show, setShow] = useState(props.open);
	const [showReviews, setShowReviews] = useState(false);
	const [reviews, setReviews] = useState<Review[]>([]);
	const { userSession, handleLoginDialogOpen } = useContext(SessionContext);

	const handleAddToBag = (e: React.MouseEvent<HTMLButtonElement>, product: Product) => {
		e.preventDefault();
		if (!userSession) {
			props.onClose(false);
			handleLoginDialogOpen(true, 'signin');
		}
	}

	return (
		<Dialog open={props.open} onClose={props.onClose} className="relative z-10">
			<DialogBackdrop
				transition
				className="fixed inset-0 hidden bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in md:block"
			/>

			<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
				<div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
					<DialogPanel
						transition
						className="flex w-full transform text-left text-base transition data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in md:my-8 md:max-w-2xl md:px-4 data-closed:md:translate-y-0 data-closed:md:scale-95 lg:max-w-4xl"
					>
						<div className="relative flex w-full items-center overflow-hidden bg-white px-4 pt-14 pb-8 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
							<button
								type="button"
								onClick={() => props.onClose(false)}
								className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8"
							>
								<span className="sr-only">Close</span>
								<XMarkIcon aria-hidden="true" className="size-6" />
							</button>

							<div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
								<img
									alt={props.product.name}
									src={props.product.imgUrl}
									className="aspect-2/3 w-full rounded-lg bg-gray-100 object-cover sm:col-span-4 lg:col-span-5"
								/>
								<div className="sm:col-span-8 lg:col-span-7">
									<h2 className="text-2xl font-bold text-gray-900 sm:pr-12">{props.product.name}</h2>

									<section aria-labelledby="information-heading" className="mt-2">
										<h3 id="information-heading" className="sr-only">
											Product information
										</h3>

										<p className="text-2xl text-gray-900">${props.product.price}</p>

										{/* Reviews */}
										<div className="mt-6">
											<h4 className="sr-only">Reviews</h4>
											<div className="flex items-center">
												<div className="flex items-center">
													{[0, 1, 2, 3, 4].map((rating) => (
														<StarIcon
															key={rating}
															aria-hidden="true"
															className={classNames(
																(props.product.rating?.average || 0) > rating ? 'text-gray-900' : 'text-gray-200',
																'size-5 shrink-0',
															)}
														/>
													))}
												</div>
												<p className="sr-only">{props.product?.rating?.average || 0} out of 5 stars</p>
												<button 
													onClick={() => setShowReviews(!showReviews)}
													className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
												>
													{props.product.rating?.count || 0} reviews
												</button>
											</div>

											{/* Reviews Section */}
											{showReviews && (
												<div className="mt-6 border-t border-gray-200 pt-6">
													<h5 className="text-lg font-medium text-gray-900 mb-4">Customer Reviews</h5>
													<div className="space-y-4 max-h-64 overflow-y-auto">
														{reviews.map((review) => (
															<div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
																<div className="flex items-start justify-between">
																	<div className="flex-1">
																		<div className="flex items-center space-x-2">
																			<h6 className="text-sm font-medium text-gray-900">{review.user.firstName} {review.user.lastName}</h6>
																		</div>
																		<div className="flex items-center mt-1">
																			<div className="flex items-center">
																				{[0, 1, 2, 3, 4].map((rating) => (
																					<StarIconSolid
																						key={rating}
																						className={classNames(
																							review.rating > rating ? 'text-yellow-400' : 'text-gray-200',
																							'h-4 w-4'
																						)}
																					/>
																				))}
																			</div>
																			<span className="ml-2 text-xs text-gray-500">
																				{new Date(review.createdAt).toLocaleDateString('en-US')}
																			</span>
																		</div>
																		<p className="mt-2 text-sm text-gray-700">{review.comment}</p>
																	</div>
																</div>
															</div>
														))}
													</div>
													<button 
														onClick={() => setShowReviews(false)}
														className="mt-4 text-sm text-indigo-600 hover:text-indigo-500 focus:outline-none"
													>
														Hide reviews
													</button>
												</div>
											)}
										</div>

										{/* Product Description */}
										<div className="mt-6">
											<h4 className="text-sm font-medium text-gray-900">Description</h4>
											<div className="mt-3 space-y-6 text-sm text-gray-700">
												<p>{props.product.description}</p>
											</div>
										</div>
									</section>

									<section aria-labelledby="options-heading" className="mt-10">
										<form>
											<button
												type="submit"
												onClick={(e) => handleAddToBag(e, props.product)}
												className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-black px-8 py-3 text-base font-medium text-white hover:cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
											>
												Add to bag
											</button>
										</form>
									</section>
								</div>
							</div>
						</div>
					</DialogPanel>
				</div>
			</div>
		</Dialog>
	)
}