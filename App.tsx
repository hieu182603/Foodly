import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./page/LoginPage";
import RegisterPage from "./page/RegisterPage";
import MenuPage from "./page/MenuPage";
import HomePage from "./page/HomePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Dish } from "./types";

interface CartItem extends Dish {
  quantity: number;
}

const load = <T,>(key: string, fallback: T): T => {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback;
  } catch {
    return fallback;
  }
};

const App = () => {
  const [cart, setCart] = useState<CartItem[]>(() => load("foodly_cart", []));
  const [wishlist, setWishlist] = useState<number[]>(() =>
    load("foodly_wishlist", []),
  );

  useEffect(() => {
    localStorage.setItem("foodly_cart", JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    localStorage.setItem("foodly_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (dish: Dish) =>
    setCart((prev) => {
      const found = prev.find((i) => i.id === dish.id);
      return found
        ? prev.map((i) =>
            i.id === dish.id ? { ...i, quantity: i.quantity + 1 } : i,
          )
        : [...prev, { ...dish, quantity: 1 }];
    });

  const toggleWishlist = (id: number) =>
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const Layout = ({ children }: { children: React.ReactNode }) => (
    <>
      <Navbar cartCount={cartCount} />
      <main>{children}</main>
      <Footer />
    </>
  );

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <Layout>
              <HomePage
                addToCart={addToCart}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
              />
            </Layout>
          }
        />
        <Route
          path="/menu"
          element={
            <Layout>
              <MenuPage addToCart={addToCart} />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
