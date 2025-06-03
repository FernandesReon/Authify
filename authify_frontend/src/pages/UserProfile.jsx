import { Mail, User } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
    const { user, isLoggedIn } = useAuth();

    if (!isLoggedIn) {
        return <div>Please login to view profile.</div>;
    }

    const getInitials = (name) => {
        if (!name) return 'U';
        const nameParts = name.split(' ');
        const initials = nameParts.map((part) => part.charAt(0).toUpperCase()).join('');
        return initials;
    };

    return (
        <div className="app-container">
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0 mt-16">
                        <div className="text-center">
                            <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-blue-600 font-bold text-2xl">{getInitials(user.name)}</span>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user.name || 'User'}!</h1>
                            <p className="text-gray-600 mb-8">Your account has been successfully verified and you're now logged in.</p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UserProfile;