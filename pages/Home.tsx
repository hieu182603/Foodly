import React from 'react';

const Home = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-textMain mb-2">Trang chủ</h1>
                <p className="text-textSec">Chào mừng bạn đến với Foodly</p>
            </div>

            {/* Placeholder content */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                <p className="text-center text-textSec">
                    Nội dung trang chủ sẽ được phát triển ở đây
                </p>
            </div>
        </div>
    );
};

export default Home;
