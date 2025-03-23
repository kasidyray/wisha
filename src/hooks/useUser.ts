import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth';
import type { User } from '@/lib/mock-db/types';

interface UseUserOptions {
  /**
   * If true, will attempt to refresh user data on every call.
   * Useful for pages that need the most up-to-date user data.
   */
  refreshOnAccess?: boolean;
}

/**
 * Hook to access the current user's data
 * Can optionally refresh the user data on each call
 */
export function useUser(options: UseUserOptions = {}) {
  const { refreshOnAccess = false } = options;
  const { user, isLoading } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState<User | null>(user);

  useEffect(() => {
    setUserData(user);
  }, [user]);

  const refreshUser = async () => {
    if (!user?.id) return;
    
    try {
      setRefreshing(true);
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUserData(currentUser.profile);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // If refreshOnAccess is true, refresh user data when hook is called
  useEffect(() => {
    if (refreshOnAccess && !isLoading && user) {
      refreshUser();
    }
  }, [refreshOnAccess, isLoading]);

  return {
    user: userData,
    isLoading: isLoading || refreshing,
    refreshUser,
  };
} 