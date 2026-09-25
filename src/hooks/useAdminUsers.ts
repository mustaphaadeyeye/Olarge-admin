import { useState, useEffect, useCallback } from "react";
import userService from "../services/user.service";
import type {
  UserProfile,
  AdminUsersQueryParams,
  AdminUsersPagination,
  ReviewKycDto,
} from "../types/user";
import { extractErrorMessage } from "./useAuthActions";

export const useAdminUsers = (initialParams?: AdminUsersQueryParams) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [pagination, setPagination] = useState<AdminUsersPagination>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<AdminUsersQueryParams>(initialParams || { page: 1, limit: 10 });

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.getAdminUsers(params);
      setUsers(data.users || []);
      setPagination(data.pagination);
      return data;
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to fetch platform users.");
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const reviewKyc = useCallback(
    async (userId: string, dto: ReviewKycDto): Promise<UserProfile> => {
      try {
        const updated = await userService.reviewKyc(userId, dto);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, ...updated } : u))
        );
        return updated;
      } catch (err) {
        const msg = extractErrorMessage(err, "Failed to review KYC application.");
        setError(msg);
        throw err;
      }
    },
    []
  );

  return {
    users,
    pagination,
    isLoading,
    error,
    params,
    setParams,
    refetch: fetchUsers,
    reviewKyc,
  };
};

export default useAdminUsers;
