import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, AlertTriangle, Loader2 } from "lucide-react";
import axios from "axios";
import AuthLayout from "./AuthLayout";
import SocialLoginRow from "./SocialLoginRow";
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
      const destination = (location.state as { from?: { pathname: string } })?.from?.pathname || "/dashboard";
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

      // On successful login, redirect to target dashboard route
      const destination = (location.state as { from?: { pathname: string } })?.from?.pathname || "/dashboard";
      navigate(destination, { replace: true });
    } catch (err: unknown) {
      if (axios.isAxiosError<ApiErrorResponse>(err)) {
        const status = err.response?.status;
        const apiError = err.response?.data;

        if (status === 401) {
          setErrorMessage(apiError?.message || "Invalid email or password. Please verify your credentials and try again.");
        } else if (status === 403) {
          setIsEmailUnverified(true);
          setErrorMessage(
            apiError?.message ||
              "Your email address has not been verified yet. Please check your inbox to activate your account."
          );
        } else if (status === 429) {
          setErrorMessage("Too many login attempts from this network. Please wait a few minutes before trying again.");
        } else if (status && status >= 500) {
          setErrorMessage("The server is currently unavailable. Please try again in a few moments.");
        } else {
          setErrorMessage(apiError?.message || "Login failed. Please check your connection and try again.");
        }
      } else if (err instanceof Error) {
        // e.g. Role validation failure or unexpected JS error
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unexpected error occurred during login. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout formTitle="Login Into Your Account">
      {/* Session Expired Alert */}
      {isSessionExpired && !errorMessage && (
        <div className="mb-4 p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Session Expired</p>
            <p className="text-amber-700 mt-0.5">Your session has expired. Please sign in again to continue.</p>
          </div>
        </div>
      )}

      {/* Unverified Email Warning */}
      {isEmailUnverified && (
        <div className="mb-4 p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Email Verification Required</p>
            <p className="text-amber-700">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* General Error Banner */}
      {errorMessage && !isEmailUnverified && (
        <div className="mb-4 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="flex-1 font-medium">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#333] mb-1.5">
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
            className="w-full h-11 px-4 rounded-md border border-[#F2A65A] bg-white text-sm text-[#333] placeholder:text-[#B0B0B0] outline-none focus:border-[#F2762E] focus:ring-1 focus:ring-[#F2762E] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#333] mb-1.5">
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
              className="w-full h-11 pl-4 pr-11 rounded-md border border-[#F2A65A] bg-white text-sm text-[#333] placeholder:text-[#B0B0B0] outline-none focus:border-[#F2762E] focus:ring-1 focus:ring-[#F2762E] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-xs text-[#555] hover:text-[#2F7A3D] transition-colors cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="
            w-full h-12 mt-2
            bg-[#F2762E] hover:bg-[#E0651E]
            text-white text-sm font-semibold
            rounded-md
            transition-all cursor-pointer
            flex items-center justify-center gap-2
            disabled:opacity-70 disabled:cursor-not-allowed
            shadow-sm hover:shadow-md
          "
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <span>Login Now</span>
          )}
        </button>

        <div className="pt-2 text-center space-y-1.5">
          <p className="text-xs text-gray-600">
            Looking for seller registration?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-[#F2762E] font-semibold hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <span>Seller Onboarding</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-medium">Coming Soon</span>
            </button>
          </p>
          <p className="text-[11px] text-gray-400">
            Product catalog posting is currently restricted to authorized administrators.
          </p>
        </div>
      </form>

      <SocialLoginRow />
    </AuthLayout>
  );
};

export default Login;