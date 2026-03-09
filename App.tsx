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
import CheckoutPage from "./page/CheckoutPage";
import AdminPage from "./page/AdminPage";
import ProfilePage from "./page/ProfilePage";
import OrderHistoryPage from "./page/OrderHistoryPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { dbService } from "./databaseService";
import { Dish, CartItem, User } from "./types";

const loadCurrentUser = (): User | null => {
  try {
    return JSON.parse(localStorage.getItem("foodly_current_user") ?? "null");
  } catch {
    return null;
  }
};

const saveCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem("foodly_current_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("foodly_current_user");
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
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    loadCurrentUser(),
  );
  // Cart is loaded asynchronously in the effect below; keep initial state as an empty array
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const loadedUsers = await dbService.getUsers();
        setUsers(loadedUsers);
        
        if (currentUser) {
          const [loadedCart, loadedWishlist] = await Promise.all([
            dbService.getCart(currentUser.id),
            dbService.getWishlist(currentUser.id),
          ]);
          setCart(loadedCart);
          setWishlist(loadedWishlist);
        } else {
          setCart([]);
          setWishlist([]);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [currentUser]);

  // Save cart to database
  useEffect(() => {
    if (currentUser && !isLoading) {
      dbService.setCart(currentUser.id, cart).catch((error) => {
        console.error("Failed to save cart:", error);
      });
    }
  }, [cart, currentUser, isLoading]);

  // Save wishlist to database
  useEffect(() => {
    if (currentUser && !isLoading) {
      dbService.setWishlist(currentUser.id, wishlist).catch((error) => {
        console.error("Failed to save wishlist:", error);
      });
    }
  }, [wishlist, currentUser, isLoading]);

  // Save current user to localStorage (session data)
  useEffect(() => {
    saveCurrentUser(currentUser);
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
      prev.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta;
          // Ensure quantity is at least 1
          return { ...item, quantity: Math.max(1, newQuantity) };
        }
        return item;
      }),
    );

  const removeFromCart = (id: number) =>
    setCart((prev) => prev.filter((item) => item.id !== id));

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const allUsers = await dbService.getUsers();
      const found = allUsers.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password,
      );
      if (!found) return null;
      setCurrentUser(found);
      setUsers(allUsers);
      return found;
    } catch (error) {
      console.error("Login failed:", error);
      return null;
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    role: User["role"];
  }): Promise<{ user?: User; error?: string }> => {
    try {
      const allUsers = await dbService.getUsers();
      const exists = allUsers.some(
        (u) => u.email.toLowerCase() === data.email.toLowerCase(),
      );
      if (exists) {
        return { error: "Email đã tồn tại, vui lòng dùng email khác." };
      }
      const newUser: User = {
        id: allUsers.length ? Math.max(...allUsers.map((u) => u.id)) + 1 : 1,
        ...data,
      };
      await dbService.addUser(newUser);
      const updatedUsers = await dbService.getUsers();
      setUsers(updatedUsers);
      setCurrentUser(newUser);
      return { user: newUser };
    } catch (error) {
      console.error("Registration failed:", error);
      return { error: "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại." };
    }
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
                  currentUser={currentUser}
                />
              }
            />
          }
        />
        <Route
          path="/checkout"
          element={
            <Layout
              cartCount={cartCount}
              currentUser={currentUser}
              onLogout={logout}
              children={
                <CheckoutPage
                  cart={cart}
                  currentUser={currentUser}
                  onCheckoutSuccess={() => {
                    if (currentUser) {
                      dbService.setCart(currentUser.id, []);
                      setCart([]);
                    }
                  }}
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
