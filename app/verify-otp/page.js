"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const inputRefs = useRef([]);

  useEffect(() => {
    const otpEmail = localStorage.getItem("otpEmail");
    if (otpEmail) {
      setEmail(otpEmail);
    } else {
      router.push("/send-otp");
    }
  }, [router]);

  const handleChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 8) {
      setError("Please enter the complete 8-digit code");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/verify-any-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("OTP verified successfully!");
        localStorage.removeItem("otpEmail");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setError(data.message || "Verification failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
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
        setSuccess("New OTP sent successfully!");
        setOtp(["", "", "", "", "", "", "", ""]);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
  };

  const maskEmail = (email) => {
    if (!email) return "";
    const [username, domain] = email.split("@");
    const maskedUsername = username.slice(0, 3) + "***";
    return `${maskedUsername}@${domain}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-black mb-4">
            Verify OTP
          </h1>
          <p className="text-gray-600 text-sm">
            Enter the 8 digit code sent to
            <br />
            <span className="font-medium">{maskEmail(email)}</span>
          </p>
        </div>

        <div className="mb-6 sm:mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Code
          </label>
          <div className="flex space-x-1 sm:space-x-2 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-10 h-10 sm:w-12 sm:h-12 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base sm:text-lg font-medium"
              />
            ))}
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-600 text-sm text-center">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleVerify}
            disabled={isLoading}
            className="w-full bg-black text-white font-medium py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {isLoading ? "Verifying..." : "VERIFY"}
          </button>

          <button
            onClick={handleResendOTP}
            disabled={isLoading}
            className="w-full bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            Resend OTP
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Want to try different email?{" "}
            <Link
              href="/send-otp"
              className="text-black font-medium hover:underline"
            >
              Send New OTP
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
