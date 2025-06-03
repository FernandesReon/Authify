import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { user, isLoggedIn, logout } = useAuth();

    const handleLogout = () => {
        logout();
        setIsUserMenuOpen(false);
        setIsMenuOpen(false);
    };

    return (
        <nav className="bg-white fixed w-full">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center text-white font-bold mr-2">
                                <Shield size={18} />
                            </div>
                            <span className="text-lg font-semibold">Authify</span>
                        </Link>
                    </div>

                    {/* Desktop navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        {isLoggedIn ? (
                            <div className="relative ml-3">
                                <button
                                    className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                >
                                    <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-medium text-sm">
                                            {user.name && user.name !== 'Unknown' ? user.name.charAt(0).toUpperCase() : 'U'}
                                        </span>
                                    </div>
                                    <span className="text-gray-700 font-medium">{user.name || 'User'}</span>
                                </button>
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-fit bg-white rounded-md shadow-lg py-1 z-50 origin-top-right">
                                        <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                                            <div className="font-medium">{user.name || 'User'}</div>
                                            <div className="text-gray-500">{user.email}</div>
                                            <div className="text-xs text-blue-600 font-medium">
                                                {user.roles.includes('ROLE_ADMIN') ? 'Administrator' : ''}
                                            </div>
                                        </div>
                                        <button
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={handleLogout}
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        {isLoggedIn && (
                            <div className="flex items-center mr-4">
                                <div className="h-6 w-6 bg-indigo-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-medium text-sm">
                                        {user.name && user.name !== 'Unknown' ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </span>
                                </div>
                                <span className="text-sm font-medium text-gray-700 mr-2">{user.name || 'User'}</span>
                            </div>
                        )}
                        <button
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden w-2/3 fixed top-16 right-0 bottom-0 bg-white shadow-lg z-20 transform transition-transform duration-300 ease-in-out">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {isLoggedIn ? (
                            <>
                                <div className="flex items-center px-3 py-2">
                                    <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-medium">
                                            {user.name && user.name !== 'Unknown' ? user.name.charAt(0).toUpperCase() : 'U'}
                                        </span>
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-base font-medium text-gray-800">{user.name || 'User'}</div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                        <div className="text-xs text-blue-600 font-medium">
                                            {user.roles.includes('ROLE_ADMIN') ? 'Administrator' : ''}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                                    onClick={handleLogout}
                                >
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <>
                            
                                <div className="pt-4 pb-3 border-t border-gray-200">
                                    <div className="flex items-center px-3">
                                        <Link
                                            to="/login"
                                            className="block w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Sign in
                                        </Link>
                                    </div>
                                    <div className="mt-3 px-3">
                                        <Link
                                            to="/register"
                                            className="block w-full px-3 py-2 text-center rounded-md text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Sign up
                                        </Link>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;