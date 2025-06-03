import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { registerUser } from "../services/auth"
import toast from "react-hot-toast"
import { ChevronLeft } from "lucide-react"

const RegisterPage = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const [isLoading, setIsLoading] = useState("")

    const [error, setError] = useState({
        errors: {},
        isError: false
    })

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: value })
        setError({errors: {},isError: false})
    }

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        setIsLoading(true)

        if (!isValidEmail(formData.email)) {
            setError({
                errors: { email: "Invalid email format." },
                isError: true,
            });
            setIsLoading(false);
            return;
        }

        if (formData.password != formData.confirmPassword) {
            setError({
                errors: { confirmPassword: "Passwords don't match." },
                isError: true,
            });

            setIsLoading(false)
            return
        }


        registerUser(formData).then((response) => {
            console.log('Response', response)
            toast.success("Verification OTP sended.")
            
            navigate("/verify-account", { state: { email: formData.email }})
            
            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: ""
            })
        }).catch((error) => {
            console.error('Error', error)
            setError({
                errors: error,
                isError: true
            })
        }).finally(() => {
            setIsLoading(false)
        })
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-6 px-2 sm:px-4 lg:px-6">
            {/* Back to home link */}
            <div className="mb-2.5 text-center">
                <button
                    onClick={() => navigate("/")}
                    className="text-sm text-gray-600 hover:text-gray-500 flex items-center justify-center space-x-1"
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Back to home</span>
                </button>
            </div>
            {/* Header */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-500"
                    >
                        <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">A</span>
                        </div>
                        <span className="text-xl font-bold">Authify</span>
                    </button>
                </div>
                <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">Create your account</h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Or{" "}
                    <Link to={"/login"} className="font-medium text-indigo-600 hover:text-indigo-500">
                        sign in to your existing account
                    </Link>
                </p>
            </div>

            {/* Form */}
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <div className="mt-1">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`appearance-none block w-full px-3 py-3 border ${error.errors?.response?.data?.name ? 'border-2 border-red-600' : 'border-gray-300'} rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                    placeholder="Alone Hacker"
                                />
                                {error.errors?.response?.data?.name && <p className="text-red-600 text-sm mt-1">{error.errors.response.data.name}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`appearance-none block w-full px-3 py-3 border ${error.errors?.response?.data?.message ? 'border-2 border-red-500' : 'border-gray-300'} rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                    placeholder="name@example.com"
                                />
                                {error.errors?.response?.data?.message && <p className="text-red-600 text-sm mt-1">{error.errors.response.data.message}</p>}
                                {error.errors?.email && <p className="text-red-600 text-sm mt-1">{error.errors.email}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`appearance-none block w-full px-3 py-3 border ${error.errors?.response?.data?.password ? 'border-2 border-red-500' : 'border-gray-300'} rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                    placeholder="Create a password"
                                />
                                {error.errors?.response?.data?.password && <p className="text-red-600 text-sm mt-1">{error.errors.response.data.password}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`appearance-none block w-full px-3 py-3 border ${error.errors?.confirmPassword ? 'border-2 border-red-500' : 'border-gray-300'} rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                    placeholder="Confirm your password"
                                />
                                {error.errors?.confirmPassword && <p className="text-red-600 text-sm mt-1">{error.errors.confirmPassword}</p>}
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors cursor-pointer"
                            >
                                {isLoading ?
                                    <>
                                        <div className="w-5 h-5 animate-[spin_1s_infinite] rounded-[50%] border-t-indigo-600 border-2 border-solid border-white mr-2.5"></div>
                                        Creating account..

                                    </> : "Create account"}
                            </button>
                        </div>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                                >
                                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                        <path
                                            fill="#4285F4"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    Continue with Google
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Terms */}
                    <div className="mt-6">
                        <p className="text-xs text-gray-500 text-center">
                            By creating an account, you agree to our{" "}
                            <a href="#" className="text-indigo-600 hover:text-indigo-500">
                                Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="#" className="text-indigo-600 hover:text-indigo-500">
                                Privacy Policy
                            </a>
                        </p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default RegisterPage