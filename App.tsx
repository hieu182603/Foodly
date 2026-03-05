import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./page/LoginPage";
import RegisterPage from "./page/RegisterPage";
import ForgotPasswordPage from "./page/ForgotPasswordPage";
import MenuPage from "./page/MenuPage";
import HomePage from "./page/HomePage";
import CartPage from "./page/CartPage";
import AdminPage from "./page/AdminPage";
import ProfilePage from "./page/ProfilePage";
import OrderHistoryPage from "./page/OrderHistoryPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { USERS } from "./mockData";
import { Dish, CartItem, User } from "./types";

const load = <T,>(key: string, fallback: T): T => {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback;
  } catch {
    return fallback;
  }
};

const Layout = ({
  cartCount,
  currentUser,
  onLogout,
  children,
}: {
  cartCount: number;
  currentUser: User | null;
  onLogout: () => void;
  children: React.ReactNode;
}) => (
  <>
    <Navbar cartCount={cartCount} currentUser={currentUser} onLogout={onLogout} />
    <main>{children}</main>
    <Footer />
  </>
);

const App = () => {
  const [cart, setCart] = useState<CartItem[]>(() => load("foodly_cart", []));
  const [wishlist, setWishlist] = useState<number[]>(() =>
    load("foodly_wishlist", []),
  );
  const [users, setUsers] = useState<User[]>(() => load("foodly_users", USERS));
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    load("foodly_current_user", null),
  );

  useEffect(() => {
    localStorage.setItem("foodly_cart", JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    localStorage.setItem("foodly_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);
  useEffect(() => {
    localStorage.setItem("foodly_users", JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem("foodly_current_user", JSON.stringify(currentUser));
  }, [currentUser]);

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

  const updateQuantity = (id: number, delta: number) =>
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + delta } : item,
      ),
    );

  const removeFromCart = (id: number) =>
    setCart((prev) => prev.filter((item) => item.id !== id));

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const login = (email: string, password: string): User | null => {
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password,
    );
    if (!found) return null;
    setCurrentUser(found);
    return found;
  };

  const register = (data: {
    name: string;
    email: string;
    password: string;
    role: User["role"];
  }): { user?: User; error?: string } => {
    const exists = users.some(
      (u) => u.email.toLowerCase() === data.email.toLowerCase(),
    );
    if (exists) {
      return { error: "Email đã tồn tại, vui lòng dùng email khác." };
    }
    const newUser: User = {
      id: users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      ...data,
    };
    const next = [...users, newUser];
    setUsers(next);
    setCurrentUser(newUser);
    return { user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage onLogin={login} currentUser={currentUser} />}
        />
        <Route
          path="/register"
          element={<RegisterPage onRegister={register} />}
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/"
          element={
            <Layout
              cartCount={cartCount}
              currentUser={currentUser}
              onLogout={logout}
              children={
                <HomePage
                  addToCart={addToCart}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                />
              }
            />
          }
        />
        <Route
          path="/menu"
          element={
            <Layout
              cartCount={cartCount}
              currentUser={currentUser}
              onLogout={logout}
              children={<MenuPage addToCart={addToCart} />}
            />
          }
        />
        <Route
          path="/cart"
          element={
            <Layout
              cartCount={cartCount}
              currentUser={currentUser}
              onLogout={logout}
              children={
                <CartPage
                  cart={cart}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              }
            />
          }
        />
        <Route
          path="/profile"
          element={
            <Layout
              cartCount={cartCount}
              currentUser={currentUser}
              onLogout={logout}
              children={<ProfilePage currentUser={currentUser} />}
            />
          }
        />
        <Route
          path="/orders"
          element={
            <Layout
              cartCount={cartCount}
              currentUser={currentUser}
              onLogout={logout}
              children={<OrderHistoryPage currentUser={currentUser} />}
            />
          }
        />
        <Route
          path="/admin"
          element={
            currentUser?.role === "admin" ? (
              <AdminPage user={currentUser} onLogout={logout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
