"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactElement, ReactNode } from "react";
import type { RecordModel } from "pocketbase";
import pb from "@/lib/pocketbase";
import { logger } from "@/lib/logger";

export interface AuthContextValue {
  user: RecordModel | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    passwordConfirm: string,
  ) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }): ReactElement {
  const [user, setUser] = useState<RecordModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hydrate from stored auth on mount
    if (pb.authStore.isValid) {
      setUser(pb.authStore.record);
    }
    setIsLoading(false);

    // Listen for auth state changes (e.g., token refresh, logout from another tab)
    const unsubscribe = pb.authStore.onChange((_token, record) => {
      setUser(record);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      const authData = await pb
        .collection("users")
        .authWithPassword(email, password);
      setUser(authData.record);
      logger.info("User logged in", { userId: authData.record.id });
    },
    [],
  );

  const register = useCallback(
    async (
      email: string,
      password: string,
      passwordConfirm: string,
    ): Promise<void> => {
      await pb
        .collection("users")
        .create({ email, password, passwordConfirm });
      // Auto-login after registration
      const authData = await pb
        .collection("users")
        .authWithPassword(email, password);
      setUser(authData.record);
      logger.info("User registered and logged in", {
        userId: authData.record.id,
      });
    },
    [],
  );

  const logout = useCallback((): void => {
    pb.authStore.clear();
    setUser(null);
    logger.info("User logged out");
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, login, register, logout }),
    [user, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
