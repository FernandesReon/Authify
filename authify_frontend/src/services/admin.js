import { adminInstance } from "../services/api";

// Fetch all users with pagination
export const fetchAllUsers = async (page, size) => {
    try {
        const response = await adminInstance.get("/users", { params: { page: page - 1, size } });
        return response.data;
    } catch (error) {
        console.error("Error while fetching list of users: ", error);
        throw error;
    }
};

// Search user by email
export const fetchUserByEmail = async (email) => {
    try {
        const response = await adminInstance.get(`/email/${email}`);
        return response.data;
    } catch (error) {
        console.error("Error while fetching user: ", error);
        throw error;
    }
};

// Promote user to admin
export const promoteToAdmin = async (userId) => {
    try {
        const response = await adminInstance.post(`/admin/${userId}/promote-to-admin`);
        return response.data;
    } catch (error) {
        console.error("Error, while promoting user to admin", error);
        throw error;
    }
};