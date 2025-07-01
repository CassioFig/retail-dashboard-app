'use client'

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "react"
import { useInputManager } from "@/hooks/useInputManager"
import { sessionServices } from "@/api"

function classNames(...classes: any[]) {
	return classes.filter(Boolean).join(' ')
}

type Props = {
	open: boolean
	onClose: (open: boolean) => void
	defaultTab: 'signin' | 'signup'
}

type SignInData = {
	email: string
	password: string
}

type SignUpData = {
	firstName: string
	lastName: string
	email: string
	password: string
}

export const LoginDialog: React.FC<Props> = ({ open, onClose, defaultTab }) => {
	const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(defaultTab)

	const signInManager = useInputManager<SignInData>(
		{ email: '', password: '' },
		{
			email: {
				required: true,
				message: 'Email is required'
			},
			password: {
				required: true,
				message: 'Password is required',
			}
		}
	)

	const signUpManager = useInputManager<SignUpData>(
		{ firstName: '', lastName: '', email: '', password: '' },
		{
			firstName: {
				required: true,
				message: 'Name is required'
			},
			lastName: {
				required: true,
				message: 'Last name is required'
			},
			email: {
				required: true,
				message: 'Please enter a valid email'
			},
			password: {
				required: true,
				message: 'Password is required',
			}
		}
	)

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		
		const manager = activeTab === 'signin' ? signInManager : signUpManager
		
		if (manager.validateAll()) {
			if (activeTab === 'signin') sessionServices.signIn(signInManager.values.email, signInManager.values.password)
			else sessionServices.signUp({
				email: signUpManager.values.email,
				password: signUpManager.values.password,
				firstName: signUpManager.values.firstName,
				lastName: signUpManager.values.lastName
			})
		}
	}

	useEffect(() => {
		setActiveTab(defaultTab)
		signInManager.reset()
		signUpManager.reset()
	}, [defaultTab])

	useEffect(() => {
		if (!open) {
			signInManager.reset()
			signUpManager.reset()
		}
	}, [open])

	return (
		<Dialog open={open} onClose={onClose} className="relative z-10">
			<DialogBackdrop
				transition
				className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
			/>

			<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
				<div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
					<DialogPanel
						transition
						className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-md sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
					>
						<div className="absolute top-0 right-0 pt-4 pr-4">
							<button
								type="button"
								onClick={() => onClose(false)}
								className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 cursor-pointer"
							>
								<span className="sr-only">Close</span>
								<XMarkIcon aria-hidden="true" className="size-6" />
							</button>
						</div>

						<div className="sm:mx-auto sm:w-full sm:max-w-md">
							<div className="flex justify-center">
								<img
									alt="Your Company"
									src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=black&shade=900"
									className="h-10 w-auto"
								/>
							</div>

							{/* Tabs */}
							<div className="mt-6">
								<div className="border-b border-gray-200">
									<nav className="-mb-px flex space-x-8" aria-label="Tabs">
										<button
											onClick={() => setActiveTab('signin')}
											className={classNames(
												activeTab === 'signin'
													? 'border-black text-black'
													: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
												'whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium cursor-pointer'
											)}
										>
											Sign In
										</button>
										<button
											onClick={() => setActiveTab('signup')}
											className={classNames(
												activeTab === 'signup'
													? 'border-black text-black'
													: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
												'whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium cursor-pointer'
											)}
										>
											Sign Up
										</button>
									</nav>
								</div>
							</div>

							<div className="mt-6">
								{activeTab === 'signin' ? (
									<div>
										<h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">
											Sign in to your account
										</h2>
										<form onSubmit={handleSubmit} className="mt-6 space-y-6">
											<div>
												<label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
													Email address
												</label>
												<div className="mt-2">
													<input
														id="email"
														name="email"
														type="email"
														required
														autoComplete="email"
														value={signInManager.values.email}
														onChange={(e) => signInManager.handleChange('email', e.target.value)}
														onBlur={() => signInManager.handleBlur('email')}
														className={classNames(
															"block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
															signInManager.hasError('email')
																? 'ring-red-300 focus:ring-red-600'
																: 'ring-gray-300 focus:ring-black'
														)}
													/>
													{signInManager.hasError('email') && (
														<p className="mt-1 text-sm text-red-600">{signInManager.errors.email}</p>
													)}
												</div>
											</div>

											<div>
												<div className="flex items-center justify-between">
													<label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
														Password
													</label>
													<div className="text-sm">
														<a href="#" className="font-semibold text-black hover:text-gray-700 cursor-pointer">
															Forgot password?
														</a>
													</div>
												</div>
												<div className="mt-2">
													<input
														id="password"
														name="password"
														type="password"
														required
														autoComplete="current-password"
														value={signInManager.values.password}
														onChange={(e) => signInManager.handleChange('password', e.target.value)}
														onBlur={() => signInManager.handleBlur('password')}
														className={classNames(
															"block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
															signInManager.hasError('password')
																? 'ring-red-300 focus:ring-red-600'
																: 'ring-gray-300 focus:ring-black'
														)}
													/>
													{signInManager.hasError('password') && (
														<p className="mt-1 text-sm text-red-600">{signInManager.errors.password}</p>
													)}
												</div>
											</div>

											<div>
												<button
													type="submit"
													className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black cursor-pointer"
												>
													Sign in
												</button>
											</div>
										</form>
									</div>
								) : (
									<div>
										<h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">
											Create your account
										</h2>
										<form onSubmit={handleSubmit} className="mt-6 space-y-6">
											<div className="grid grid-cols-2 gap-x-3">
												<div>
													<label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900">
														First name
													</label>
													<div className="mt-2">
														<input
															id="firstName"
															name="firstName"
															type="text"
															required
															autoComplete="given-name"
															value={signUpManager.values.firstName}
															onChange={(e) => signUpManager.handleChange('firstName', e.target.value)}
															onBlur={() => signUpManager.handleBlur('firstName')}
															className={classNames(
																"block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
																signUpManager.hasError('firstName')
																	? 'ring-red-300 focus:ring-red-600'
																	: 'ring-gray-300 focus:ring-black'
															)}
														/>
														{signUpManager.hasError('firstName') && (
															<p className="mt-1 text-sm text-red-600">{signUpManager.errors.firstName}</p>
														)}
													</div>
												</div>

												<div>
													<label htmlFor="lastName" className="block text-sm font-medium leading-6 text-gray-900">
														Last name
													</label>
													<div className="mt-2">
														<input
															id="lastName"
															name="lastName"
															type="text"
															required
															autoComplete="family-name"
															value={signUpManager.values.lastName}
															onChange={(e) => signUpManager.handleChange('lastName', e.target.value)}
															onBlur={() => signUpManager.handleBlur('lastName')}
															className={classNames(
																"block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
																signUpManager.hasError('lastName')
																	? 'ring-red-300 focus:ring-red-600'
																	: 'ring-gray-300 focus:ring-black'
															)}
														/>
														{signUpManager.hasError('lastName') && (
															<p className="mt-1 text-sm text-red-600">{signUpManager.errors.lastName}</p>
														)}
													</div>
												</div>
											</div>

											<div>
												<label htmlFor="signup-email" className="block text-sm font-medium leading-6 text-gray-900">
													Email address
												</label>
												<div className="mt-2">
													<input
														id="signup-email"
														name="email"
														type="email"
														required
														autoComplete="email"
														value={signUpManager.values.email}
														onChange={(e) => signUpManager.handleChange('email', e.target.value)}
														onBlur={() => signUpManager.handleBlur('email')}
														className={classNames(
															"block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
															signUpManager.hasError('email')
																? 'ring-red-300 focus:ring-red-600'
																: 'ring-gray-300 focus:ring-black'
														)}
													/>
													{signUpManager.hasError('email') && (
														<p className="mt-1 text-sm text-red-600">{signUpManager.errors.email}</p>
													)}
												</div>
											</div>

											<div>
												<label htmlFor="signup-password" className="block text-sm font-medium leading-6 text-gray-900">
													Password
												</label>
												<div className="mt-2">
													<input
														id="signup-password"
														name="password"
														type="password"
														required
														autoComplete="new-password"
														value={signUpManager.values.password}
														onChange={(e) => signUpManager.handleChange('password', e.target.value)}
														onBlur={() => signUpManager.handleBlur('password')}
														className={classNames(
															"block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
															signUpManager.hasError('password')
																? 'ring-red-300 focus:ring-red-600'
																: 'ring-gray-300 focus:ring-black'
														)}
													/>
													{signUpManager.hasError('password') && (
														<p className="mt-1 text-sm text-red-600">{signUpManager.errors.password}</p>
													)}
												</div>
											</div>

											<div>
												<button
													type="submit"
													className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black cursor-pointer"
												>
													Sign up
												</button>
											</div>
										</form>
									</div>
								)}
							</div>
						</div>
					</DialogPanel>
				</div>
			</div>
		</Dialog>
	)
}
