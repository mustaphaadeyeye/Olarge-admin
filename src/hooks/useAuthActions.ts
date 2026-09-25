import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import authService from "../services/auth.service";
import type { ApiErrorResponse, LoginCredentials, AuthResponseData } from "../types/auth";
import { useAuth } from "../context/AuthContext";

/**
 * Helper to safely extract user-friendly error messages from API or network errors
 */
export const extractErrorMessage = (err: unknown, fallback: string): string => {
  if (axios.isAxiosError<ApiErrorResponse>(err)) {
    return err.response?.data?.message || fallback;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return fallback;
};

/**
 * Hook for handling login with loading, error, and context synchronization
 */
export const useLogin = () => {
  const { login: contextLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<AuthResponseData> => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await contextLogin(credentials);
        return data;
      } catch (err) {
        const msg = extractErrorMessage(err, "Invalid email or password. Please try again.");
        setError(msg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [contextLogin]
  );

  return { login, isLoading, error, setError };
};

/**
 * Hook for email verification and OTP resending with built-in cooldown
 */
export const useVerifyEmail = (initialCooldown = 60) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(initialCooldown);

  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const verifyEmail = useCallback(async (email: string, code: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await authService.verifyEmail(email.trim(), code.trim());
      setSuccess("Your email has been successfully verified!");
      return response;
    } catch (err) {
      const msg = extractErrorMessage(
        err,
        "Invalid or expired verification code. Please check and try again."
      );
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resendCode = useCallback(
    async (email: string) => {
      if (cooldown > 0 || isResending) return;
      setIsResending(true);
      setError(null);
      setSuccess(null);
      try {
        const response = await authService.resendVerificationCode(email.trim());
        setSuccess("A fresh verification code has been sent to your email.");
        setCooldown(initialCooldown);
        return response;
      } catch (err) {
        const msg = extractErrorMessage(
          err,
          "Failed to resend code. Please try again in a moment."
        );
        setError(msg);
        throw err;
      } finally {
        setIsResending(false);
      }
    },
    [cooldown, isResending, initialCooldown]
  );

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  return {
    verifyEmail,
    resendCode,
    isLoading,
    isResending,
    error,
    success,
    cooldown,
    clearMessages,
    setError,
    setSuccess,
  };
};

/**
 * Hook for forgot password & reset password flows
 */
export const usePasswordReset = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const forgotPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await authService.forgotPassword(email.trim());
      setSuccess(`A verification code has been sent to ${email.trim()}`);
      return response;
    } catch (err) {
      const msg = extractErrorMessage(
        err,
        "Unable to send reset code. Please check your email."
      );
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetPassword = useCallback(
    async (payload: { email: string; code: string; newPassword: string }) => {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const response = await authService.resetPassword({
          email: payload.email.trim(),
          code: payload.code.trim(),
          newPassword: payload.newPassword,
        });
        setSuccess("Your password has been successfully reset.");
        return response;
      } catch (err) {
        const msg = extractErrorMessage(
          err,
          "Failed to reset password. The code might be expired or invalid."
        );
        setError(msg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  return {
    forgotPassword,
    resetPassword,
    isLoading,
    error,
    success,
    clearMessages,
    setError,
    setSuccess,
  };
};
