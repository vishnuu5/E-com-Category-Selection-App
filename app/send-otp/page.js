"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SendOTPPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [devOTP, setDevOTP] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");
    setDevOTP("");

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, purpose: "general" }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        if (data.devOTP) {
          setDevOTP(data.devOTP);
        }
        // Store email for verification
        localStorage.setItem("otpEmail", email);
        // Redirect to verification page after 2 seconds
        setTimeout(() => {
          router.push("/verify-otp");
        }, 2000);
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-black mb-2 sm:mb-4">
            Send OTP
          </h1>
          <p className="text-gray-600 text-sm">
            Enter any email address to receive a verification code
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base"
              placeholder="Enter any email address"
            />
          </div>

          {/* Success Message */}
          {message && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-600 text-sm text-center">{message}</p>
              {devOTP && (
                <p className="text-green-700 text-xs text-center mt-2 font-mono">
                  Dev OTP: {devOTP}
                </p>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white font-medium py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {isLoading ? "Sending OTP..." : "SEND OTP"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Want to go back?{" "}
            <Link href="/" className="text-black font-medium hover:underline">
              Home
            </Link>
          </p>
        </div>

        {/* Development Info */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-700 text-xs text-center">
              <strong>Development Mode:</strong> Any 8-digit number will work as
              OTP
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
