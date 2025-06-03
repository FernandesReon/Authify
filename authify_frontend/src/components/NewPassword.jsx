"use client"

import { CheckCircle2, Eye, EyeOff } from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useLocation, useNavigate } from "react-router-dom"
import { resetPasswordWithOtp } from "../services/auth"

const NewPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { email, otp } = location.state || {};

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!email || !otp) {
            toast.error("Invalid access.");
            navigate("/login");
        }
    }, [email, otp, navigate]);


    const handleSubmit = (event) => {
        event.preventDefault()

        if (!password || !confirmPassword) {
            setError("Please fill in all fields")
            return
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long")
            return
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        // Check password strength
        const hasUpperCase = /[A-Z]/.test(password)
        const hasLowerCase = /[a-z]/.test(password)
        const hasNumbers = /\d/.test(password)

        if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
            setError("Password must contain uppercase, lowercase, and numbers")
            return
        }

        setIsLoading(true);

        resetPasswordWithOtp(email, otp, password).then(() =>{
            toast.success("Password reset successfully!");
            setPassword("");
            setConfirmPassword("");
            navigate("/login");
        }).catch((error) => {
            console.error("Error resetting password: ", error);
            setError(error.response.data.message || "Failed to reset password. Please try again.")
        }).finally(() => {
            setIsLoading(false);
        })

    }

    const getPasswordStrength = () => {
        if (!password) return { strength: 0, label: "", color: "" }

        let score = 0
        if (password.length >= 8) score++
        if (/[A-Z]/.test(password)) score++
        if (/[a-z]/.test(password)) score++
        if (/\d/.test(password)) score++
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++

        if (score <= 2) return { strength: score * 20, label: "Weak", color: "bg-red-500" }
        if (score <= 3) return { strength: score * 20, label: "Fair", color: "bg-yellow-500" }
        if (score <= 4) return { strength: score * 20, label: "Good", color: "bg-indigo-500" }
        return { strength: 100, label: "Strong", color: "bg-green-500" }
    }

    const passwordStrength = getPasswordStrength()

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 sm:p-8 max-w-md w-full mx-4 shadow-lg">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Set New Password</h2>
                </div>

                <div className="text-center mb-4 sm:mb-6">
                    <div className="h-12 w-12 sm:h-16 sm:w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                        <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                    </div>
                    <p className="text-gray-600 mb-0.5 sm:mb-1">Almost done!</p>
                    <p className="text-xs sm:text-sm text-gray-500">
                        Create a new password for <span className="font-medium text-gray-900">{ }</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 sm:py-2.5 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Enter new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-400" />
                                ) : (
                                    <Eye className="h-4 w-4 text-gray-400" />
                                )}
                            </button>
                        </div>
                        {password && (
                            <div className="mt-2">
                                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                    <span>Password strength</span>
                                    <span
                                        className={`font-medium ${passwordStrength.strength >= 80 ? "text-green-600" : passwordStrength.strength >= 60 ? "text-indigo  -600" : passwordStrength.strength >= 40 ? "text-yellow-600" : "text-red-600"}`}
                                    >
                                        {passwordStrength.label}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                        className={`h-1.5 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                        style={{ width: `${passwordStrength.strength}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3 py-2 sm:py-2.5 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Confirm new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-400" />
                                ) : (
                                    <Eye className="h-4 w-4 text-gray-400" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="text-xs text-gray-500 space-y-1">
                        <p>Password must contain:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                            <li className={password.length >= 8 ? "text-green-600" : ""}>At least 8 characters</li>
                            <li className={/[A-Z]/.test(password) ? "text-green-600" : ""}>One uppercase letter</li>
                            <li className={/[a-z]/.test(password) ? "text-green-600" : ""}>One lowercase letter</li>
                            <li className={/\d/.test(password) ? "text-green-600" : ""}>One number</li>
                        </ul>
                    </div>

                    {error && <div className="text-red-600 text-sm">{error}</div>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors cursor-pointer"
                    >
                        {isLoading ?
                            <>
                                <div className="w-5 h-5 animate-[spin_1s_infinite] rounded-[50%] border-t-indigo-600 border-2 border-solid border-white mr-2.5"></div>
                                Resetting Password...

                            </> : "Reset Password"
                        }
                    </button>
                </form>
            </div>
        </div>
    )
}

export default NewPassword
