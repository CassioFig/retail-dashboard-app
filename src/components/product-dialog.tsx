'use client'

import { cartServices, reviewServices } from "@/api"
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
	const { userSession, handleLoginDialogOpen, setCart } = useContext(SessionContext);
	const [showReviews, setShowReviews] = useState(false);
	const [reviews, setReviews] = useState<Review[]>([]);
	const [showAddReview, setShowAddReview] = useState(false);
	const [newReview, setNewReview] = useState({
		rating: 5,
		comment: ''
	});
	const [isSubmittingReview, setIsSubmittingReview] = useState(false);

	useEffect(() => {
		if (showReviews) {
			reviewServices.getReviews(props.product.id).then(setReviews);
		}
	}, [showReviews, props.product.id, reviews.length]);

	const handleAddToBag = (e: React.MouseEvent<HTMLButtonElement>, product: Product) => {
		e.preventDefault();
		if (!userSession) {
			props.onClose(false);
			handleLoginDialogOpen(true, 'signin');
		} else {
			cartServices
				.addToCart({ productId: product.id, quantity: 1, price: product.price })
				.then((result) => {
					setCart(result);
					props.onClose(false);
				});
		}
	}

	const handleSubmitReview = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!userSession) {
			handleLoginDialogOpen(true, 'signin');
			return;
		}

		setIsSubmittingReview(true);
		try {
			await reviewServices.addReview({
				productId: props.product.id,
				rating: newReview.rating,
				comment: newReview.comment.trim(),
			});
			setShowAddReview(false);
		} catch (error) {
			console.error('Error submitting review:', error);
		} finally {
			setIsSubmittingReview(false);
		}
	};

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
								className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8 cursor-pointer"
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
														<StarIconSolid
															key={rating}
															aria-hidden="true"
															className={classNames(
																(props.product.rating?.average || 0) > rating ? 'text-yellow-400' : 'text-gray-200',
																'size-5 shrink-0',
															)}
														/>
													))}
												</div>
												<p className="sr-only">{props.product?.rating?.average || 0} out of 5 stars</p>
												<button 
													onClick={() => setShowReviews(!showReviews)}
													className="ml-3 text-sm font-medium text-black hover:text-gray-700 focus:outline-none cursor-pointer"
												>
													{props.product.rating?.count || 0} reviews
												</button>
											</div>

											{/* Reviews Section */}
											{showReviews && (
												<div className="mt-6 border-t border-gray-200 pt-6">
													<div className="flex items-center justify-between mb-4">
														<h5 className="text-lg font-medium text-gray-900">Customer Reviews</h5>
														<button 
															onClick={() => setShowAddReview(!showAddReview)}
															className="text-sm font-medium text-black hover:text-gray-700 focus:outline-none cursor-pointer"
														>
															{showAddReview ? 'Cancel' : 'Write a Review'}
														</button>
													</div>

													{/* Add Review Form */}
													{showAddReview && (
														<div className="mb-6 p-4 bg-gray-50 rounded-lg">
															<form onSubmit={handleSubmitReview}>
																<div className="mb-4">
																	<label className="block text-sm font-medium text-gray-700 mb-2">
																		Rating
																	</label>
																	<div className="flex items-center space-x-1">
																		{[1, 2, 3, 4, 5].map((star) => (
																			<button
																				key={star}
																				type="button"
																				onClick={() => setNewReview({ ...newReview, rating: star })}
																				className="focus:outline-none cursor-pointer"
																			>
																				<StarIconSolid
																					className={classNames(
																						star <= newReview.rating ? 'text-yellow-400' : 'text-gray-200',
																						'h-6 w-6 hover:text-yellow-400 transition-colors'
																					)}
																				/>
																			</button>
																		))}
																		<span className="ml-2 text-sm text-gray-600">
																			{newReview.rating} star{newReview.rating !== 1 ? 's' : ''}
																		</span>
																	</div>
																</div>
																<div className="mb-4">
																	<label className="block text-sm font-medium text-gray-700 mb-2">
																		Comment
																	</label>
																	<textarea
																		value={newReview.comment}
																		onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
																		rows={4}
																		className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
																		placeholder="Share your thoughts about this product..."
																		required
																	/>
																</div>
																<div className="flex items-center space-x-3">
																	<button
																		type="submit"
																		disabled={isSubmittingReview || !newReview.comment.trim()}
																		onClick={handleSubmitReview}
																		className="px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
																	>
																		{isSubmittingReview ? 'Submitting...' : 'Submit Review'}
																	</button>
																	<button
																		type="button"
																		onClick={() => setShowAddReview(false)}
																		className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none cursor-pointer"
																	>
																		Cancel
																	</button>
																</div>
															</form>
														</div>
													)}

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
														className="mt-4 text-sm text-black hover:text-gray-700 focus:outline-none cursor-pointer"
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
												className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-black px-8 py-3 text-base font-medium text-white hover:cursor-pointer focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-hidden"
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