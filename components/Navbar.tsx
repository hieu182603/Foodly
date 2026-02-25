import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, UtensilsCrossed } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="bg-primary p-2 rounded-lg">
                            <UtensilsCrossed className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold text-textMain">Foodly</span>
                    </div>

                    {/* User Info */}
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-textSec">
                            Xin chào, <span className="font-semibold text-textMain">{user.name || 'User'}</span>
                        </span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut size={16} />
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
