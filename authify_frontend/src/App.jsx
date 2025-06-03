import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyAccount from "./components/VerifyAccount";
import { Toaster } from "react-hot-toast";
import ForgotPassword from "./components/ForgotPassword";
import ResetPasswordOTP from "./components/ResetPasswordOTP";
import NewPassword from "./components/NewPassword.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

function App() {
    return (
        <div className="app-container">
            <Toaster position="top-right" reverseOrder={false} />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify-account" element={<VerifyAccount />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/forgot-otp" element={<ResetPasswordOTP />} />
                <Route path="/new-password" element={<NewPassword />} />

                <Route path="/user" element={<UserProfile />} />
                <Route path="/admin" element={<AdminDashboard />} />


            </Routes>
        </div>
    );
}

export default App;