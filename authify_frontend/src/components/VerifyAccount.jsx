import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { useLocation, useNavigate } from "react-router-dom"
import { verifyAccount } from "../services/auth";

const VerifyAccount = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;


    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [error, setError] = useState("")
    const [timeLeft, setTimeLeft] = useState(60)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!email) {
            toast.error("Invalid access. Please register first");
            navigate("/register");
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
            const nextInput = document.getElementById(`otp-${index + 1}`)
            nextInput?.focus()
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`)
            prevInput?.focus()
        }
    }

    const handleResend = () => {
        setTimeLeft(60)
        setError("")
        // Mock resend logic
        toast.success("OTP resent successfully!")
    }

    // handle otp verification form
    const handleSubmit = (event) => {
        event.preventDefault();

        const otpValue = otp.join("");
        if (otpValue.length !== 6) {
            setError("Please enter all 6 digits");
            return;
        }
        setIsLoading(true);

        verifyAccount(email, otpValue).then((response) => {
            console.log("Response", response);
            toast.success("Account verified successfully!");
            navigate("/login");
        }).catch((error) => {
            console.error("Verification error: ", error);
            setError(error.response?.data || error.response?.data?.message || "Failed to verify account. Please try again.");
        }).finally(() => {
            setIsLoading(false)
        })
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 sm:mx-6 md:max-w-lg px-4 shadow-xl">
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
                    <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">Verify your email</h2>
                    <div className="text-center mb-6 mt-4">
                        <p className="text-gray-600">We've sent a 6-digit verification code to</p>
                        <p className="font-medium text-gray-900">{email}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Enter verification code</label>
                        <div className="flex justify-center space-x-2 sm:space-x-1">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    autoComplete="off"
                                    className="w-14 h-14 sm:w-12 sm:h-12 text-center text-lg font-medium border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            ))}
                        </div>
                    </div>

                    {error && <div className="text-red-600 text-sm text-center">{error}</div>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors cursor-pointer"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="w-5 h-5 animate-[spin_1s_infinite] rounded-[50%] border-t-indigo-600 border-2 border-solid border-white mr-2.5"></div>
                                Verifying...
                            </div>
                        ) : (
                            "Verify Email"
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

export default VerifyAccount