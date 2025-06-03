import { ChevronLeft, KeyRound, X } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { resetPassword } from "../services/auth"
import toast from "react-hot-toast"

const ForgotPassword = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (event) => {
        setEmail(event.target.value);
        setError("")
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        // client side error handling.
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setError("Please enter your email address")
            return
        }

        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return;
        }
        setIsLoading(true)

        resetPassword(email).then(() => {
            toast.success("OTP sent successfully!");
            setEmail("");
            navigate("/forgot-otp", { state: { email: email }})

        }).catch((error) => {
            console.error('Error:', error);
            setError(error.response.data.message || "Failed to send OTP. Please try again.");
        }).finally(() => {
            setIsLoading(false);
        });
    }


    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 sm:p-8 max-w-md w-full mx-4 shadow-lg">

                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="flex justify-center">
                        <button
                            className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-500 mb-6"
                        >
                            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">A</span>
                            </div>
                            <span className="text-xl font-bold">Authify</span>
                        </button>
                    </div>
                    <div className="text-center mb-4 sm:mb-6">
                        <div className="h-12 w-12 sm:h-16 sm:w-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                            <KeyRound className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
                        </div>
                        <p className="text-gray-600 mb-2">Forgot your password?</p>
                        <p className="text-sm text-gray-500">
                            Enter your email address and we'll send you a verification code to reset your password.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={handleChange}
                            className={`w-full px-3 py-3 border ${error ? 'border-2 border-red-600' : 'border-gray-300'}  rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                            placeholder="Enter your email address"
                        />
                        {error && <div className="text-red-600 text-sm">{error}</div>}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 text-white text-sm py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors cursor-pointer"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="w-5 h-5 animate-[spin_1s_infinite] rounded-[50%] border-t-indigo-600 border-2 border-solid border-white mr-2.5"></div>
                                Sending code...
                            </div>
                        ) : (
                            "Send Verification code"
                        )}
                    </button>
                </form>

                <div className="mt-4 sm:mt-6 text-center">
                    <button
                        onClick={() => navigate("/login")}
                        className="text-sm text-indigo-600 hover:text-indigo-500 font-medium flex items-center justify-center w-full">
                        <ChevronLeft size={20} /> Back to Login
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword