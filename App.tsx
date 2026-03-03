import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './page/LoginPage';
import RegisterPage from './page/RegisterPage';
import MenuPage from './page/MenuPage';
import Footer from './component/Footer';
import { Dish } from './types';

const App = () => {
    const [cart, setCart] = useState<Dish[]>([]);

    const addToCart = (dish: Dish) => {
        setCart(prev => [...prev, dish]);
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/menu" element={
                    <>
                        <MenuPage addToCart={addToCart} />
                        <Footer />
                    </>
                } />
            </Routes>
        </Router>
    );
};

export default App;
