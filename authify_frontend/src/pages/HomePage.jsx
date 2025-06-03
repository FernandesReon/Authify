"use client"

import { ChartColumn, CheckCircle2, User } from "lucide-react"
import Navbar from "../components/Navbar"

const HomePage = () => {
    const isLoggedIn = false


    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
                <div className="text-center">
                    {isLoggedIn ? (
                        <div className=" h-[calc(100vh_-_64px)] flex flex-col items-center justify-center">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
                                Welcome <span className="text-indigo-600">Reon Fernandes</span>
                            </h1>
                            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl px-4">
                                Great to see you back! Your account is active and ready to use.
                            </p>
                            <div className="mt-8 max-w-md mx-auto md:mt-10 px-4">
                                <div className="rounded-md shadow">
                                    <button
                                        className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                        Go to Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
                                Welcome to <span className="text-indigo-600">Authify</span>
                            </h1>
                            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl px-4">
                                Experience seamless authentication with our secure and user-friendly platform. Register, verify, and
                                access your personalized dashboard.
                            </p>
                            <div className="mt-8 max-w-md mx-auto sm:flex sm:justify-center md:mt-10 px-4">
                                <div className="rounded-md shadow mb-3 sm:mb-0">
                                    <button
                                        className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-8 transition-colors"
                                    >
                                        Get Started
                                    </button>
                                </div>
                                <div className="rounded-md shadow sm:ml-3">
                                    <button
                                        className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-8 transition-colors"
                                    >
                                        Sign In
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Features Section - Only show for non-logged-in users */}
            {!isLoggedIn && (
                <div className="py-12 bg-white">
                    <div className="max-w-7xl mx-auto px-4 mb-5 sm:px-6 lg:px-8">
                        <div className="lg:text-center">
                            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
                            <p className="mt-2 text-2xl sm:text-3xl leading-8 font-extrabold tracking-tight text-gray-900">
                                Secure Authentication Flow
                            </p>
                        </div>

                        <div className="mt-10">
                            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                                <div className="text-center px-4">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                                        <User />
                                    </div>
                                    <h3 className="mt-4 text-lg leading-6 font-medium text-gray-900">User Registration</h3>
                                    <p className="mt-2 text-base text-gray-500">
                                        Simple and secure user registration with email verification.
                                    </p>
                                </div>

                                <div className="text-center px-4">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                                        <CheckCircle2 />
                                    </div>
                                    <h3 className="mt-4 text-lg leading-6 font-medium text-gray-900">OTP Verification</h3>
                                    <p className="mt-2 text-base text-gray-500">
                                        Two-factor authentication with OTP verification for enhanced security.
                                    </p>
                                </div>

                                <div className="text-center px-4">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                                        <ChartColumn />
                                    </div>
                                    <h3 className="mt-4 text-lg leading-6 font-medium text-gray-900">Admin Dashboard</h3>
                                    <p className="mt-2 text-base text-gray-500">
                                        Comprehensive admin panel with user management and analytics.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default HomePage
