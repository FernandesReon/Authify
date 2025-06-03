import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { useLocation, useNavigate } from "react-router-dom"
import { verifyResetOtp } from "../services/auth"
import { ShieldCheck } from "lucide-react"

const ResetPasswordOTP = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state?.email;

    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [error, setError] = useState("")
    const [timeLeft, setTimeLeft] = useState(60)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!email) {
            toast.error("Invalid access.")
            navigate("/login");
        }
    }, [email, navigate])

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`forgot-otp-${index + 1}`)
            nextInput?.focus()
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`forgot-otp-${index - 1}`)
            prevInput?.focus()
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const otpValue = otp.join("")

        if (otpValue.length !== 6) {
            setError("Please enter all 6 digits")
            return
        }
        setIsLoading(true)

        verifyResetOtp(email, otpValue).then(() => {
            toast.success("OTP verified successfully!");
            navigate("/new-password", { state: { email, otp: otpValue } });
        }).catch((error) => {
            console.error("Error verifying OTP:", error);
            setError(error.response.data.message || "Invalid or expired OTP. Please try again.");
        }).finally(() => {
            setIsLoading(false);
        })
    }

    const handleResend = () => {
        setTimeLeft(60)
        setError("")
        setOtp(["", "", "", "", "", ""])
        // Mock resend logic
        alert("Verification code resent successfully!")
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 sm:mx-6 md:mx-auto shadow-lg">

                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="flex justify-center">
                        <button
                            className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-500"
                        >
                            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">A</span>
                            </div>
                            <span className="text-xl font-bold">Authify</span>
                        </button>
                    </div>
                    <h2 className="mt-4 text-center text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6">Verify code</h2>
                </div>

                <div className="text-center mb-6">
                    <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck className="h-8 w-8 text-indigo-600"/>
                    </div>
                    <p className="text-gray-600 mb-2">Check your email</p>
                    <p className="text-sm text-gray-500 mb-1">We've sent a 6-digit verification code to</p>
                    <p className="font-medium text-gray-900">{email}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Enter verification code</label>
                        <div className="flex justify-center space-x-2 sm:space-x-3">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`forgot-otp-${index}`}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-12 text-center text-lg font-medium border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            ))}
                        </div>
                    </div>

                    {error && <div className="text-red-600 text-sm text-center">{error}</div>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 text-white text-sm py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors cursor-pointer"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="w-5 h-5 animate-[spin_1s_infinite] rounded-[50%] border-t-indigo-600 border-2 border-solid border-white mr-2.5"></div>
                                Verification in progress...
                            </div>
                        ) : (
                            "Verify code"
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    {timeLeft > 0 ? (
                        <p className="text-sm text-gray-600">Resend code in {timeLeft}s</p>
                    ) : (
                        <button onClick={handleResend} className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
                            Resend verification code
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ResetPasswordOTP
