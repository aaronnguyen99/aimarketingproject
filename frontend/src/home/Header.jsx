import React from "react";
import { useAuth } from "../contexts/AuthContext"; // adjust path if needed
import { Link } from "react-router-dom";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div   onClick={() => {
    const hero = document.getElementById("hero");
    if (hero) hero.scrollIntoView({ behavior: "smooth" });
  }} className="cursor-pointer text-2xl font-bold text-gray-800">MeiryoAI</div>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          <a href="#features" className="text-black hover:text-gray-700 transition">
            Features
          </a>
          <a href="#pricing" className="text-black hover:text-gray-700 transition">
            Pricing
          </a>
          <a href="#contact" className="text-black hover:text-gray-700 transition">
            Contact
          </a>

          {/* Login / Logout */}
          {!user ? (
            <Link
              to="/auth"
              className="ml-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-black transition"
            >
              Login
            </Link>
          ) : (
            <Link
              to="/dashboard"
              className="ml-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Dashboard
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}