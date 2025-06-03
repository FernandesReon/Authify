import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import { fetchAllUsers, promoteToAdmin } from "../services/admin";

const AdminDashboard = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [users, setUsers] = useState([]); // State for fetched users
    const [totalPages, setTotalPages] = useState(1); // State for total pages
    const [loading, setLoading] = useState(false); // Loading state
    const [openActionDropdown, setOpenActionDropdown] = useState(null);

    // Fetch users when page changes
    useEffect(() => {
        const loadUsers = async () => {
            setLoading(true);
            try {
                const data = await fetchAllUsers(currentPage, usersPerPage);
                setUsers(data.content); // Set users from response
                setTotalPages(data.totalPages); // Set total pages from response
            } catch (error) {
                console.error('Error: ', error)

                toast.error("Failed to fetch users");
            } finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, [currentPage, usersPerPage]);

    // Filter users based on search term (client-side for simplicity)
    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleActionClick = async (userId, action) => {
        setOpenActionDropdown(null);
        try {
            switch (action) {
                case "promote":
                    await promoteToAdmin(userId);
                    toast.success(`Promoted user ${userId} to admin`);
                    // Refresh users after promotion
                    const data = await fetchAllUsers(currentPage, usersPerPage);
                    setUsers(data.content);
                    setTotalPages(data.totalPages);
                    break;
                case "edit":
                    toast.success(`Editing user ${userId}`);
                    break;
                case "delete":
                    toast.error(`Deleting user ${userId}`);
                    break;
                case "deactivate":
                    toast.error(`Deactivating user ${userId}`);
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error('Error: ', error)
            toast.error("Action failed");
        }
    };

    return (
        <div className="app-con">
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="py-6 mt-16">
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2 sm:mb-0">User Management</h3>
                                    <div className="flex items-center space-x-4">
                                        <div className="relative w-full sm:w-64">
                                            <input
                                                type="text"
                                                placeholder="Search users..."
                                                value={searchTerm}
                                                onChange={handleSearch}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                                        </div>
                                    </div>
                                </div>

                                {loading ? (
                                    <p>Loading users...</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {filteredUsers.map((tableUser) => (
                                                    <tr key={tableUser.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                                                                    <span className="text-white font-medium text-sm">RF</span>
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900">{tableUser.name}</div>
                                                                    <div className="text-sm text-gray-500">{tableUser.email}</div>
                                                                    {tableUser.isAdmin && (
                                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">Admin</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span
                                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${tableUser.verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                                                                    }`}
                                                            >
                                                                {tableUser.verified ? "Verified" : "Pending"}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tableUser.createdAt}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <div className="relative">
                                                                <button
                                                                    onClick={() => setOpenActionDropdown(openActionDropdown === tableUser.id ? null : tableUser.id)}
                                                                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                                >
                                                                    Actions
                                                                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                    </svg>
                                                                </button>
                                                                {openActionDropdown === tableUser.id && (
                                                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 origin-top-right border border-gray-200">
                                                                        {!tableUser.isAdmin && (
                                                                            <button
                                                                                onClick={() => handleActionClick(tableUser.id, "promote")}
                                                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                            >
                                                                                <div className="flex items-center">
                                                                                    <svg className="h-4 w-4 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
                                                                                    </svg>
                                                                                    Promote to Admin
                                                                                </div>
                                                                            </button>
                                                                        )}
                                                                        <button
                                                                            onClick={() => handleActionClick(tableUser.id, "edit")}
                                                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                        >
                                                                            <div className="flex items-center">
                                                                                <svg className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                    <path
                                                                                        strokeLinecap="round"
                                                                                        strokeLinejoin="round"
                                                                                        strokeWidth={2}
                                                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                                                    />
                                                                                </svg>
                                                                                Edit
                                                                            </div>
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleActionClick(tableUser.id, "deactivate")}
                                                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                        >
                                                                            <div className="flex items-center">
                                                                                <svg className="h-4 w-4 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                    <path
                                                                                        strokeLinecap="round"
                                                                                        strokeLinejoin="round"
                                                                                        strokeWidth={2}
                                                                                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                                                                                    />
                                                                                </svg>
                                                                                Deactivate Account
                                                                            </div>
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleActionClick(tableUser.id, "delete")}
                                                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                                        >
                                                                            <div className="flex items-center">
                                                                                <svg className="h-4 w-4 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                    <path
                                                                                        strokeLinecap="round"
                                                                                        strokeLinejoin="round"
                                                                                        strokeWidth={2}
                                                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                                    />
                                                                                </svg>
                                                                                Delete
                                                                            </div>
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Pagination */}
                                <div className="flex flex-col sm:flex-row items-center justify-between mt-6">
                                    <div className="text-sm text-gray-700 mb-2 sm:mb-0">
                                        Showing {(currentPage - 1) * usersPerPage + 1} to {Math.min(currentPage * usersPerPage, users.length)} of {users.length} results
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`px-3 py-1 text-sm border rounded-md ${currentPage === page ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 hover:bg-gray-50"}`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;