// src/hooks/useUserDetail.ts
import { useState, useEffect, useCallback } from "react";
import { userDetailService } from "@/services/userDetailService";
import type { UserDetailResponse } from "@/types/userDetail";

interface UseUserDetailResult {
  userDetailData: UserDetailResponse | null;
  isLoading: boolean;
  error: string | null;
  refreshUserDetail: () => Promise<void>;
  clearError: () => void;
}

export const useUserDetail = (userId: number | null): UseUserDetailResult => {
  const [userDetailData, setUserDetailData] =
    useState<UserDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUserDetail = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await userDetailService.getUserDetail(id);

      if (response.success && response.data) {
        setUserDetailData(response.data);
      } else {
        setError("Failed to load user detail");
        setUserDetailData(null);
      }
    } catch (err) {
      console.error("Error loading user detail:", err);
      setError("Failed to load user detail");
      setUserDetailData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshUserDetail = useCallback(async () => {
    if (userId) {
      await loadUserDetail(userId);
    }
  }, [userId, loadUserDetail]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load user detail when userId changes
  useEffect(() => {
    if (userId) {
      loadUserDetail(userId);
    } else {
      setUserDetailData(null);
      setError(null);
      setIsLoading(false);
    }
  }, [userId, loadUserDetail]);

  return {
    userDetailData,
    isLoading,
    error,
    refreshUserDetail,
    clearError,
  };
};
