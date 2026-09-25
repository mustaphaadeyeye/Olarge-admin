import { useState, useEffect, useCallback } from "react";
import userService from "../services/user.service";
import type {
  UserProfile,
  UpdateProfileDto,
  ChangePasswordDto,
  SubmitKycDto,
  KycStatusData,
} from "../types/user";
import { extractErrorMessage } from "./useAuthActions";
import { useAuth } from "../context/AuthContext";

export const useUserProfile = () => {
  const { updateUser: syncAuthUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [kycData, setKycData] = useState<KycStatusData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Fetch authenticated user's profile
   */
  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.getProfile();
      setProfile(data);
      // Sync basic details into AuthContext so Topbar & global state stay updated
      if (syncAuthUser) {
        syncAuthUser({
          _id: data._id,
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          avatar: data.avatar,
          role: data.role,
        });
      }
      return data;
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to load profile details.");
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [syncAuthUser]);

  /**
   * Fetch KYC status details
   */
  const fetchKycStatus = useCallback(async () => {
    try {
      const data = await userService.getKycStatus();
      setKycData(data);
      return data;
    } catch (err) {
      console.warn("Failed to load KYC status:", err);
      return null;
    }
  }, []);

  useEffect(() => {
    fetchProfile();
    fetchKycStatus();
  }, [fetchProfile, fetchKycStatus]);

  /**
   * Update profile (name, phone, avatar, bio, buyerType)
   */
  const updateProfile = useCallback(
    async (dto: UpdateProfileDto): Promise<UserProfile> => {
      setIsUpdating(true);
      setError(null);
      setSuccessMessage(null);
      try {
        const updated = await userService.updateProfile(dto);
        setProfile(updated);
        if (syncAuthUser) {
          syncAuthUser({
            name: updated.name,
            phoneNumber: updated.phoneNumber,
            avatar: updated.avatar,
          });
        }
        setSuccessMessage("Profile updated successfully!");
        return updated;
      } catch (err) {
        const msg = extractErrorMessage(err, "Failed to update profile.");
        setError(msg);
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    [syncAuthUser]
  );

  /**
   * Change password
   */
  const changePassword = useCallback(
    async (dto: ChangePasswordDto): Promise<string> => {
      setIsUpdating(true);
      setError(null);
      setSuccessMessage(null);
      try {
        const message = await userService.changePassword(dto);
        setSuccessMessage(message || "Password changed successfully.");
        return message;
      } catch (err) {
        const msg = extractErrorMessage(err, "Failed to change password. Please check your current password.");
        setError(msg);
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  /**
   * Submit KYC verification
   */
  const submitKyc = useCallback(
    async (dto: SubmitKycDto): Promise<UserProfile> => {
      setIsUpdating(true);
      setError(null);
      setSuccessMessage(null);
      try {
        const updated = await userService.submitKyc(dto);
        setProfile(updated);
        setSuccessMessage("KYC application submitted successfully and is under review.");
        await fetchKycStatus();
        return updated;
      } catch (err) {
        const msg = extractErrorMessage(err, "Failed to submit KYC application.");
        setError(msg);
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    [fetchKycStatus]
  );

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  return {
    profile,
    kycData,
    isLoading,
    isUpdating,
    error,
    successMessage,
    refetch: fetchProfile,
    refetchKyc: fetchKycStatus,
    updateProfile,
    changePassword,
    submitKyc,
    clearMessages,
    setError,
    setSuccessMessage,
  };
};

export default useUserProfile;
