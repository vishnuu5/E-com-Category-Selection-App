"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

export default function Header() {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div>
      {/* Top Row - User Actions */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-end space-x-4 sm:space-x-6">
            <Link
              href="#"
              className="text-gray-600 hover:text-black text-xs sm:text-sm"
            >
              Help
            </Link>
            <Link
              href="#"
              className="text-gray-600 hover:text-black text-xs sm:text-sm"
            >
              Orders & Returns
            </Link>

            {user ? (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <span className="text-gray-700 text-xs sm:text-sm">
                  Hi, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-black text-xs sm:text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <span className="text-gray-700 text-xs sm:text-sm">Hi, John</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center space-x-4 sm:space-x-8">
              <Link
                href="/"
                className="text-xl sm:text-2xl font-bold text-black"
              >
                ECOMMERCE
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
                <Link
                  href="/categories"
                  className="text-gray-700 hover:text-black text-sm"
                >
                  Categories
                </Link>
                <Link
                  href="#"
                  className="text-gray-700 hover:text-black text-sm"
                >
                  Sale
                </Link>
                <Link
                  href="#"
                  className="text-gray-700 hover:text-black text-sm"
                >
                  Clearance
                </Link>
                <Link
                  href="#"
                  className="text-gray-700 hover:text-black text-sm"
                >
                  New stock
                </Link>
                <Link
                  href="#"
                  className="text-gray-700 hover:text-black text-sm"
                >
                  Trending
                </Link>
              </nav>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-black"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Right side - Search and Cart */}
            <div className="flex items-center space-x-4">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 cursor-pointer" />
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 cursor-pointer" />
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
              <nav className="flex flex-col space-y-3">
                <Link
                  href="/categories"
                  className="text-gray-700 hover:text-black text-sm"
                >
                  Categories
                </Link>
                <Link
                  href="#"
                  className="text-gray-700 hover:text-black text-sm"
                >
                  Sale
                </Link>
                <Link
                  href="#"
                  className="text-gray-700 hover:text-black text-sm"
                >
                  Clearance
                </Link>
                <Link
                  href="#"
                  className="text-gray-700 hover:text-black text-sm"
                >
                  New stock
                </Link>
                <Link
                  href="#"
                  className="text-gray-700 hover:text-black text-sm"
                >
                  Trending
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Promotional Banner */}
      <div className="bg-gray-100 py-2 sm:py-3">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center space-x-2 sm:space-x-4">
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 cursor-pointer" />
            <span className="text-xs sm:text-sm text-gray-700">
              Get 10% off on business sign up
            </span>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
}
