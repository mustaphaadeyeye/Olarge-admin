import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams, Link } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, AlertTriangle, Loader2, ArrowRight } from "lucide-react";
import axios from "axios";
import AuthLayout from "./AuthLayout";
import { useAuth } from "../context/AuthContext";
import type { ApiErrorResponse } from "../types/auth";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEmailUnverified, setIsEmailUnverified] = useState(false);

  // Check if session expired redirect
  const isSessionExpired = searchParams.get("session") === "expired";

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const destination =
        (location.state as { from?: { pathname: string } })?.from?.pathname || "/dashboard";
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsEmailUnverified(false);

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both your email address and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login({
        email: email.trim(),
        password,
      });

      const destination =
        (location.state as { from?: { pathname: string } })?.from?.pathname || "/dashboard";
      navigate(destination, { replace: true });
    } catch (err: unknown) {
      if (axios.isAxiosError<ApiErrorResponse>(err)) {
        const status = err.response?.status;
        const apiError = err.response?.data;

        if (status === 401) {
          setErrorMessage(
            apiError?.message ||
              "Invalid email or password. Please verify your credentials and try again."
          );
        } else if (status === 403) {
          setIsEmailUnverified(true);
          setErrorMessage(
            apiError?.message ||
              "Your email address has not been verified yet. Please check your inbox to activate your account."
          );
        } else if (status === 429) {
          setErrorMessage(
            "Too many login attempts from this network. Please wait a few minutes before trying again."
          );
        } else if (status && status >= 500) {
          setErrorMessage(
            "The server is currently unavailable. Please try again in a few moments."
          );
        } else {
          setErrorMessage(
            apiError?.message || "Login failed. Please check your connection and try again."
          );
        }
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unexpected error occurred during login. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      showTabs={true}
      activeTab="login"
      bannerCategory="Direct from Farms"
      bannerTitle="From local farm gates to regional supply, manage agriculture with precision."
    >
      {/* Session Expired Alert */}
      {isSessionExpired && !errorMessage && (
        <div className="mb-4 p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Session Expired</p>
            <p className="text-amber-700 mt-0.5">
              Your session has expired. Please sign in again to continue.
            </p>
          </div>
        </div>
      )}

      {/* Unverified Email Warning */}
      {isEmailUnverified && (
        <div className="mb-4 p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs flex flex-col gap-2">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold">Email Verification Required</p>
              <p className="text-amber-700">{errorMessage}</p>
            </div>
          </div>
          <div className="pl-6">
            <button
              type="button"
              onClick={() =>
                navigate(`/verify-email?email=${encodeURIComponent(email)}`)
              }
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#2F7A3D] hover:underline"
            >
              <span>Enter verification code now</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      )}

      {/* General Error Banner */}
      {errorMessage && !isEmailUnverified && (
        <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="flex-1 font-medium">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            placeholder="admin@olage.ng"
            className="w-full h-11 px-3.5 rounded-md border border-gray-300 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#2F7A3D] transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              placeholder="Enter your password"
              className="w-full h-11 pl-3.5 pr-10 rounded-md border border-gray-300 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#2F7A3D] transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex justify-end mt-2">
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-gray-500 hover:text-[#2F7A3D] transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="
            w-full h-11 mt-1
            bg-amber-500 hover:bg-[#256331]
            text-white text-sm font-semibold
            rounded-md
            transition-colors cursor-pointer
            flex items-center justify-center gap-2
            disabled:opacity-60 disabled:cursor-not-allowed
          "
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Signing In...</span>
            </>
          ) : (
            <span>Log In</span>
          )}
        </button>

        {/* Seller note */}
        <div className="pt-3 text-center">
          <p className="text-xs text-gray-500">
            Interested in seller registration?{" "}
            <Link
              to="/signup"
              className="text-[#2F7A3D] font-semibold hover:underline"
            >
              Learn more
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;