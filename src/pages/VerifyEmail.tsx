import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import axios from "axios";
import AuthLayout from "./AuthLayout";
import authService from "../services/auth.service";
import type { ApiErrorResponse } from "../types/auth";

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialEmail = searchParams.get("email") || "";
  const [email, setEmail] = useState(initialEmail);
  const [isEditingEmail, setIsEditingEmail] = useState(!initialEmail);

  // 6-digit OTP code state
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Countdown timer for resend code
  const [resendCooldown, setResendCooldown] = useState<number>(60);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Focus first input box on load
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric digit
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) {
      const nextCode = [...code];
      nextCode[index] = "";
      setCode(nextCode);
      return;
    }

    const digit = cleaned[cleaned.length - 1]; // take the latest entered char
    const nextCode = [...code];
    nextCode[index] = digit;
    setCode(nextCode);

    // Auto-advance to next input
    if (index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!code[index] && index > 0 && inputRefs.current[index - 1]) {
        // Move back to previous input if current is already empty
        inputRefs.current[index - 1]?.focus();
      }
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

    // Focus last filled box or final box
    const targetIdx = Math.min(pasteData.length, 5);
    inputRefs.current[targetIdx]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    if (!email.trim()) {
      setErrorMessage("Please enter the email address to verify.");
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.verifyEmail(email.trim(), fullCode);
      setSuccessMessage("Your email has been successfully verified! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: unknown) {
      if (axios.isAxiosError<ApiErrorResponse>(err)) {
        setErrorMessage(
          err.response?.data?.message ||
            "Invalid or expired verification code. Please check and try again."
        );
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Verification failed. Please check the code and try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;
    if (!email.trim()) {
      setErrorMessage("Please enter an email address to resend the code.");
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsResending(true);

    try {
      await authService.resendVerificationCode(email.trim());
      setSuccessMessage("A fresh verification code has been sent to your email.");
      setResendCooldown(60);
    } catch (err: unknown) {
      if (axios.isAxiosError<ApiErrorResponse>(err)) {
        setErrorMessage(
          err.response?.data?.message || "Failed to resend code. Please try again in a moment."
        );
      } else {
        setErrorMessage("Unable to resend code. Please try again.");
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout
      showBackToLogin={true}
      title="Enter Verification Code"
      subtitle={
        email
          ? `Enter the 6-digit code sent to ${email}. Please enter the code to continue.`
          : "Enter the 6-digit code sent to your email address. Please enter the code to continue."
      }
      bannerCategory="Account Security"
      bannerTitle="Securing agriculture trading with verified admin and merchant credentials."
    >
      {/* Success Notification */}
      {successMessage && (
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Optional Email Edit Row */}
        {/* {(!initialEmail || isEditingEmail) && (
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Verification Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full h-10 px-3.5 rounded-md border border-gray-300 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#2F7A3D] transition-colors"
            />
          </div>
        )} */}

        {initialEmail && !isEditingEmail && (
          <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
            <span>
              Target: <strong className="text-gray-700">{email}</strong>
            </span>
            <button
              type="button"
              onClick={() => setIsEditingEmail(true)}
              className="text-[#2F7A3D] font-medium hover:underline cursor-pointer"
            >
              Change
            </button>
          </div>
        )}

        {/* 6 OTP Boxes */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 sm:gap-2.5">
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
                className="w-11 sm:w-13 h-12 sm:h-13 text-center text-lg sm:text-xl font-bold text-gray-900 bg-white border border-gray-300 rounded-md outline-none focus:border-[#2F7A3D] transition-colors disabled:bg-gray-50"
              />
            ))}
          </div>
        </div>

        {/* Action Button: Verify the code */}
        <button
          type="submit"
          disabled={isSubmitting || code.join("").length !== 6}
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
              <span>Verifying...</span>
            </>
          ) : (
            <span>Verify the code</span>
          )}
        </button>

        {/* Resend Code Action */}
        <div className="text-center pt-2">
          {resendCooldown > 0 ? (
            <p className="text-xs text-gray-500">
              Resend code in{" "}
              <span className="font-semibold text-gray-700">{resendCooldown}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-xs font-semibold text-[#2F7A3D] hover:underline cursor-pointer disabled:opacity-60"
            >
              {isResending ? "Sending code..." : "Resend code"}
            </button>
          )}
        </div>
      </form>
    </AuthLayout>
  );
};

export default VerifyEmail;
