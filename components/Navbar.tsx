import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UtensilsCrossed, ShoppingCart, Menu, X } from "lucide-react";

interface NavbarProps {
  cartCount?: number;
}

const Navbar = ({ cartCount = 0 }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "Home", path: "/" },
    { label: "Menu", path: "/menu" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="bg-primary p-1.5 rounded-lg">
            <UtensilsCrossed className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold text-textMain tracking-tight">
            Food<span className="text-primary">ly</span>
          </span>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Cart Button (icon + text) */}
          <button
            onClick={() => navigate("/cart")}
            className="relative flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all bg-primary/10 text-primary hover:bg-primary/20"
          >
            <ShoppingCart size={20} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>

          {/* Login Button */}
          <button
            onClick={() => navigate("/login")}
            className="hidden md:flex items-center px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primaryDark transition-all shadow-sm shadow-primary/20"
          >
            Sign In
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 pt-2 space-y-1">
          {links.map((link) => (
            <button
              key={link.path}
              onClick={() => {
                navigate(link.path);
                setMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                isActive(link.path)
                  ? "bg-primary/10 text-primary"
                  : "text-textSec hover:bg-gray-50"
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              navigate("/login");
              setMenuOpen(false);
            }}
            className="w-full text-left px-4 py-3 rounded-xl bg-primary text-white font-bold text-sm"
          >
            Sign In
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
