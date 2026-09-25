import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import AuthLayout from "./AuthLayout";
import authService from "../services/auth.service";
import type { ApiErrorResponse } from "../types/auth";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  // Steps: 'request' | 'reset' | 'completed'
  const [step, setStep] = useState<"request" | "reset" | "completed">("request");

  const [email, setEmail] = useState("");
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // OTP Handlers
  const handleDigitChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) {
      const nextCode = [...code];
      nextCode[index] = "";
      setCode(nextCode);
      return;
    }

    const digit = cleaned[cleaned.length - 1];
    const nextCode = [...code];
    nextCode[index] = digit;
    setCode(nextCode);

    if (index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasteData) return;

    const nextCode = [...code];
    for (let i = 0; i < 6; i++) {
      nextCode[i] = pasteData[i] || "";
    }
    setCode(nextCode);

    const targetIdx = Math.min(pasteData.length, 5);
    inputRefs.current[targetIdx]?.focus();
  };

  // Step 1: Request Code
  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.forgotPassword(email.trim());
      setSuccessMessage(`We've sent a 6-digit recovery code to ${email.trim()}`);
      setStep("reset");
    } catch (err: unknown) {
      if (axios.isAxiosError<ApiErrorResponse>(err)) {
        setErrorMessage(
          err.response?.data?.message || "Unable to send reset code. Please check your email."
        );
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Reset Password
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit code.");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please ensure both fields are identical.");
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.resetPassword({
        email: email.trim(),
        code: fullCode,
        newPassword,
      });
      setStep("completed");
    } catch (err: unknown) {
      if (axios.isAxiosError<ApiErrorResponse>(err)) {
        setErrorMessage(
          err.response?.data?.message ||
            "Failed to reset password. The code might be expired or invalid."
        );
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      showBackToLogin={step !== "completed"}
      title={
        step === "request"
          ? "Forgot Password?"
          : step === "reset"
          ? "Create New Password"
          : "Password Reset Complete"
      }
      subtitle={
        step === "request"
          ? "Enter your registered email address and we'll send you a 6-digit verification code to reset your account password."
          : step === "reset"
          ? `Enter the 6-digit code sent to ${email} along with your new password.`
          : "Your account credentials have been successfully updated. You can now log in securely."
      }
      bannerCategory="Account Recovery"
      bannerTitle="Securing agriculture transactions with protected administrator access."
    >
      {/* Success Notification */}
      {successMessage && step !== "completed" && (
        <div className="mb-5 p-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="font-medium">{successMessage}</p>
        </div>
      )}

      {/* Error Notification */}
      {errorMessage && (
        <div className="mb-5 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="font-medium flex-1">{errorMessage}</p>
        </div>
      )}

      {/* Step 1: Request Code Form */}
      {step === "request" && (
        <form onSubmit={handleRequestSubmit} className="space-y-5">
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
              className="w-full h-11 px-3.5 rounded-md border border-gray-300 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#2F7A3D] transition-colors disabled:bg-gray-50"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="
              w-full h-11
              bg-[#2F7A3D] hover:bg-[#256331]
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
                <span>Sending Code...</span>
              </>
            ) : (
              <span>Send Verification Code</span>
            )}
          </button>
        </form>
      )}

      {/* Step 2: Code + New Password */}
      {step === "reset" && (
        <form onSubmit={handleResetSubmit} className="space-y-4">
          {/* OTP Code */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
              6-Digit Recovery Code
            </label>
            <div className="flex items-center justify-between gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  disabled={isSubmitting}
                  className="w-11 sm:w-12 h-12 text-center text-lg font-bold text-gray-900 bg-white border border-gray-300 rounded-md outline-none focus:border-[#2F7A3D] transition-colors disabled:bg-gray-50"
                />
              ))}
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isSubmitting}
                placeholder="At least 6 characters"
                className="w-full h-11 pl-3.5 pr-10 rounded-md border border-gray-300 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#2F7A3D] transition-colors disabled:bg-gray-50"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                placeholder="Repeat new password"
                className="w-full h-11 pl-3.5 pr-10 rounded-md border border-gray-300 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#2F7A3D] transition-colors disabled:bg-gray-50"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || code.join("").length !== 6}
            className="
              w-full h-11 mt-2
              bg-[#2F7A3D] hover:bg-[#256331]
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
                <span>Resetting Password...</span>
              </>
            ) : (
              <span>Update Password</span>
            )}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setStep("request");
                setCode(["", "", "", "", "", ""]);
                setErrorMessage(null);
              }}
              className="text-xs text-gray-500 hover:text-[#2F7A3D] transition-colors cursor-pointer"
            >
              Didn't receive code? Change email or try again
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Completed */}
      {step === "completed" && (
        <div className="space-y-6 pt-2">
          <div className="p-4 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-emerald-950">Password updated successfully</p>
              <p className="text-xs text-emerald-800 leading-relaxed">
                You can now log in using your new credentials.
              </p>
            </div>
          </div>

          <Link
            to="/login"
            className="
              w-full h-11
              bg-[#2F7A3D] hover:bg-[#256331]
              text-white text-sm font-semibold
              rounded-md
              transition-colors cursor-pointer
              flex items-center justify-center gap-2
            "
          >
            Proceed to Log In
          </Link>
        </div>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
