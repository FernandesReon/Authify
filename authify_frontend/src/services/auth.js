import { axiosInstance } from "./api";

// User Registration
export const registerUser = async (userData) => {
    try {
        const response = await axiosInstance.post('/register', userData);
        return response.data;
    } catch (error) {
        console.error('Unexcepted error');
        throw error;

    }
}

// Verify User
export const verifyAccount = async (email, otp) => {
    try {
        const response = await axiosInstance.post('/verify-account', { otp }, { params: { email } });
        return response.data;
    } catch (error) {
        console.error('Unexcepted error');
        throw error;

    }
}

// Authenticate User
export const loginUser = async (credentials) => {
    try {
        const response = await axiosInstance.post('/login', credentials);
        return response.data;
    } catch (error) {
        console.error('Unexcepted error');
        throw error;
    }
};

// reset password
export const resetPassword = async (email) => {
    try {
        await axiosInstance.post('/send-reset-otp', null, { params: { email } });
        return true;
    } catch (error) {
        console.error('Unexcepted error');
        throw error;
    }
}

export const verifyResetOtp = async (email, otp) => {
    try {
        await axiosInstance.post("/verify-reset-otp", { email, otp });
        return true;
    } catch (error) {
        console.error("Error verifying OTP");
        throw error;
    }
}

// verify reset password otp
export const resetPasswordWithOtp = async (email, otp, newPassword) => {
    try {
        await axiosInstance.post("/reset-password", { email, otp, newPassword });
        return true;
    } catch (error) {
        console.error("Error resetting password");
        throw error;
    }
}

// Fetch user details
export const getUserDetails = async () => {
    try {
        const response = await axiosInstance.get("/profile");
        return response.data;
    } catch (error) {
        console.error('Unexpected error fetching user details:', error);
        throw error;
    }
}